import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from 'redux/store';
import PopupPage from './PopupPage';
import './popup.css';
import '../global.css';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PopupPage />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
