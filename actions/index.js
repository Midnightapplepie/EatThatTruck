export const updateUserLocation = (latlng) => {
  return {
    type: "UPDATE_USER_LOCATION",
    payload: {
      userLocation : latlng
    }
  }
}

export const updateMapProps = (mapProps) => {
  return {
    type: "UPDATE_MAPPROPS",
    payload: {
      mapProps : mapProps 
    }
  }
}
