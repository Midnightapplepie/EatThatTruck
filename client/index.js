import React from 'react';
import ReactDOM from 'react-dom';
import reducer from '../reducer';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import App from './components/app'

const store = createStore(reducer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
