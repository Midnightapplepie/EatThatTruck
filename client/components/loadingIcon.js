import React, { Component } from 'react';
require('../stylesheets/components/loadingIcon.scss')

class LoadingIcon extends Component {

  render(){
    const style = {
      WebkitTransform : 'scale(0.6)'
    }

    return (
      <div className='uil-spin-css' style={style}>
        <div><div></div></div>
        <div><div></div></div>
        <div><div></div></div>
        <div><div></div></div>
        <div><div></div></div>
        <div><div></div></div>
        <div><div></div></div>
        <div><div></div></div>
      </div>
    )
  }
}

export default LoadingIcon
