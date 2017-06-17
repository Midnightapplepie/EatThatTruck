import http from 'axios';
import lodash from 'lodash';
import {sfDataAuth} from "../credentials";
import haversine from 'haversine';

class FoodTrucks{
  constructor({token}){
    //get Data as soon as possible, prepData return a promise
    this.getData = this.prepData();
  }

  prepData(){
    return http.get("https://data.sfgov.org/resource/6a9r-agq8.json?$where=status='APPROVED' OR status = 'ISSUED'",{
              params: {
                "$$app_token" : sfDataAuth.token
              }
            }).catch((error) => {
              console.log(error);
            })
  }

  getNearByTrucks({lat, lng}){
    //getData is a promise
    this.getData.then((result) => {
      const trucks = _.sortBy(result.data, "status");
      trucks.filter((truck)=>{
        const {latitude, longitude} = truck;

        if(latitude === "0" || longitude === "0"){
          console.log(truck)
        }
        console.log(truck.status)


        let start = {latitude: lat, longitude: lng};
        let end = {latitude, longitude};

        // console.log(_.round(haversine(start, end, {unit: 'mile'}),1), latitude, longitude)
      })
    })
  }
}




export default new FoodTrucks(sfDataAuth)
