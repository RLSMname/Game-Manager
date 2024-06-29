const request = require('supertest');
const {app, selectDevs, selectGames} = require('./server'); 

//console.log(app)
const { faker } = require('@faker-js/faker');

var games= []
var devs = []
let devId = 0
let itemId = 0

function doSelects(){
  return new Promise((resolve, reject) => {
    selectDevs();
    selectGames();
  })
}


describe('SELECTS',  () => {
  

  it('should return a list of devs when GET /get-devs is called', async () => {
        const response = await request(app).get('/get-devs');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toBe("");
      });
})


function doOtherTests(){
  
}


// describe('CRUD Functionality', () => {
//   const newGameId = 150000;

//   it('should create a new game when POST /add is called', async () => {
//     const newGameData = {
//       id:newGameId,
//       name:'Game',
//       developer:'dev1',
//       price: 10
//     };

    


//     const response = await request(app)
//       .post('/add')
//       .send(newGameData);

//     expect(response.statusCode).toBe(200);
//     expect(response.body).toEqual(expect.any(Array));
//     expect(response.body.length).toBeGreaterThan(0);
//     const addedGame = response.body.find(game => game.name === newGameData.name);
//     expect(addedGame).toBeDefined();
//   });

//   it('should return an error message when POST /add is called with invalid data', async () => {
//     const invalidGameData = {
//       name: 'Invalid Game',
//       developer: 'Invalid Dev',
//       price: 10,  
//       description: 'Invalid Description'
//     };

//     const response = await request(app)
//       .post('/add')
//       .send(invalidGameData);

//     expect(response.statusCode).toBe(400);
//     expect(response.body).toHaveProperty('message', 'Game data is wrong');
//   });


//   it('should return a list of games when GET /games is called', async () => {
//     const response = await request(app).get('/games');
//     expect(response.statusCode).toBe(200);
//     expect(Array.isArray(response.body)).toBe(true);
//     expect(response.body.some(game => game.id === newGameId)).toBe(true);
//   });

//   it('should return a specific supply when GET /games/:id is called', async () => {
//     const response = await request(app).get('/games?id=${newGameId}');
//     expect(response.statusCode).toBe(200);
//     expect(response.body).toHaveProperty('id', newSupplyId);
//   });



 
//   it('should update a Game when PATCH /update is called', async () => {
//     const updatedGameData = {
//       id: newGameId,
//       name: 'Updated Game',
//       developer: 'dev1',
//       price: 20,
//       description: 'Updated Description'
//     };
//     const response = await request(app)
//       .patch('/update')
//       .send(updatedGameData);

//     expect(response.statusCode).toBe(200);
//     expect(response.body).toEqual(expect.any(Array));
//     const updatedGame = response.body.find(Game => Game.id === newGameId);
//     expect(updatedGame).toBeDefined();
//     expect(updatedGame).toMatchObject(updatedGameData);
//   });
//   it('should return an error message when PATCH /update is called with invalid data', async () => {
//     const invalidUpdateData = {
//       id: newGameId, 
//       name: 'Invalid Updated Game',
//       developer: 'Invalid Updated Dev',
//       price: -10, 
//       description: 'Invalid Updated Description'
//     };

//     const response = await request(app)
//       .patch('/update')
//       .send(invalidUpdateData);

//     expect(response.statusCode).toBe(400);
//     expect(response.body).toHaveProperty('message', 'Game data wrong');
//   });

//   it('should delete a Game when DELETE /delete is called', async () => {
//     const response = await request(app)
//       .delete('/delete')
//       .send({ id: newGameId });

//     expect(response.statusCode).toBe(200);
    
//     expect(response.body.some(Game => Game.id === newGameId)).toBe(false);
//   });

//     it('should return an object with id, name, developer, and price properties', () => {
//       const randomGame =  {
//         id:1000,
//         name:faker.commerce.productName(),
//         developer:faker.commerce.productName(),
//         price: faker.number.int({ min: 5, max: 100 })
//     }
//       expect(randomGame).toHaveProperty('id');
//       expect(randomGame).toHaveProperty('name');
//       expect(randomGame).toHaveProperty('developer');
//       expect(randomGame).toHaveProperty('price');
//     });
  
// });





// describe('CRUD Functionality DevS', () => {
//   let newDevId;

//   it('should create a new  developer when POST /add-dev is called', async () => {
//     const newDevData = {
//       name: 'Test Dev',
//     };

//     const response = await request(app)
//       .post('/add-dev')
//       .send(newDevData);

//     expect(response.statusCode).toBe(200);
//     expect(response.body).toEqual(expect.any(Array));
//     const addedDev = response.body.find(developer => developer.name === newDevData.name);
//     expect(addedDev).toBeDefined();
//     newDevId = addedDev.id;
//   });
//   it('should return an error message when POST /add-dev is called with invalid data', async () => {
//     const invalidDevData = {
//       name: '8 Invalid Dev',
//     };

//     const response = await request(app)
//       .post('/add-dev')
//       .send(invalidDevData);

//     expect(response.statusCode).toBe(400);
//     expect(response.body).toHaveProperty('message', 'Dev data is wrong');
//   });
//   it('should return a list of supplies when GET /get-devs is called', async () => {
//     const response = await request(app).get('/get-devs');
//     expect(response.statusCode).toBe(200);
//     expect(Array.isArray(response.body)).toBe(true);
//     expect(response.body.some(developer => developer.id === newDevId)).toBe(true);
//   });

//   it('should return a specific Game when GET /get-dev-by-id is called', async () => {
//     const response = await request(app).get('/get-dev-by-id/?id=${newDevId}');
//     expect(response.statusCode).toBe(200);
//     expect(response.body).toHaveProperty('id', newDevId);
//   });


//   it('should return an error message when PATCH /update-dev is called with invalid data', async () => {
//     const invalidUpdateData = {
//       id: newDevId, 
//       name: 'Invalid Updated Game',
//     };

//     const response = await request(app)
//       .patch(' /update-dev')
//       .send(invalidUpdateData);

//     expect(response.statusCode).toBe(400);
//     expect(response.body).toHaveProperty('message', 'Dev data wrong');
//   });


  
//});