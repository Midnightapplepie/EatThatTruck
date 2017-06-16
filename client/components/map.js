import React, { Component } from 'react';

class Map extends Component {

	render() {
    var mapStyle = {
      height: '300px',
      width: '100%'
    }

    return <div className="googleMap">
      <div className='UpdatedText'>
        <p>Current Zoom: { this.props.zoom }</p>
      </div>
      <div className='GMap-canvas' ref="mapCanvas" style={mapStyle}>
      </div>
    </div>
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
    this.createMarker(this.mapCenter);
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

  createMarker({lat, lng}){
    let marker = new google.maps.Marker({
      position: {lat, lng},
      map: this.map
    })
  }

  locateUser(){
    navigator.geolocation.getCurrentPosition((pos)=>{
      //if user approve geolocate
      const {latitude:lat, longitude:lng} = pos.coords;
      this.mapCenter = {lat,lng}
      this.createMap(this.mapCenter)
    },()=>{
      console.log("sad")
      //when user decline geolocate
      this.defaultLatLng("San Francisco, CA, US")
        .then((latlng) => {
          this.mapCenter = latlng;
          this.createMap(this.mapCenter)
        })
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
    //render map after component mounted
    this.mapApi.onload = () => {
          if (!google){
            console.log("googleMapApi injection failed");
          }
          //prompt to locate user
          this.locateUser()
        }
  }
}

Map.defaultProps = {
  zoom : 13,
  location : "San Francisco",
}

export default Map;
