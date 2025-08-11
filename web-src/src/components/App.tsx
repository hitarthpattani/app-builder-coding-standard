/*
 * <license header>
 */

import React from 'react';
import { Provider, defaultTheme, Grid, View } from '@adobe/react-spectrum';
import ErrorBoundary from 'react-error-boundary';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import SideBar from './SideBar';
import ActionsForm from './ActionsForm';
import { Home } from './Home';
import { About } from './About';

// Adobe App Builder Runtime interface
interface AppBuilderRuntime {
  on: (event: string, handler: (data: any) => void) => void;
  // Add other runtime methods as needed
}

// Adobe IMS interface
interface AdobeIMS {
  token?: string;
  profile?: any;
  org?: string;
  // Add other IMS properties as needed
}

interface AppProps {
  runtime: AppBuilderRuntime;
  ims: AdobeIMS;
}

const App: React.FC<AppProps> = props => {
  console.log('runtime object:', props.runtime);
  console.log('ims object:', props.ims);

  // error handler on UI rendering failure
  const onError = (_e: any, _componentStack: any) => {};

  // component to show if UI fails rendering
  const fallbackComponent = ({ componentStack, error }: any) => {
    return (
      <React.Fragment>
        <h1 style={{ textAlign: 'center', marginTop: '20px' }}>Something went wrong :(</h1>
        <pre>{`${componentStack || ''}\n${error?.message || 'Unknown error'}`}</pre>
      </React.Fragment>
    );
  };

  // use exc runtime event handlers
  // respond to configuration change events (e.g. user switches org)
  props.runtime.on('configuration', ({ imsOrg, imsToken, locale }: any) => {
    console.log('configuration change', { imsOrg, imsToken, locale });
  });
  // respond to history change events
  props.runtime.on('history', ({ type, path }: any) => {
    console.log('history change', { type, path });
  });

  return (
    // @ts-ignore - ErrorBoundary children type issue in this version
    <ErrorBoundary onError={onError} FallbackComponent={fallbackComponent}>
      <Router>
        <Provider theme={defaultTheme} colorScheme={'light'}>
          <Grid
            areas={['sidebar content']}
            columns={['256px', '3fr']}
            rows={['auto']}
            height='100vh'
            gap='size-100'
          >
            <View gridArea='sidebar' backgroundColor='gray-200' padding='size-200'>
              <SideBar></SideBar>
            </View>
            <View gridArea='content' padding='size-200'>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route
                  path='/actions'
                  element={<ActionsForm runtime={props.runtime} ims={props.ims} />}
                />
                <Route path='/about' element={<About />} />
              </Routes>
            </View>
          </Grid>
        </Provider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
