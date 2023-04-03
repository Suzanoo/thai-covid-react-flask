import { React, StrictMode, Fragment } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import './public/css/style.css';

const container = document.getElementById('root');
const root = createRoot(container);

// Protect Strickmode execute too many times
const Root = process.env.NODE_ENV === 'development' ? StrictMode : Fragment;

root.render(
  <Root>
    <Provider store={store}>
      <App />
    </Provider>
  </Root>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
