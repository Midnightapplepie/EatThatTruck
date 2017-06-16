import React, { Component } from 'react';

class Map extends Component {
  // state = { zoom: 10 };
	render() {
    console.log("render")
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
    console.log("createmap")
    console.log(lat,lng);
    let mapOptions = {
      zoom: this.props.zoom,
      center: {lat, lng}
    }
    console.log(mapOptions.center)
    const map = new google.maps.Map(this.refs.mapCanvas, mapOptions)
  }

  defaultLatLng(addressString) {
    console.log("defaultLatLng")
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
          //set default center to SF
          this.defaultLatLng("San Francisco, CA, US")
            .then((data)=> {
              this.mapCenter = data;
              this.createMap(this.mapCenter);
            });
        }
    //component have to be mounted before injecting google scripts
    // this.marker = this.createMarker()
    // this.infoWindow = this.createInfoWindow()

    // have to define google maps event listeners here too
    // because we can't add listeners on the map until its created
    // google.maps.event.addListener(this.map, 'zoom_changed', ()=> this.handleZoomChange())
  }

  // clean up event listeners when component unmounts
  componentDidUnMount() {
    google.maps.event.clearListeners(map, 'zoom_changed')
  }

  // mapCenter() {
  //   return new google.maps.LatLng(
  //     this.props.initialCenter.lat,
  //     this.props.initialCenter.lng
  //   )
  // }

  // createMarker() {
  //   return new google.maps.Marker({
  //     position: this.mapCenter(),
  //     map: this.map
  //   })
	// }

  // createInfoWindow() {
  //   let contentString = "<div class='InfoWindow'>I'm a Window that contains Info Yay</div>"
  //   return new google.maps.InfoWindow({
  //     map: this.map,
  //     anchor: this.marker,
  //     content: contentString
  //   })
  // }

  // handleZoomChange() {
  //   this.setState({
  //     zoom: this.map.getZoom()
  //   })
  // }
}

Map.defaultProps = {
  zoom : 12,
  location : "San Francisco",
  mapCenter : null,
  mapApi : null
}

export default Map;
