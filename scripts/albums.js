function createFolder(){
    const folderName = document.getElementById('folder-name').value;
    const ajaxOptions = {
        url: "/folder",
        method: "post",
        data: {name: folderName},
        callback: function(data){
            console.log(data);
        }
    }
    ajax(ajaxOptions);
}

function myFunction(id){
    console.log(id);
}