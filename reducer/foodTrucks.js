import http from 'axios';
import lodash from 'lodash';
import {sfDataAuth} from "../credentials";
import haversine from 'haversine';

class FoodTrucks{
  constructor({token}){
    //get Data as soon as possible, prepData return a promise
    this.getData = this.prepData().then((results) => {
      this.structureDate(results.data);
    });
  }

  prepData(){
    //filter only approved trucks
    return http.get("https://data.sfgov.org/resource/6a9r-agq8.json?$where=status='APPROVED' OR status = 'ISSUED'",{
              params: {
                "$$app_token" : sfDataAuth.token
              }
            }).catch((error) => {
              console.log(error);
            })
  }



  structureDate(dataArray){
    const trucks = {}
    //filterout any trucks that does not have dayshours
    dataArray = dataArray.filter((t) => t.dayshours);
    dataArray.forEach((truck) => {
      let {
        applicant: name,
        latitude: lat,
        longitude: lng,
        address,
        locationdescription,
        dayshours,
        fooditems
      } = truck;

      let dataObject = {name, lat, lng, address, locationdescription, dayshours: this.parseSchedule(dayshours), fooditems}
    })
  }

  parseDayString(dayString){
    //from formats: Mo/Mo/Mo/Mo/Mo, Mo-Fr, Tu/Th/Sa
    // Mo/Mo/Mo/Mo/Mo to [1], Mo-Fr to [1,2,3,4,5], Tu/Th/Sa to [2,4,6]
    const dayMap = {
      mo: 1, tu: 2, we: 3, th: 4, fr: 5, sa:6, su: 0
    }
    let weekDays;
    if(_.includes(dayString,"-")) {
      let [startDay, endDay] = dayString.toLowerCase().split("-").map((d)=> dayMap[d]);
      //check if end day is Sunday, data structured to have sunday to be last day of the week
      weekDays = endDay === 0? [0,..._.range(startDay, 7)] : _.range(startDay, endDay + 1);
    }else{
      weekDays = _.uniq(dayString.split("/"))
    }
    return weekDays;
  }

  parseHours(timeString){
    //from 10AM-11AM/3PM-4PM to [[10,11],[15,16]]
    try{
      let allTimeBlocks = timeString.split("/").map((tb) => {
        let timeBlock = tb.toLowerCase().split("-").map((hour) => {
          //using 24 hour clock
          let h = Number(hour.match(/[0-9]+/)[0]);
          return _.includes(hour,"pm") && h < 12? h + 12 : h
        });

        return timeBlock
      });
      return allTimeBlocks; //ex: [[10,11],[15,16]]
    }catch(e){
      console.log(e);
      return timeString;
    };

  }

  parseSchedule(dayshours){
    //this function parse the dayshours property of foodtruck to determine if it's an option
    const today = new Date();
    const weekDay = today.getDay();
    const time = today.getHours();

    //ex. dayshours: Mo/Mo/Mo/Mo/Mo:7AM-8AM/9AM-11AM;Su/Su/Su/Su/Su:9AM-2PM;Sa/Sa/Sa/Sa/Sa:9AM-3PM;Mo/Mo/Mo/Mo/Mo:11AM-1
    //ex. dayshours2: Mo-Fr:10AM-11AM/3PM-4PM
    //ex. dayshours3: Tu/Th/Sa:10AM-7PM
    //this split the different timeframe of a truck appear at the location into Array
    let schedule = dayshours.split(";");
    //each time frame can be in the formate of weekday range ex. Mo-Fr: time, Mo/Tu: time, Su:time
    //or Su/Su/Su:time which will be treated as Su

    return schedule.map((sch) => {
      let [days, times] = sch.split(":");
      if(days.length > 0 && times.length > 0){
        return {days: this.parseDayString(days), times: this.parseHours(times)}
      }else{
        return undefined
      }
    })
  }

  getNearByTrucks({lat, lng}){
    //getData is a promise
    const p = new Promise((resolve, reject) => {
      this.getData.then((result) => {
        const nearbyTrucks = result.data.filter((truck)=>{
          const {latitude, longitude, applicant} = truck;

          //some trucks don't have lat lng data
          if(latitude === "0" || longitude === "0"){
            //do nothing for now
          }else{
            let start = {latitude: lat, longitude: lng};
            let end = {latitude, longitude};

            let closeby = _.round(haversine(start, end, {unit: 'mile'}),1) <= 2;

            return _.round(haversine(start, end, {unit: 'mile'}),1) <= 2
          }
        });

        resolve(nearbyTrucks);
      })
    });

    return p
  }
}




export default new FoodTrucks(sfDataAuth)
