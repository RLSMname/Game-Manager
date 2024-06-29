const { faker } = require('@faker-js/faker');
const db = require('../models');
const Game = db.games;
const User=db.users;


//must take int account the FK association with User
const createRandomGame = () => {
    return {
        name:faker.commerce.productName(),
        developer:'dev1',
        price: faker.number.int({ min: 5, max: 100 })

    }
}


module.exports = {
    createRandomGame
}