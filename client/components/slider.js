import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateSliderValue , updateSliderSetting } from '../../actions'

require('../stylesheets/components/slider.scss')

class Slider extends Component {

  handleSlide(e){
    const val = Number(e.target.value);
    const id = this.props.setting.id;
    const setting = this.props[id]
    const newSetting = Object.assign({}, setting, {value : val})
    this.props.updateSliderSetting(newSetting);
  }

  handleSliderClick(e){
    const id = this.props.setting.id;
    const setting = this.props[id];
    const toggled = setting.buttonToggled;

    if(toggled){
      const newSetting = Object.assign({}, setting, {buttonToggled : !toggled})
      this.props.updateSliderSetting(newSetting);
    }
  }

  toggleCheck(buttonToggled){
    return buttonToggled? "toggled" : ""
  }

  handleClick(){
    const id = this.props.setting.id;
    const setting = this.props[id];
    const toggled = setting.buttonToggled;
    const newSetting = Object.assign({}, setting, {buttonToggled : !toggled})
    this.props.updateSliderSetting(newSetting);
  }

  componentWillMount(){
    const id = this.props.setting.id;
    //update store before mounting
    if(!this.props[id]){
      this.props.updateSliderSetting(this.props.setting)
    }
  }

  render(){
    const {id} = this.props.setting;
    const {
      buttonDesc,
      sliderLabel,
      buttonToggled,
      min,
      max,
      value,
      step
    } = this.props[id] ? this.props[id] : this.props.setting;
    //if there are exisitng setting in the store, use it, else use this.props.setting
    return (
      <div id={id} className="slider">
        <button className={`left-button ${this.toggleCheck(buttonToggled)}`}
                onClick={()=> this.handleClick()}>
                {buttonDesc}
        </button>
        <div className="slider-bar-container">
          <p>{sliderLabel}: </p>
          <input type="range"
              min={min} max={max} defaultValue={value} step={step}
              onChange={(e) => this.handleSlide(e)}
              onClick={(e) => this.handleSliderClick(e)}
          />
          <p>{value}</p>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    [props.setting.id] : state[props.setting.id]
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    updateSliderValue,
    updateSliderSetting
  }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Slider);
