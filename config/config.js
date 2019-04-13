module.exports = {
    client_id       : process.env.ID, 
    client_secret   : process.env.SECRET,
    redirect_uri    : process.env.REDIRECTURI,
    stateKey        : 'spotify_auth_state',
}