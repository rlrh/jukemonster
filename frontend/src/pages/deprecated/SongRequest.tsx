import React from 'react';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { useAuth } from '../../state/useAuth';
//import Search from '../../components/Search';

const SongRequest = () => {
  const { value } = useAuth();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Search</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/*user ? <Search /> : <h1>You are not signed in to Spotify.</h1>*/}
      </IonContent>
    </IonPage>
  );
};
export default SongRequest;
