import React from 'react';
import ReactDOM from 'react-dom';
import { transitions, positions, Provider as AlertProvider, types } from 'react-alert'
import AlertTemplate from './components/CustomAlert'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';



const options = {
  position: positions.TOP_RIGHT,
  timeout: 3000,
  offset: '10px',
  type: types.INFO,
  transition: transitions.SCALE,
  containerStyle: {
    zIndex: 100
  }
}

const Root = () => (
  <AlertProvider template={AlertTemplate} {...options}>
    <App />
  </AlertProvider>
)

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
