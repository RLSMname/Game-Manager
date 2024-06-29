const request = require('supertest');
const app = require('./server'); 

describe('Developer API Endpoints', () => {
    let developerId;
  
    it('should add a new developer', async () => {
      const res = await request(app)
        .post('/api/devs/add')
        .send({
          name: 'Test Developer'
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id');
      developerId = res.body.id; // store the developer id for later tests
    });
  
    it('should get all developers', async () => {
      const res = await request(app)
        .get('/api/devs/all');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
  
    it('should get a developer by id', async () => {
      const res = await request(app)
        .get(`/api/devs/${developerId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.id).toEqual(developerId);
    });

    it('should get developer ID by name', async () => {
      const developerName = 'Test Developer';
      const res = await request(app)
        .get(`/api/devs/name/${developerName}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body.id).toEqual(developerId);
    });
  
    it('should return error if developer name not found', async () => {
      const nonexistentDeveloperName = 'Nonexistent Developer';
      const res = await request(app)
        .get(`/api/devs/name/${nonexistentDeveloperName}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', 'Developer not found');
    });

    it('should update a developer by id', async () => {
      const res = await request(app)
        .put(`/api/devs/${developerId}`)
        .send({
          name: 'Updated Developer'
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([1]); 
    });
  
    it('should return error for invalid addDeveloper request', async () => {
      const invalidDeveloper = { name: '' }; // Empty name is invalid
      const res = await request(app)
        .post('/api/devs/add')
        .send(invalidDeveloper);
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'Invalid developer data');
    });
  
    it('should return error for invalid updateDeveloper request', async () => {
      const invalidUpdateData = { name: '' }; 
      const res = await request(app)
        .put(`/api/devs/${developerId}`)
        .send(invalidUpdateData);
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'Invalid developer data');
    });

    it('should delete a developer by id', async () => {
      const res = await request(app)
        .delete(`/api/devs/${developerId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.text).toEqual('developer deleted');
    });
  
    it('should not get a deleted developer', async () => {
      const res = await request(app)
        .get(`/api/devs/${developerId}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({
        error: "Developer not found"
      }); 
    });
  });




  describe('Game API Endpoints', () => {
    let developerId;
    let gameId;
  
    beforeAll(async () => {
      // Add a test developer
      const developerRes = await request(app)
        .post('/api/devs/add')
        .send({ name: 'Test Developer' });
      
      developerId = developerRes.body.id;
      console.log("BODY: ",developerRes.body);
    });
  
    afterAll(async () => {
      // Delete the test game and developer after running the tests
      if (gameId) {
        await request(app).delete(`/api/games/${gameId}`);
      }
      if (developerId) {
        await request(app).delete(`/api/devs/${developerId}`);
      }
    });
  
    it('should return error for invalid addGame request', async () => {
      const invalidGame = { 
        name: '',
        developer: 'Test Developer',
        price: 20,
        description: 'Test Description'
      }; // Invalid name
      const res = await request(app)
        .post('/api/games/add')
        .send(invalidGame);
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'Invalid game data');
    });
  
    it('should successfully add game with valid data', async () => {
      const validGame = {
        name: 'Valid Game',
        developer: 'Test Developer',
        price: 20,
        description: 'Test Description'
      };
      const res = await request(app)
        .post('/api/games/add')
        .send(validGame);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', validGame.name);
      gameId = res.body.id;
    });
  
    it('should return error if developer not found when adding game', async () => {
      const invalidGame = {
        name: 'Invalid Game',
        developer: 'nonexistent_name',
        price: 10,
        description: 'Test Description'
      };
      const res = await request(app)
        .post('/api/games/add')
        .send(invalidGame);
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'Invalid game data');
    });
  
    it('should return error for invalid updateGame request', async () => {
      const invalidUpdateData = { name: '', developer: '' }; // Empty name is invalid
      const res = await request(app)
        .put(`/api/games/${gameId}`)
        .send(invalidUpdateData);
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'Invalid game data');
    });
  
    it('should successfully update game with valid data', async () => {
      const validUpdateData = { 
        name: 'Valid Game',
        developer: 'Test Developer',
        price: 120,
        description: 'Test Description'
       };
      const res = await request(app)
        .put(`/api/games/${gameId}`)
        .send(validUpdateData);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([1]);
    });
  
    it('should successfully get all games', async () => {
      const res = await request(app)
        .get('/api/games/all');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
  
    it('should successfully get one game by id', async () => {
      const res = await request(app)
        .get(`/api/games/${gameId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id', gameId);
    });
  
    it('should return error for non-existent game', async () => {
      const nonExistentGameId = 12345; // Non-existent ID
      const res = await request(app)
        .get(`/api/games/${nonExistentGameId}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', 'Game not found');
    });
  
    it('should successfully delete game by id', async () => {
      const res = await request(app)
        .delete(`/api/games/${gameId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.text).toEqual('game deleted');
    });
  });
  