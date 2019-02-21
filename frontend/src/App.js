/*
React, Redux, Router Cores
*/
import React from 'react';
import { Provider } from 'react-redux';
import AppRouter from './router/AppRouter';
import store from './store/index';

/*
Material-UI Theme
*/
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

/*
Local CSS
*/
import './App.css';

const muiTheme = getMuiTheme({
    slider: {
        trackColor: 'rgba(15,15,15,0.3)',
        selectionColor: '#22a571',
        rippleColor: 'purple'
    },
});

/**
 * Application container
 *      set up necessary providers for children components to use.
 */
const App = () => (
    <div className='app-container'>
        <Provider store={store}>
            {/* MuiThemeProvider is required to use Material UI components */}
            <MuiThemeProvider muiTheme={muiTheme}>
                <AppRouter />
            </MuiThemeProvider>
        </Provider>
    </div>
);


export default App;
