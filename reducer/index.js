import { combineReducers } from 'redux';
import FoodTrucks from './foodTrucks'

const initialState = {
  foodTrucks : FoodTrucks,
  mapProps : {
    zoom : 13,
    city : "San Francisco, CA, US",
    mapCenter: null
  },
  "radius_filter": 2,
  "open_now_filter": null,
  userLocation: null
}

const updateUserLocation = (state, actions) => {
  return Object.assign({}, state, actions.payload)
}

const updateMapProps = (state, actions) => {
  return Object.assign({}, state, actions.payload)
}

const updateSliderValue = (state, actions) => {
  return Object.assign({}, state, actions.payload)
}

const Reducers = (state=initialState, actions) => {
  const {type, payload} = actions;

  const reducerMap = {
    //type : function
    UPDATE_USER_LOCATION : updateUserLocation,
    UPDATE_MAPPROPS : updateMapProps,
    UPDATE_SLIDER_VALUE : updateSliderValue
  }

  //get function by reducer name
  const reducer = reducerMap[type];

  //return updated state or unchanged state
  return reducer? reducer(state, actions) : state
}

export default Reducers;
