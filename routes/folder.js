const   express       = require('express'),
        fs            = require('fs'),
        app           = express();
app.post("/", createFolder);

function createFolder(req, res){
    if(req.body && req.body.name){
        const msg = appendJSON("folders.json", req.body.name);
        if("success" in msg){
            res.send(msg);
        } else if("error" in msg){
            res.send(msg);
        }
    } else {
        res.send({error: "Missing name"});
    }
}

function appendJSON(fileName, data){
    let file = JSON.parse(fs.readFileSync(fileName));
    if(data in file){
        return {error: "folder with given name already exists"};
    } else {
        file[data] = {};
        fs.writeFileSync(fileName, JSON.stringify(file));    
        return {success: "folder created"};
    }
}



module.exports = app;