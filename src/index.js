// index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './app/globals.css'
import Root from './Root';
import reportWebVitals from './reportWebVitals';
import { AppProvider } from './context';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
       <AppProvider>
          <Root />
       </AppProvider>
    {/* If you want to start measuring performance in your app, pass a function
    to log results (for example: reportWebVitals(console.log))
    or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals */}
  </React.StrictMode>
);

reportWebVitals();

