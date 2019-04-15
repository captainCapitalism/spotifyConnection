function ajax({url, data, callback, method}){
    if(url && callback && method){
        var xhr = new XMLHttpRequest();
        xhr.onload = function () { callback(JSON.parse(xhr.response))};
        xhr.open(method, url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));   
    } else { console.log("missing request parameter")}
}