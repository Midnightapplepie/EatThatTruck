import http from 'axios';
import _ from 'lodash';
import {yelpAuth} from "../credentials";
import oauth from 'oauth';
import querystring from 'querystring';

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

export default new YelpApi(yelpAuth)
