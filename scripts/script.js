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
          document.getElementById('login').style.display = 'block';
          document.getElementById('loggedin').style.display = 'none';
      }
    }
})();