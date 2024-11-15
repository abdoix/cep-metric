import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Main } from './view-components/main';
import './style.scss';
// Remove the HTML import as it's not needed
// import './index.html';  // Remove this line
import 'rc-slider/assets/index.css';

const rootElement = document.getElementById('root');
ReactDOM.render(<Main />, rootElement); // Remove the 'as any' cast
