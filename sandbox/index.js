const express = require('express');
const app = express();
const path = require('path');
const http = require('axios');
const oauth = require('oauth');
const querystring = require('querystring');
const rootPath = path.resolve(__dirname,"..");
// const oauthSignature = require('oauth-signature');
const {yelpAuth , sfDataAuth} = require("../credentials");

console.log(yelpAuth,sfDataAuth)

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
          const result = JSON.parse(data);
          console.log(data)
      }
    )
  }
}

const yelp = new YelpApi(yelpAuth);

app.use(express.static(rootPath));

app.get('/test', (request, response) => {
  yelp.search({term: 'popeyes', location: "san francisco"})
})

app.get('/', (request, response) => {
  http.get('https://data.sfgov.org/resource/6a9r-agq8.json?$where=objectid > 0',{
    params: {
      "$$app_token" : sfDataAuth.token
    }
  })
    .then((response) => {
      let allTrucks = response.data;
      console.log(allTrucks)
    })
    .catch((error) => {
      console.log(error);
    })
})

//listen on port 3000
app.listen(process.env.PORT || 8080, function () {
  console.log("serving on port 8080");
});
