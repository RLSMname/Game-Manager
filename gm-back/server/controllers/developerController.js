const db = require("../models");
const validators = require("../utils/validations.js");
const io = require("../config/socketConfig.js");
const Developer = db.developers;

// main work

// 1. create developer
const addDeveloper = async (req, res) => {
  let info = {
    name: req.body.name,
  };
  console.log("RECEIVED DEV INFO: ", info);
  if (!validators.validateDev(info)) {
    return res.status(400).json({ error: "Invalid developer data" });
  }

  try {
    const developer = await Developer.create(info);
    return res.status(200).json(developer);
  } catch (error) {
    return res.status(500).json({ message: "Duplicate dev name" });
  }
};

// 2. get all developers
// attributes: [] columns u want

const getAllDevelopers = async (req, res) => {
  let developer = await Developer.findAll({});
  res.status(200).json(developer);
};

// 3. get one developer by id
const getOneDeveloper = async (req, res) => {
  let id = req.params.id;
  let developer = await Developer.findOne({
    where: { id: id },
  });

  if (!developer) {
    return res.status(404).json({ error: "Developer not found" });
  }

  res.status(200).json(developer);
};

// 4. update developer
const updateDeveloper = async (req, res) => {
  let id = req.params.id;

  const info = {
    name: req.body.name,
  };

  if (!validators.validateDev(info)) {
    return res.status(400).json({ error: "Invalid developer data" });
  }

  const result = await Developer.update(req.body, {
    where: { id: id },
  });

  res.status(200).json(result);
};

// 5. delete developer by id
const deleteDeveloper = async (req, res) => {
  let id = req.params.id;

  await Developer.destroy({
    where: {
      id: id,
    },
  });
  io.emit("devs changed");
  res.status(200).send("developer deleted");
};

// 6. get developer id by name
const getDeveloperIdByName = async (req, res) => {
  let name = req.params.name;
  const developer = await Developer.findOne({
    where: { name: name },
  });
  if (!developer) {
    return res.status(404).json({ error: "Developer not found" });
  }

  res.status(200).json({ id: developer.id });
};

module.exports = {
  addDeveloper,
  getAllDevelopers,
  getOneDeveloper,
  updateDeveloper,
  deleteDeveloper,
  getDeveloperIdByName,
};
