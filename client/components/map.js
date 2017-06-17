import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {updateUserLocation} from '../../actions'

class Map extends Component {

	render() {
    var mapStyle = {
      height: '300px',
      width: '100%'
    }

    return(<div className="googleMap">
            <div className='GMap-canvas' ref="mapCanvas" style={mapStyle}>
            </div>
          </div>)
  }

  defaultLatLng(addressString) {
    //use google geocoder to get lat lng of Address String
    this.geocoder = new google.maps.Geocoder;

    const p = new Promise((resolve, reject) => {
      this.geocoder.geocode({'address': 'San Francisco, CA, US'}, (results, status) => {
        if(status == google.maps.GeocoderStatus.OK) {
          const lat = results[0].geometry.location.lat();
          const lng = results[0].geometry.location.lng();

          resolve({lat,lng});
        }else{
          console.log("trouble loading map")
        }
      })
    });

    return p;
  }

  createMap({lat, lng}) {
    //create google map object
    let mapOptions = {
      zoom: this.props.zoom,
      center: {lat, lng},
      scrollwheel: false
    }
    const map = new google.maps.Map(this.refs.mapCanvas, mapOptions);
    this.map = map;
    this.createMarker({lat, lng});
  }

  createMarker({lat, lng}){
    let marker = new google.maps.Marker({
      position: {lat, lng},
      map: this.map
    })
  }

  locateUser(){
    //location already set to be San Francisco and map already generated
    //so user dont have to provide location to render map
    navigator.geolocation.getCurrentPosition((pos)=>{
      //if user approve geolocate
      const {latitude:lat, longitude:lng} = pos.coords;
      const latlng = {lat,lng}
      this.props.updateUserLocation(latlng);
      this.createMap(latlng)
    });
  }

  getCurrentPosition(){
    navigator.geolocation.getCurrentPosition((pos)=>{
      const {latitude:lat, longitude:lng} = pos.coords;
      console.log(lat,lng)
    })
  }

  componentWillMount(){
    //injecting googlemap api script
    const script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDtsebK5eDAtda63jlVcqLMgnMdmBKgbiU";
    script.async = true;
    script.defer = true;

    //assigning script to props for event handling after componentDidMount
    this.mapApi = script;
    document.body.appendChild(script);
  }

  componentDidMount() {
    window.test = this.getCurrentPosition;
    //render map after component mounted
    this.mapApi.onload = () => {
          if (!google){
            console.log("googleMapApi injection failed");
          }
          //create Map as soon as map component is mounted
          //getting user location even pre-approved takes seconds
          //this will create better experience by rendering the map in SF first
          //then update map when userlocation is avaliable
          if(this.props.userLocation){
            this.createMap(this.props.userLocation);
          }else{
            this.defaultLatLng(this.props.city)
              .then((latlng) => {
                this.createMap(latlng)
              })
          }
          //prompt to locate user

          this.locateUser()
        }
  }
}

const mapStateToProps = (state) => {
  const {zoom, city, userLocation} = state.mapProps;
  const {foodTrucks} = state;
  return {
    zoom,
    city,
    userLocation,
    foodTrucks
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    updateUserLocation: updateUserLocation
  }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Map);
