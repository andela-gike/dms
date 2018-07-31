import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Route from './routes';

render(<Router><Route /></Router>,
  document.getElementById('app'));