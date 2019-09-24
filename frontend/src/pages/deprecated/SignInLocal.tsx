import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { Redirect } from 'react-router';
import React, { useState } from 'react';

import { useAuth } from '../../state/useAuth';

const SignIn = ({ match }) => {
  const { value, signIn } = useAuth();

  const [token, setToken] = useState('');

  if (value) {
    return <Redirect to={`/room/${match.params.roomId}`} />;
  }

  const handleInputChange = event => {
    setToken(event.target.value);
  };
  const handleButtonClick = event => {
    signIn(token);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Sign In</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonLabel position="stacked">Spotify Token</IonLabel>
          <IonInput
            placeholder="Paste your Spotify token here"
            value={token}
            onIonChange={handleInputChange}
          ></IonInput>
        </IonItem>
        <div className="ion-padding">
          <IonButton onClick={handleButtonClick} expand="block">
            Sign In
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};
export default SignIn;
