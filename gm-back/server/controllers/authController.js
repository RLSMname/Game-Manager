const db = require("../models");
const User = db.users;
const Token = db.tokens;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//1.add User
const addUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  console.log("RECEIVED DATA: ", username, email, password);
  try {
    let existingUser = await User.findOne({ where: { username: username } });
    if (existingUser) {
      return res.status(409).json("User with this username already exists");
    }
    existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(409).json("User with this email already exists");
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });
    req.user = { username: req.body.username };
    next();
  } catch (error) {
    console.error("Error adding user:", error);
    return res.status(500).json("There is aleardy an user with this username");
  }
};

//2.sign up user
const signupUser = async (req, res) => {
  try {
    const user = req.user;
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//3.find user
//find user by username and password
const findUser = async (req, res, next) => {
  try {
    const username = req.body.username;
    const foundUser = await User.findOne({ where: { username: username } });
    console.log(foundUser);
    if (!foundUser) return res.status(404).json("User not found");
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      foundUser.password
    );
    console.log("Password body ", req.body.password);
    console.log("password found user ", foundUser.password);
    if (!passwordMatch) return res.status(401).json("Invalid password");
    else {
      req.user = { username: username };
      next();
    }
  } catch (error) {
    console.error("Error finding user:", error);
    return res.status(500).json("Internal server error");
  }
};

//4.login user
const loginUser = async (req, res) => {
  try {
    const user = req.user;
    console.log("GOT TO LOG IN: ", user);
    const accessToken = generateAccessToken(user);
    console.log(accessToken);
    const refreshToken = await generateRefreshToken(user);
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//generate token
function generateAccessToken(user) {
  console.log("USERR", user);
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "24h" });
}

const getUser = (token) => {
  try {
    const user = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    return user;
  } catch (error) {
    throw error;
  }
};

const generateRefreshToken = async (user) => {
  try {
    //change if you want
    const expiresInHours = 24 * 3;
    const expiresInMinutes = 0;
    const expiresInSeconds = 0;
    const expirationDate = new Date();
    expirationDate.setTime(
      expirationDate.getTime() +
        expiresInHours * 60 * 60 * 1000 +
        expiresInMinutes * 60 * 1000 +
        expiresInSeconds * 1000
    );

    const token = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "72h",
    });
    await Token.create({ token: token, expiresAt: expirationDate });
    return token;
  } catch (error) {
    console.error("Error generating and storing refresh token:", error);
    throw error;
  }
};

//logout
const logout = async (req, res) => {
  try {
    await Token.destroy({
      where: {
        token: req.body.token,
      },
    });
  } catch (error) {
    console.error("Error deleting token in database:", error);
    res.status(500).json("Internal server error");
  }
  res.status(200).json("Successfully logged out");
};

//find token
const findToken = async (req, res) => {
  try {
    const token = req.body.token;
    const foundToken = await Token.findOne({ where: { token: token } });
    if (!foundToken)
      return res.status(200).json("No such  refresh token stored ");
    else res.status(400);
  } catch (error) {
    console.error("Error searching for token in database:", error);
    return res.status(500).json("Internal server error");
  }
};

//verify the expirations dates of teh refresh tokens in the dtaabse
const verifyExpiration = (token) => {
  return token.expiresAt.getTime() < new Date().getTime();
};

//generate new token based on refresh token
const getNewTokenBasedOnRefreshToken = async (req, res) => {
  const requestToken = req.body.token;
  if (requestToken == null)
    res.sendStatus(401).json({ message: "Refresh Token is required!" });
  try {
    let refreshToken = await Token.findOne({ where: { token: requestToken } });
    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }
    if (verifyExpiration(refreshToken)) {
      Token.destroy({ where: { token: refreshToken.token } });

      res
        .status(403)
        .json({
          message:
            "Refresh token was expired. Please make a new signin request",
        });
      return;
    }
    let user;
    user = getUser(requestToken);
    const username = user.username;
    const newAccessToken = generateAccessToken({ username: username });
    console.log(newAccessToken);
    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addUser,
  findUser,
  loginUser,
  signupUser,
  getNewTokenBasedOnRefreshToken,
  logout,
  findToken,
};
