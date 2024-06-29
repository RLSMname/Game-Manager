const router = require('express').Router();
const authController=require('../controllers/authController');


router.get('/health-check', (req, res) => {
    res.sendStatus(200);
});

// auth stuff
router.post('/signup',authController.addUser,authController.loginUser);

router.post('/login',authController.findUser,authController.loginUser);

router.post('/refreshToken',authController.getNewTokenBasedOnRefreshToken);

router.post("/logout",authController.logout);

module.exports = router;