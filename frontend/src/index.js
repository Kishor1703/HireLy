import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './index.css';
import App from './App';
import {Provider} from 'react-redux';
import store from './redux/store';

const API_BASE_URL = (
  process.env.REACT_APP_API_BASE_URL?.trim() || 'http://localhost:8000'
).replace(/\/+$/, '');

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
        <App/>
    </Provider>
    
  </React.StrictMode>
);
