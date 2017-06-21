import { combineReducers } from 'redux';

const defaultState = {
  mapProps : {
    zoom : 11,
    city : "San Francisco, CA, US",
    mapCenter: null
  },
  radius_filter: null,
  open_now_filter: null,
  userLocation: null,
  searchValue: "",
  filteredTrucks: []
}

localStorage.removeItem("FoodTruckReduxStore");

let initialState  = sessionStorage.getItem("FoodTruckReduxStore");
try {
  initialState = JSON.parse(initialState)? JSON.parse(initialState) : defaultState;
}catch(e){
  console.log(e, "error")
  sessionStorage.removeItem("FoodTruckReduxStore");
}

window.onunload = ()=>{
  // localStorage.removeItem("FoodTruckReduxStoreV2");
}

const updateFilteredTrucksReducer = (state, actions) => {
  return Object.assign({}, state, actions.payload)
}

const updateUserLocationReducer = (state, actions) => {
  const newState = Object.assign({}, state, actions.payload)
  return newState
}

const updateMapPropsReducer = (state, actions) => {
  return Object.assign({}, state, actions.payload)
}

const handleDistanceChange = (setting) => {
  if (setting.id === "radius_filter"){
      if(setting.buttonToggled){
        setting.value = setting.max;
      }
      setting.valueDisplayed = `${setting.value} (mi)`;
  }
  return setting;
}

const handleTimeChange = (setting) => {
  if (setting.id === "open_now_filter"){
      if(setting.buttonToggled){
        setting.value = new Date().getHours();
      }
      if(setting.value === 12){
        setting.valueDisplayed = `${setting.value} pm`;
      }else if(setting.value === 24){
        setting.valueDisplayed = `${setting.value/2} am`;
      }else if(setting.value/12 > 1){
        setting.valueDisplayed = `${setting.value%12} pm`;
      }else{
        setting.valueDisplayed = `${setting.value} am`;
      }
  }
  return setting
}

const updateSliderSettingReducer = (state, actions) => {
  let setting = actions.payload;
  console.log(setting);
  if (setting.id === "radius_filter"){
    handleDistanceChange(setting);
  }
  if (setting.id === "open_now_filter"){
    handleTimeChange(setting);
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
    UPDATE_SEARCH_VALUE : updateSearchValueReducer,
    UPDATE_FILTERED_TRUCKS: updateFilteredTrucksReducer
  }

  //get function by reducer name
  const reducer = reducerMap[type];
  //return updated state or unchanged state
  const newState = reducer? reducer(state, actions) : state
  //saving state to localStorage
  sessionStorage.setItem("FoodTruckReduxStore", JSON.stringify(newState))

  // console.log(newState);
  return newState
}

export default Reducers;
