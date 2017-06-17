import { combineReducers } from 'redux';
import FoodTrucks from './foodTrucks'

const initialState = {
  foodTrucks : FoodTrucks,
  mapProps : {
    zoom : 13,
    city : "San Francisco, CA, US",
    mapCenter: null
  },
  radius: 2,
  userLocation: null
}

const updateUserLocation = (state, actions) => {
  return Object.assign({}, state, actions.payload)
}

const updateMapProps = (state, actions) => {
  return Object.assign({}, state, actions.payload)
}

const Reducers = (state=initialState, actions) => {
  const {type, payload} = actions;

  const reducerMap = {
    //type : function
    UPDATE_USER_LOCATION : updateUserLocation,
    UPDATE_MAPPROPS : updateMapProps
  }

  //get function by reducer name
  const reducer = reducerMap[type];

  //return updated state or unchanged state
  return reducer? reducer(state, actions) : state
}

export default Reducers;
