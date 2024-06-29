
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"game_manager"
  });

con.connect(function(err) {
if (err) throw err;
});
var sql=""


var fs = require("fs"); 
let counter=2;
const express=require('express');
const app=express()
const port=5000;

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 200, 
  message: "Too many requests from this IP, please try again later",
  legacyHeaders: false,
  standardHeaders: true
});


app.use(limiter);





const cors = require('cors');
var games= []
var devs = []
let devId = 0
let itemId = 0


function selectDevs(){

    sql = "SELECT dev_id, dev_name FROM developers"
    con.query(sql, (err, result) => {
        if(err){
            console.log("Error retrieving devs")
            throw err
        }
        else{

            devs = result.map(row => {
                return {id: row.dev_id, name: row.dev_name}
            })
            devId = getMaxId(devs) + 1
            
        }
    })

}

function selectGames(){
    sql = "SELECT game_id, game_name, game_desc, game_price, dev_name FROM games INNER JOIN developers ON games.dev_id = developers.dev_id"
    con.query(sql, (err, result) => {
        if(err){
            console.log("Error retrieving games")
            throw err
        }
        else{

            games = result.map(row => {
                return {
                    id: row.game_id,
                    name: row.game_name,
                    description: row.game_desc,
                    developer: row.dev_name,
                    price: row.game_price
                }
            })
            itemId = getMaxId(games) + 1
            console.log("ITEM ID START: "+itemId)
        }
    })
}


const { faker } = require('@faker-js/faker');

const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:5173','http://localhost:3000']
    },
})

io.on('connection', (socket) => {
    console.log("Connection:"+socket.id);
});


function createRandomGame(id){
    return {
        id:id,
        name:faker.commerce.productName(),
        developer:devs[0].name,
        price: faker.number.int({ min: 5, max: 100 })
    }
}


function validate(item){
    if(item.price < 0){
        return false;
    }
    if(getIdDev(item.developer) < 0){
        console.log("dev id not found")
        return false;
    }
    const re = new RegExp("^[a-zA-Z]");
    if(!re.test(item.developer)){
        return false;
    }
    if(!re.test(item.name)){
        return false;
    }
    return true;
}


function validateDev(item){
    const re = new RegExp("^[a-zA-Z]");
    if(!re.test(item.name)){
        return false;
    }
    return true;
}

function getMaxId(data) {
    let maxId = 0;
    for (const item of data) {
      if (item.id > maxId) {
        maxId = item.id;
      }
    }
    return maxId;
  }




function getIdDev(nameDev){
    for (const item of devs)
        if (item.name==nameDev)
        {
            return item.id;
            
        }
    return -1
}

function getNameDev(idDev){
    for (const item of devs)
        if (item.id==devs)
        {
            return item.name;
            
        }
    return -1
}




app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));
const bodyParser=require("body-parser");
const { rejects } = require('assert');
app.use(bodyParser.json());

// const { Console } = require('console');


function doSelects(){
    return new Promise((resolve, reject) => {
      selectDevs();
      selectGames();
    })
  }


async function initialize() {
    try {
        setTimeout(async () => {
            await selectDevs();
            await selectGames();
        })
        

        
        if (require.main === module || process.env.NODEMON_WORKER_ID) {
            app.listen(port, () => {
                console.log("Server started on port 5000!");
            });
        
        
        }


        app.post("/add",(req,res)=>{
            const game= {id:itemId,
                name:req.body.name,
                developer:req.body.developer,
                price:req.body.price,
                description:req.body.description};
        
            if(validate(game)){
                name="'"+game.name+"'"
                desc="'"+game.description+"'"
                sql = "INSERT INTO games VALUES("+game.id+","+name+","+desc+","+getIdDev(game.developer)+","+game.price+")"
                con.query(sql, function(err, result){
                    if(err){
                        console.log("Add err: "+err)
                        throw err
                    }
                    else {
                        console.log("Add success")
                    }
                })
                games.push(game);
        
                itemId+=1;
            
                fs.writeFile('./games.json', JSON.stringify(games), () => {
                    res.json(games);
                });
            
            }
            else {
                res.status(400).json({ message: 'Game data is wrong' });
            }
        });
        
        
        app.get("/games",(req,res)=>{
            counter = 2;
        
            jsonRes = {
                "all" : games.length,
                "slice": games.slice(0,counter)
            }
        
            res.json(jsonRes);
        }
        );
        
        app.get("/games/:id",(req,res)=>{
            const id=parseInt(req.params.id);   
            const game = games.find(element => element.id == id);
        
            if (!game) {
                // game with the specified ID does not exist
                res.status(404).send("Game not found");
                return;
            }
        
            res.json(game);
        });
        
        
        app.get("/sort",(req,res)=>{
            const ascending = parseInt(req.query.sortValue);
            games.sort(function(a, b) {
                return (a.price - b.price) * ascending;
            });
        
            res.json(games.slice(0,counter));
        })
        
        
        
        
        app.delete("/delete",(req,res)=>{
           const id= req.body.id;
        
            sql = "DELETE FROM games WHERE game_id="+id
            con.query(sql, function(err, result){
                if(err){
                    console.log("Delete err: "+err)
                }
                else{
                    console.log("Delete success")
                }
            })
        
        
           games=games.filter(element=>element.id!==id);
           fs.writeFile('./games.json', JSON.stringify(games), () => {
           res.json(games);
        
        
           counter-=1;
        });
        });
        
        
        app.patch("/update",(req,res)=>{
        
            const id=req.body.id;
        
            games=games.filter(element=>element.id!=id);
        
            const game= {id:req.body.id,
                name:req.body.name,
                developer:req.body.developer,
                price:req.body.price,
                description:req.body.description};
            
            name="'"+game.name+"'"
            description="'"+game.description+"'"
        
            if(validate(game)){
                games[req.body.position]=game
                sql = "UPDATE games SET game_name="+name+", dev_id="+getIdDev(game.developer)+", game_desc="+description+", game_price="+game.price+" WHERE game_id="+id 
                con.query(sql, function(err, result){
                    if(err){
                        console.log("Update err: "+err)
                        throw err
                    }
                    else{
                        console.log("Update success")
                    }
                })
        
                fs.writeFile('./games.json', JSON.stringify(games), () => {
                res.json(games);
             });
            }
            else {
                res.status(400).json({ message: 'Game data wrong' });
            }
        
        });
        
        app.get("/pages",(req,res)=>{
        
            jsonRes = {
                "all" : games.length,
                "slice": null
            }
        
            if(games.length - counter >= 2){ counter=counter+2;
        
        
                jsonRes["slice"] = games.slice(0,counter)
        
                return res.json(jsonRes);
            }
        
            else if(games.length - counter == 1) {
                counter+=1;
        
        
                jsonRes["slice"] = games.slice(0,counter)
        
                return res.json(jsonRes);
            }
            else{
        
                return res.json(jsonRes);
            }
        }
        )
        
        app.get('/health-check', (req, res) => {
            res.sendStatus(200);
        });
        
        setInterval(() => {
            if(devs.length > 0){
                const newItem = createRandomGame(++itemId); 
                
                name="'"+newItem.name+"'"
                description="''"
                sql="INSERT INTO games values("+newItem.id+","+name+","+description+","+getIdDev(newItem.developer)+","+newItem.price+")"
        
                con.query(sql,function(err,result) {
                    if (err){ 
                        console.log("Random add err:"+err);
                        throw err
                    }
                    else{
                        
                        console.log("Random add success");
                     }
                    });
                games.push(newItem);
                fs.writeFile('./games.json', JSON.stringify(games), () => {
                    io.emit('newItem', newItem);    
                });
                
            }
        }, 2000000);
        
        
        
        app.post("/add-dev", (req, res) => {
            const dev={
                id: devId,
                name: req.body.name
            }
        
            if(validateDev(dev)){
                name="'"+dev.name+"'"
        
                sql="INSERT INTO developers values("+dev.id+","+name+")"
        
                con.query(sql,function(err,result) {
                    if (err){ 
                        console.log("Add dev err: "+err);
                        throw err
            
                    }
                        else{
                               console.log("Add dev success");
                              
                        }
                    });
            
                devs.push(dev)
                devId++
            
                io.emit('changedTheDevs', devs);
        
                fs.writeFile('./developers.json', JSON.stringify(devs), () => {
                    res.json(devs);
                    });
            }
            else {
                res.status(400).json({ message: 'Dev data is wrong' });
            }
        })
        
        
        app.get("/get-devs", (req, res) => {
            res.json(devs)
        })
        
        app.get("/get-dev-by-id", (req, res) => {
            const id = parseInt(req.query.id)
            return res.json(devx.find(element=>element.id===id))
        })
        
        app.delete("/delete-dev",(req,res)=>{
            const id= req.body.id;
            sql="delete from developers where dev_id="+id
                con.query(sql,function(err,result) {
                    if (err){ 
                        console.log("Delete dev err: "+err)
                        throw err;
                    }
                   else{
                    console.log("Delete dev success")
                   }
                  });
            io.emit('changedTheDevs', devs);
            devs=devs.filter(element=>element.id!==id);


            games=games.filter(element=>getIdDev(element.developer)!==id)



            fs.writeFile('./developers.json', JSON.stringify(devs), () => {
            res.json(devs);});
         });
        
        
         app.patch("/update-dev",(req,res)=>{
        
            const id=req.body.id;
            devs=devs.filter(element=>element.id!=id);
            const dev= {id:req.body.id,
                name:req.body.name,
                };
            name="'"+dev.name+"'"
            if(validateDev(dev)){
               devs.push(dev);
               sql="update developers set dev_name="+name+" where dev_id="+dev.id
               con.query(sql, function(err) {
                   if (err){ 
                    console.log("Update dev err: "+err)
                    throw err;}
        
                   else{
                    console.log("Dev update success")
                   }
                 });
                 io.emit('changedTheDevs', devs);
            fs.writeFile('./developers.json', JSON.stringify(devs), () => {
                res.json(devs);
             }); 
            }
            else {
                res.status(400).json({ message: 'Developer data wrong' });
            }
        });
        

    } catch (error) {
        console.error("Error initializing:", error);
    }


}

initialize()


module.exports = {app, selectDevs, selectGames};



