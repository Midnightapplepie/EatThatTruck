import { combineReducers } from 'redux';
import FoodTrucks from './foodTrucks'

const initialState = {
  foodTrucks : FoodTrucks,
  mapProps : {
    zoom : 13,
    city : "San Francisco",
    mapCenter: null
  },
  radius: 2,
  userLocation: {}
}

const updateMapProps = (state, actions) => {
  return Object.assign({}, state, {mapProps: actions.payload});
}

const Reducers = (state=initialState, actions) => {
  const {name, payload} = actions;

  const reducerMap = {
    //name : function
    UPDATE_MAPPROPS : updateMapProps
  }

  //get function by reducer name
  const reducer = reducerMap[name];

  //return updated state or unchanged state
  return reducer? reducer(state, actions) : state
}

export default Reducers;
