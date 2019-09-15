import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { setupConfig, IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

/* Authentication context */
import { AuthProvider } from './state/useAuth';
import { QueueProvider } from './state/useQueue';

/* Pages */
import SignIn from './pages/SignIn';
import SignOut from './pages/SignOut';
import Room from './pages/Room';
import Rooms from './pages/Rooms';
import AddRoom from './pages/AddRoom';
import SongRequest from './pages/SongRequest';
import SignInCallback from './pages/SignInCallback';

const App = () => {
  setupConfig({
    rippleEffect: false,
    mode: 'ios',
  });

  return (
    <AuthProvider>
      <QueueProvider>
        <IonApp>
          <IonReactRouter>
            <IonRouterOutlet>
              <Route exact path="/" render={() => <Redirect to="/rooms" />} />
              <Route exact path="/rooms" component={Rooms} />
              <Route exact path="/rooms/addRoom" component={AddRoom} />
              <Route exact path="/signin" component={SignIn} />
              <Route exact path="/signin/callback" component={SignInCallback} />
              <Route exact path="/signout" component={SignOut} />
              <Route exact path="/room/:roomId" component={Room} />
              <Route path="/room/:roomId/request" component={SongRequest} />
            </IonRouterOutlet>
          </IonReactRouter>
        </IonApp>
      </QueueProvider>
    </AuthProvider>
  );
};

export default App;
