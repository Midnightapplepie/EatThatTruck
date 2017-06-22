import http from 'axios';
import _ from 'lodash';
import querystring from 'querystring';

class YelpApi {

  constructor() {
    this.baseUrl = 'http://localhost:8000/search_yelp/';
  }

  search(name){
    return http.get(this.baseUrl, {
      params: {
        name: name
      }
    });
  }
}

export default new YelpApi()
