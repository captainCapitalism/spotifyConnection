const express       = require('express'); 
const request       = require('request'); 
const cors          = require('cors');
const querystring   = require('querystring');
const cookieParser  = require('cookie-parser');
const pug           = require('pug');

const {client_id, client_secret, redirect_uri, stateKey} = require('../config/config');
const app = express();

app.get("/", renderIndex);  
app.get('/callback', getAlbums);

function renderIndex(req, res){ res.render('index'); }

function getAlbums(req, res){
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;
  
    if (state === null || state !== storedState) {
        sendError(res, 'state_mismatch');
    } else {
        res.clearCookie(stateKey);
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };
        fetchAlbums(res, authOptions);
    }
};


function fetchAlbums(res, authOptions){
    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
        const access_token = body.access_token;
        const options = {
                url: 'https://api.spotify.com/v1/me/albums',
                headers: {'Authorization': 'Bearer ' + access_token},
                json: true
        };
        request.get(options, function(error, response, body) {
            console.log(body.items[5]);
            let images = body.items.map(
                album => {
                    let object = {}
                    object['url'] = album.album.external_urls['spotify']
                    object['image'] = album.album.images[1].url 
                    return object;
                });
            res.render('user', {body: images});
        });
        } else { sendError(res, 'invalid_token') }
    });
}


function sendError(res, error){
    res.redirect('/#' +
    querystring.stringify({ error: error})
    );
}
  
module.exports = app;