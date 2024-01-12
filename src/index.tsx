/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
// import { Provider } from 'react-redux';
// import { store } from './Store/index.tsx.bck';
import 'semantic-ui-css/semantic.min.css'
import '../src/css/styles.css'
ReactDOM.render(
  // <Provider store={store}>
    <App />
  // </Provider>
  ,
  document.getElementById('root')
)
