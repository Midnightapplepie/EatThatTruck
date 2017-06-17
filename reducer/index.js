import { combineReducers } from 'redux';
import FoodTrucks from './foodTrucks'

const initialState = {
  foodTrucks : FoodTrucks,
  mapProps : {
    zoom : 13,
    location : "San Francisco",
    mapCenter: null
  }
}

const Reducers = (state=initialState, actions) => {
  const {name, payload} = actions;

  const reducerMap = {
    //name : function
  }

  //get function by reducer name
  const reducer = reducerMap[name];

  //return updated state or unchanged state
  return reducer? reducer(state, actions) : state
}

export default Reducers;
