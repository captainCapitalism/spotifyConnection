(function renderSite(){

    /**
     * Obtains parameters from the hash of the URL
     * @return Object
     */
    function getHashParams() {
      let hashParams = {};
      let e, r = /([^&;=]+)=?([^&;]*)/g,
          q = window.location.hash.substring(1);
      while ( e = r.exec(q)) {
         hashParams[e[1]] = decodeURIComponent(e[2]);
      }
      return hashParams;
    }

    const params = getHashParams();

    const access_token = params.access_token,
        error = params.error;

    if (error) {alert('There was an error during the authentication')} 
    else {
      if (!access_token) {        
          // render initial screen
          document.getElementById('login').style.display = 'block';
          document.getElementById('loggedin').style.display = 'none';
      }
    }
})();

function getAlbums(){
    console.log(21);
}

function sendRequest({url, callback, method, access_token}){
    if(url && callback && access_token && method){
        var xhr = new XMLHttpRequest();
        xhr.onload = function () { callback(JSON.parse(xhr.response), access_token); };
        xhr.open(method, url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
        xhr.send();   
    } else {
        console.log("missing request parameter")
    }
    
}

// function renderNames(response, access_token){
//     response.items.forEach( album => {
//         console.log(album);
//         let dataContainer = document.createElement('div');
//         let jsonAlbum = `<span class='title'>${album.album.name}</span> <span class='artist'>by ${album.album.artists[0].name}</span>`;
//         dataContainer.innerHTML = jsonAlbum;
//         document.body.appendChild(dataContainer);
//     });
//     document.getElementById('login').display = 'block';
//     document.getElementById('loggedin').display = 'none';
//     if(response.next){
//         fetchAlbums(access_token, response.next);
//     }
// }