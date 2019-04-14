function ajax({url, callback, method}){
    if(url && callback && method){
        var xhr = new XMLHttpRequest();
        xhr.onload = function () { callback(JSON.parse(xhr.response))};
        xhr.open(method, url);
        xhr.send();   
    } else { console.log("missing request parameter")}
}