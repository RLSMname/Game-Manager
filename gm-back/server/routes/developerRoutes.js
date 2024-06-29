const developerController = require('../controllers/developerController.js');

const router = require('express').Router();

// add a developer
router.post('/add', developerController.addDeveloper);

// get all developer
router.get('/all', developerController.getAllDevelopers);

// get developer by id
router.get('/:id', developerController.getOneDeveloper);

// get developer id by name
router.get('/name/:name', developerController.getDeveloperIdByName);

// update developer by id
router.put('/:id', developerController.updateDeveloper);

// delete developer by id
router.delete('/:id', developerController.deleteDeveloper);

module.exports = router;