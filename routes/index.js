const express       = require('express'); 
const request       = require('request'); 
const cors          = require('cors');
const querystring   = require('querystring');
const cookieParser  = require('cookie-parser');


const {client_id, client_secret, redirect_uri, stateKey} = require('../config/config');
const app = express();


app.get('/callback', getAlbums);

function getAlbums(req, res){

    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;
  
    if (state === null || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        res.clearCookie(stateKey);
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };
  
        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {
            var access_token = body.access_token,
                refresh_token = body.refresh_token;
    
            var options = {
                url: 'https://api.spotify.com/v1/me/albums',
                headers: {'Authorization': 'Bearer ' + access_token},
                json: true
            };
    
            // use the access token to access the Spotify Web API
            request.get(options, function(error, response, body) {
                console.log(body);
            });
            // we can also pass the token to the browser to make requests from there
            res.redirect('/#' +
                querystring.stringify({
                access_token: access_token,
                refresh_token: refresh_token
                }));
            } else {
            res.redirect('/#' +
                querystring.stringify({
                error: 'invalid_token'
                }));
            }
        });
    }
};
  
module.exports = app;