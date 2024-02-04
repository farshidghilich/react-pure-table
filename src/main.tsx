import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import { ThemeProvider } from 'react-bootstrap';
ReactDOM.createRoot(document.getElementById('root')!).render(
	<ThemeProvider dir='rtl'>
		<App />
	</ThemeProvider>,
);
