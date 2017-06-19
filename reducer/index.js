import { combineReducers } from 'redux';

const defaultState = {
  mapProps : {
    zoom : 13,
    city : "San Francisco, CA, US",
    mapCenter: null
  },
  "radius_filter": null,
  "open_now_filter": null,
  userLocation: null,
  searchValue: ""
}

let initialState  = localStorage.getItem("FoodTruckReduxStore");
try {
  initialState = JSON.parse(initialState)? JSON.parse(initialState) : defaultState;
}catch(e){
  console.log(e, "error")
  localStorage.removeItem("FoodTruckReduxStore");
}




const updateUserLocationReducer = (state, actions) => {
  const newState = Object.assign({}, state, actions.payload)
  console.log(newState)
  return newState
}

const updateMapPropsReducer = (state, actions) => {
  return Object.assign({}, state, actions.payload)
}

const updateSliderSettingReducer = (state, actions) => {
  let setting = actions.payload;
  if (setting.id === "radius_filter" && setting.buttonToggled){
      setting.value = setting.max;
  }
  if (setting.id === "open_now_filter" && setting.buttonToggled){
      setting.value = new Date().getHours()
  }

  return Object.assign({}, state, {[setting.id] : setting})
}

const updateSearchValueReducer = (state, actions) => {
  return Object.assign({}, state, actions.payload)
}

const Reducers = (state=initialState, actions) => {
  const {type, payload} = actions;

  const reducerMap = {
    //type : function
    UPDATE_USER_LOCATION : updateUserLocationReducer,
    UPDATE_MAPPROPS : updateMapPropsReducer,
    UPDATE_SLIDER_SETTING : updateSliderSettingReducer,
    UPDATE_SEARCH_VALUE : updateSearchValueReducer
  }

  //get function by reducer name
  const reducer = reducerMap[type];
  //return updated state or unchanged state
  const newState = reducer? reducer(state, actions) : state
  //saving state to localStorage
  localStorage.setItem("FoodTruckReduxStore", JSON.stringify(newState))

  // console.log(newState);
  return newState
}

export default Reducers;
