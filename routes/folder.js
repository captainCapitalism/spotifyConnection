const   express       = require('express'),
        fs            = require('fs'),
        app           = express();

app.get("/", fetchFolders);
app.post("/", createFolder);
app.put("/", changeAlbumName);
app.delete("/", deleteAlbum);
app.post("/album", addAlbumToFolder);

function changeAlbumName(req, res){

}

function deleteAlbum(req, res){

}

function addAlbumToFolder(req, res){
    const file = JSON.parse(fs.readFileSync("folders.json"));
    if(req.body.folder in file){

        if(!containsObject(req.body.albumData, file[req.body.folder])){
            file[req.body.folder].push(req.body.albumData);
            fs.writeFileSync("folders.json", JSON.stringify(file, null, 4));
            res.send({msg: "Added album to folder"});
        } else {res.send({msg: "Album already in folder"})}
    } else {res.send({msg: "specified folder does not exists"})}
}

function containsObject(obj, list){
    for (let i = 0; i < list.length; i++) {
        if (list[i].url === obj.url) {
            return true
        }
    }
    return false;
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
    if(!(data in file)){
        file[data] = [];
        fs.writeFileSync(fileName, JSON.stringify(file, null, 4));    
        return {msg: {success: "folder created"}, file};
    } else {return {msg:{error: "folder with given name already exists"}, file}}
}



module.exports = app;