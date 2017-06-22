export const getLatLng = (addressString)=>{
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
