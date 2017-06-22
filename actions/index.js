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

export const updateSearchValue = (val) => {
  return {
    type: "UPDATE_SEARCH_VALUE",
    payload: val
  }
}

export const updateFilteredTrucks = (trucks) => {
  return {
    type: "UPDATE_FILTERED_TRUCKS",
    payload: trucks
  }
}
