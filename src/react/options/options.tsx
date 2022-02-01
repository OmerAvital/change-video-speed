import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from 'redux/store';
import OptionsPage from './OptionsPage';
import './options.css';
import '../global.css';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <OptionsPage />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
