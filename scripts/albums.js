(function fetchFolders(){
    const ajaxOptions = {
        url: "/folder",
        method: "get",
        callback: function(data){
            createFoldersDatalist(data.file);
            createMissingFolders(data);
        }
    }
    ajax(ajaxOptions);
})();

function createFoldersDatalist(data){
    const datalist = document.createElement("datalist");
    datalist.id = "folder-list";
    for(key in data){
        const option = document.createElement("option");
        option.value = key;
        datalist.appendChild(option);
    }
    document.body.appendChild(datalist);
    
}

function createFolder(){
    const folderName = document.getElementById("folder-name").value;
    if(folderName){
        const ajaxOptions = {
            url: "/folder",
            method: "post",
            data: {name: folderName},
            callback: createMissingFolders
        }
        ajax(ajaxOptions);
    } else {
        console.log("error: No name provided");
    }
}

function createMissingFolders(data){
    if(data){
        console.log(data.msg);
        const folders = data.file;
        const folderContainer = document.getElementById("folder-container");
        for(key in folders){
            const element = document.getElementById("folder-"+key);
            if(!element){
                const newElement = document.createElement('div');
                newElement.id = ('folder-'+key);
                newElement.classList.add("folder");
                newElement.innerHTML=key;
                folderContainer.appendChild(newElement);
            }
        }    
    } else {console.log("Did not receive data")}
}

function addToFolder(id){
    const albumContainer = document.getElementById(id);
    const folder = albumContainer.getElementsByTagName('input')[0].value;
    const albumData = {
        url: albumContainer.getElementsByTagName('a')[0].href, 
        name: albumContainer.getElementsByClassName('name')[0].innerHTML,
        artist: albumContainer.getElementsByClassName('artist')[0].innerHTML,
        img: albumContainer.getElementsByTagName('img')[0].src
    };
    if(albumData.url && albumData.name && albumData.artist && albumData.img && folder){
        const ajaxOptions = {
            url: "/folder/album",
            method: "post",
            data: {
                albumData: albumData,
                folder: folder
            },
            callback: callback
        }
        ajax(ajaxOptions);
    } else {console.log("Error retriving data");}
    
}

function callback(data){
    console.log(data);
}