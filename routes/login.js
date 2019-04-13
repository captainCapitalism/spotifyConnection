const express       = require('express');
const request       = require('request'); 
const cors          = require('cors');
const querystring   = require('querystring');

const app = express();
const {client_id, redirect_uri, stateKey} = require('../config/config');
// const client_id = process.env.ID; 
// const client_secret = process.env.SECRET;
// const redirect_uri = process.env.REDIRECTURI;
// let stateKey = 'spotify_auth_state';


app.get('/', login);

function login(req, res) {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);
    const scope = 'user-read-private user-read-email user-library-read';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        })
    );
};
  
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = function(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
  
module.exports = app;