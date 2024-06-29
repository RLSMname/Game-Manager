// const axios = require('axios');
const db = require('../models');
const Developer = db.developers;

const getIdDev = async name => {
    if(!name) return null;

    let developer = await Developer.findOne({
        where: {name: name}
    });
    if(!developer){
        return null;
    }
    return developer.id;
};

const validateDev = item => {
    const re = new RegExp("^[a-zA-Z]");
    if(!re.test(item.name)){
        return false;
    }
    return true;
};


const validateGame = item => {
    if(item.price < 0){
        return false;
    }
    if(!item.developer_id){
        return false;
    }
    const re = new RegExp("^[a-zA-Z]");
    if(!re.test(item.name)){
        return false;
    }
    return true;
};

//info = {name: ..., developer: 'xyz', price: ..., description:..}
const generateGameFromInfo = async info => {
    const game = {... info};
    game.developer_id = await getIdDev(info.developer);
    return game;
}

module.exports = {
    validateDev,
    validateGame,
    generateGameFromInfo
}