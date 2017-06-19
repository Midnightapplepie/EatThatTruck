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

export const updateSliderSetting = (setting) => {
  return {
    type: "UPDATE_SLIDER_SETTING",
    payload: setting
  }
}
