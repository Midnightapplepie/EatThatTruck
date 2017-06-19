import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import Slider from './slider';
import FoodTruckList from './foodTruckList';
import LoadingIcon from './loadingIcon';
import InfoWindow from './infoWindow';

import {
  updateUserLocation,
  updateMapProps,
  updateNearByFoodTrucks,
  updateSearchValue,
  updateFilteredTrucks
} from '../../actions';

import FoodTrucks from '../../utils/foodTrucks.js'

require('../stylesheets/components/locationSearch.scss')
require('../stylesheets/components/map.scss')
// import YelpApi from '../../utils/yelpApi.js'
//yelp does not allow client side api calls, need to run server with api to make this call

class Map extends Component {

  handleMapUpdate(){
    const searchValue = this.props.searchValue.trim();
    const userLocation = this.props.userLocation;

    if (searchValue != ""){
      this.getLatLng(searchValue).then((latlng) => {
        this.updateMap(latlng)
      })
    }

    if(userLocation){
      this.updateMap(userLocation)
    }
  }

  addLoadingIcon(){
    const div = document.createElement("div");
    div.id = "loading-icon-container";
    ReactDOM.render(<LoadingIcon />, div)

    document.body.appendChild(div);
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
            this.updateMap(this.props.userLocation);
          }else{
            this.getLatLng(this.props.city)
              .then((latlng) => {
                this.updateMap(latlng);
              })
          }
          //prompt to locate user
        }
  }

  inputCheck(){
    return this.props.searchValue === ""? "" : "hide-label"
  }

	render() {

    const radiusBtnSetting = {
      id : "radius_filter",
      buttonDesc : "All Locations",
      sliderLabel : "Filter by Radius",
      buttonToggled: false,
      buttonOnclick: null,
      min : 1,
      max : 20,
      value : 2,
      step : 1
    }

    const openNowBtnSetting = {
      id : "open_now_filter",
      buttonDesc : "Open Now",
      buttonToggled: true,
      buttonOnclick: null,
      sliderLabel : "Filter by Business Hour",
      min : 0,
      max : 24,
      value : new Date().getHours(),
      step : 1
    }

    const searchValue = this.props.searchValue;

    return(
      <div className="map-container">
        <div id="truck-filter" className="truck-filter">
          <Slider setting={radiusBtnSetting} />
          <Slider setting={openNowBtnSetting}/>
          <div className="location-search">
            <button className="left-button"
                    onClick={()=>this.locateUser()}>
                    Use My Location
            </button>
            <div className="input-wrapper">
              <input type="text" id="location-input" className="location-input"
                     onChange = {(e) => this.updateSearchValue(e)}
                     value = {searchValue}
              />
              <label className={`location-input-label ${this.inputCheck()}`} htmlFor="location-input">Enter Location Here</label>
            </div>
            <button className="right-button"
                    onClick={()=> this.handleMapUpdate()}
                    >
                    Update Map
            </button>
          </div>
        </div>
        <div className="googleMap">
          <div className='GMap-canvas' ref="mapCanvas">
          </div>
        </div>
        {/* <FoodTruckList trucks={this.props.filteredTrucks}/> */}
      </div>
    )
  }

  updateSearchValue(e){
    const val = e.target.value;
    this.props.updateSearchValue({searchValue: val});
  }

  getLatLng(addressString) {
    //use google geocoder to get lat lng of Address String
    this.geocoder = new google.maps.Geocoder;

    const p = new Promise((resolve, reject) => {
      this.geocoder.geocode({'address': addressString}, (results, status) => {
        if(status == google.maps.GeocoderStatus.OK) {
          const lat = results[0].geometry.location.lat();
          const lng = results[0].geometry.location.lng();

          resolve({lat,lng});
        }else{
          alert("unable to get location")
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

  createMarker({lat, lng, truck}){
    let marker = new google.maps.Marker({
      position: {lat, lng},
      map: this.map,
    })

    if(!truck){
      marker.setIcon('https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png')
    }

    if(truck){
      let contentString = ReactDOM.render(InfoWindow(truck), document.createElement('div'));
      let infowindow = new google.maps.InfoWindow();
      infowindow.setContent(contentString)

      marker.addListener('click', function() {
        infowindow.open(this.map, marker);
      });
    }
  }

  locateUser(){
    //add loading icon
    this.addLoadingIcon();
    //location already set to be San Francisco and map already generated
    //so user dont have to provide location to render map
    navigator.geolocation.getCurrentPosition((pos)=>{
      //if user approve geolocate
      const {latitude:lat, longitude:lng} = pos.coords;
      const latlng = {lat,lng}
      this.props.updateUserLocation(latlng);

      //remove loading icon
      document.getElementById("loading-icon-container").remove();

      this.updateMap(latlng)
    });
  }

  updateMap(latlng){
    const {zoom, city} = this.props
    this.props.updateMapProps({zoom, city, mapCenter: latlng});
    this.createMap(latlng);

    const { lat ,lng } = latlng;
    const radius = this.props.radius_filter.value;
    const hour = this.props.open_now_filter.value;

    FoodTrucks.getNearByTrucks({lat, lng, radius, hour}).then((nearbyTrucks)=>{
      // this.props.updateFilteredTrucks({filteredTrucks: nearbyTrucks});
      nearbyTrucks.forEach((truck)=>{
        const {latitude, longitude} = truck;

        this.createMarker({lat: Number(latitude), lng: Number(longitude), truck: truck});
      })
    });
  }
}

const mapStateToProps = (state) => {
  const {zoom, city, mapCenter} = state.mapProps;
  const {
    userLocation,
    radius_filter,
    open_now_filter,
    searchValue,
    filteredTrucks
  } = state;

  return {
    zoom,
    city,
    userLocation,
    radius_filter,
    open_now_filter,
    searchValue,
    filteredTrucks
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    updateUserLocation,
    updateMapProps,
    updateNearByFoodTrucks,
    updateSearchValue,
    updateFilteredTrucks
  }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Map);
