const express       = require('express'); 
const request       = require('request'); 
const querystring   = require('querystring');

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
        process.env.ACCESS_TOKEN = body.access_token;
        const options = {
                url: 'https://api.spotify.com/v1/me/albums?offset=0&limit=50',
                headers: {'Authorization': 'Bearer ' + access_token},
                json: true,
        };
        const images = requestAlbums(options);
        images.then( resolve => {
            console.log(resolve);
            res.render('albums', {body: resolve});
        }).catch( error => console.log(error));
        } else { sendError(res, 'invalid_token') }
    });
}

async function requestAlbums(options, images=[]){
    const promise = new Promise( (resolve, reject) => {
        request.get(options, function(error, response, body){
            if(error){
                console.log(error);
                reject(error);
            } else {
                images = body.items.map(mapAlbum);
                if(body.next){
                    options.url = body.next;
                    requestAlbums(options, images).then( output => {
                        resolve(images.concat(output));
                    }).catch( error => console.log(error));
                } else {
                    resolve(images);
                }
            }
        });
    });
    let result = await promise;
    return result;
}

function mapAlbum({ added_at, album }){
    let object = {}
    object['id'] = album.id;
    object['url'] = album.external_urls['spotify'];
    object['image'] = album.images[1].url;
    object['artist'] = album.artists[0].name;
    object['name'] = album.name;
    return object;
}

function sendError(res, error){
    res.redirect('/#' +
    querystring.stringify({ error: error})
    );
}
  
module.exports = app;