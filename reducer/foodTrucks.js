import http from 'axios';
import _ from 'lodash';
import {sfDataAuth} from "../credentials";
import haversine from 'haversine';

class FoodTrucks{
  constructor({token}){
    //get Data as soon as possible, prepData return a promise
    this.getData = this.prepData();
  }

  prepData(){
    //filter only approved trucks
    let p = new Promise((resolve, reject) => {
      http.get("https://data.sfgov.org/resource/6a9r-agq8.json?$where=status='APPROVED' OR status = 'ISSUED'",{
        params: {
          "$$app_token" : sfDataAuth.token
        }
      }).then((results) => {
        resolve(this.structureDate(results.data));
      }).catch((error) => {
        console.log(error);
      });
    });

    return p;
  }

  structureDate(dataArray){
    const trucksData = []
    //filterout any trucks that does not have dayshours
    dataArray = dataArray.filter((t) => t.dayshours);
    dataArray.forEach((truck) => {
      let {
        applicant: name,
        latitude,
        longitude,
        address,
        locationdescription,
        dayshours,
        dayshours: scheduleString,
        fooditems
      } = truck;

      let dataObject = {name, latitude: Number(latitude), longitude: Number(longitude), address, locationdescription, dayshours: this.parseSchedule(dayshours), fooditems, scheduleString}
      trucksData.push(dataObject);
    });

    return trucksData;
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
    if(timeString){
      let allTimeBlocks = timeString.split("/").map((tb) => {
        let timeBlock = tb.toLowerCase().split("-").map((hour) => {
          //using 24 hour clock
          let h = Number(hour.match(/[0-9]+/)[0]);
          if((_.includes(hour,"pm") && h < 12) || hour == "12am"){
            h+=12
          }
          return h
        });

        return timeBlock
      });
      return allTimeBlocks; //ex: [[10,11],[15,16]]
    }else{
      //assume open 24 hour if timeString is not avaliable
      return [0,0]
    }

  }

  parseSchedule(dayshours){
    //this function parse the dayshours property of foodtruck to determine if should appear on the map
    //ex. dayshours: Mo/Mo/Mo/Mo/Mo:7AM-8AM/9AM-11AM;Su/Su/Su/Su/Su:9AM-2PM;Sa/Sa/Sa/Sa/Sa:9AM-3PM;Mo/Mo/Mo/Mo/Mo:11AM-1
    //ex. dayshours2: Mo-Fr:10AM-11AM/3PM-4PM
    //ex. dayshours3: Tu/Th/Sa:10AM-7PM
    //this split the different timeframe of a truck appear at the location into Array
    let schedule = dayshours.split(";");
    //each time frame can be in the formate of weekday range ex. Mo-Fr: time, Mo/Tu: time, Su:time
    //or Su/Su/Su:time which will be treated as Su

    //this function returns [{days:[],times:[]},{}...];
    return schedule.map((sch) => {
      let [days, times] = sch.split(":");

      //making sure data have both days and hours to parse
      return {days: this.parseDayString(days), times: this.parseHours(times)}
    })
  }

  isOpen(dayshours){
    //dayshours format:
    //[{days:[1,2,3], times: [[8,9],[11,12]]}, {days:[6], times: [[16,18]]}]
    //the above data mean truck will be at lat lng during Mo/Tu/We, between 8am-9am and 11am-12pm
    //and Saturaday between 4pm-6pm
    let today = new Date();
    let hoursToday = dayshours.filter((set) => {
      //filter any set where days inclues today and
      let openToday = _.includes(set.days, today.getDay());
      //current time fit one of the timeBlock
      let openNow = set.times.map((timeBlock) => {
        let startTime = timeBlock[0];
        let endTime = timeBlock[1];
        let now = today.getHours();
        //check if time is open 24 hour
        if(startTime === endTime){
          return true;
        }
        //for cases like now = 1am and endTime = 3am, and startTime = 10pm
        //10 > 1 so general test will fail
        if(startTime > endTime && endTime > now){
          return true
        }

        //if end time is next day, add 24 hour
        //for cases when startTime = 6pm and endTime = 3am and now 11pm
        //adding 24 will allow it to pass general test
        if(startTime > endTime){
          endTime += 24
        }

        return today.getHours() > startTime && today.getHours() < endTime
      })
      return openToday && _.includes(openNow, true);
    });
    //return either [qualify set] or []
    return hoursToday.length > 0
  }

  getNearByTrucks({lat, lng, radius = 2}){

    //getData is a promise
    const p = new Promise((resolve, reject) => {
      this.getData.then((data) => {
        const nearbyTrucks = data.filter((truck)=>{
          const {latitude, longitude, dayshours} = truck;

          //some trucks don't have lat lng data
          if(latitude === "0" || longitude === "0"){
            //do nothing for now
          }else{
            let start = {latitude: lat, longitude: lng};
            let end = {latitude, longitude};

            let closeby = _.round(haversine(start, end, {unit: 'mile'}),1) <= radius;
            let open = false;

            if(closeby){
              open = this.isOpen(dayshours)
            }

            return closeby && open
          }
        });

        resolve(nearbyTrucks);
      })
    });

    return p
  }
}




export default new FoodTrucks(sfDataAuth)
