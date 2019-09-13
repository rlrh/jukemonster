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
} from '@ionic/react';
import { Redirect } from 'react-router';
import React, { useState } from 'react';

import { useAuth } from '../hooks/useAuth';

const SignIn = ({ match }) => {
  const { user, signIn } = useAuth();

  const [token, setToken] = useState('');

  const handleInputChange = event => {
    setToken(event.target.value);
  };

  const handleButtonClick = event => {
    signIn(token);
  };

  if (user) {
    return <Redirect to={`/room/${match.params.roomId}`} />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Sign In</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonInput
          placeholder="Paste your token here"
          value={token}
          onIonChange={handleInputChange}
        ></IonInput>
        <IonButton expand="block" onClick={handleButtonClick}>
          Sign In With This Token
        </IonButton>
      </IonContent>
    </IonPage>
  );
};
export default SignIn;
