const express = require('express');
const app = express();
const path = require('path');
const http = require('axios');
const oauth = require('oauth');
const querystring = require('querystring');
const rootPath = path.resolve(__dirname,"..");
// const oauthSignature = require('oauth-signature');
const {yelpAuth , sfDataAuth} = require("../credentials");

app.use(function(req, res, next) {
  // console.log(req)
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const OAuth = oauth.OAuth;

class YelpApi {

  constructor({token, tokenSecret, consumerKey, consumerSecret}) {
    this.baseUrl = 'https://api.yelp.com/v2/';
    this.token = token;
    this.tokenSecret = tokenSecret;
    this.oauth = new OAuth(null, null, consumerKey, consumerSecret, '1.0', null, 'HMAC-SHA1');
  }

  search(params, callback){
    this.oauth.get(
      `${this.baseUrl}search?${querystring.stringify(params)}`,
      this.token, this.tokenSecret,
      (err, data, response) => {
          // const result = JSON.parse(data);
          callback(data)
      }
    )
  }
}

const yelp = new YelpApi(yelpAuth);

app.use(express.static(rootPath));

app.get('/test', (request, response) => {
  yelp.search({term: 'popeyes', location: "san francisco"})
})

app.get("/", (request, response) => {
  response.send("shit")
})

app.get('/search_yelp', (request, response) => {
  let name = request.query.name;
  let p = new Promise((resolve, reject) => {
    yelp.search({term: name, location: "San Francisco"}, resolve)
  })
  p.then((data)=>{
    // console.log(data);
    response.json(data)
  })
})

//listen on port 3000
app.listen(process.env.PORT || 8000, function () {
  console.log("serving on port 8000");
});
