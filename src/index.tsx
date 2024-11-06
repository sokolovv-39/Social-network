import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css'
import store from './redux/index';
import { Provider } from 'react-redux';
import { router } from './router';
import { RouterProvider } from 'react-router-dom'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store} >
    <RouterProvider router={router} />
  </Provider >
);
