import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from 'react-router-dom';
import './i18n';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter >
    <ToastContainer />
    <App  />
  </BrowserRouter>
);


reportWebVitals();
