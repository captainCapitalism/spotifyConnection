const   express       = require('express'),
        fs            = require('fs'),
        app           = express();

app.get("/", fetchFolders);
app.post("/", createFolder);
app.put("/", editFolder);

function editFolder(req, res){
    const file = JSON.parse(fs.readFileSync("folders.json"));
    if(req.body.folder in file){

        if(!(file[req.body.folder].includes(req.body.url))){
            file[req.body.folder].push(req.body.url);
            fs.writeFileSync("folders.json", JSON.stringify(file));
            res.send({msg: "Added album to folder"});
        } else {
            res.send({msg: "Album already in folder"});
        }
    } else {
        res.send({msg: "specified folder does not exists"});
    }
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
        file[data] = [];
        fs.writeFileSync(fileName, JSON.stringify(file));    
        return {msg: {success: "folder created"}, file};
    }
}



module.exports = app;