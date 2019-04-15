const   express       = require('express'),
        fs            = require('fs'),
        app           = express();

app.get("/", fetchFolders);
app.post("/", createFolder);
app.put("/", editFolder);

function editFolder(req, res){
    console.log(req.body);
    res.send({msg: "put route"});
}

function fetchFolders(req, res){
    let file = JSON.parse(fs.readFileSync("folders.json"));
    res.send({msg: "Fetched folders", file});
}

function createFolder(req, res){
    if(req.body && req.body.name){
        const result = appendJSON("folders.json", req.body.name);
        res.send(result);
    } else {res.send({error: "Missing name"})}
}

function appendJSON(fileName, data){
    let file = JSON.parse(fs.readFileSync(fileName));
    if(data in file){
        return {msg:{error: "folder with given name already exists"}, file};
    } else {
        file[data] = {};
        fs.writeFileSync(fileName, JSON.stringify(file));    
        return {msg: {success: "folder created"}, file};
    }
}



module.exports = app;