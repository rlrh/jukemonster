import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonBackButton,
  IonGrid,
} from '@ionic/react';
import { useAuth } from '../state/useAuth';

const RoomNotFound = () => {
  const { isAuthenticated } = useAuth();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" text="Home" />
          </IonButtons>
          <IonTitle>Room Not Found</IonTitle>
          <IonButtons slot="primary">
            {isAuthenticated ? (
              <IonButton href="/signout">Sign Out</IonButton>
            ) : (
              <IonButton href="/signin">Sign In</IonButton>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        <IonGrid fixed>
          <h1>Sorry, we can't find this room.</h1>
          <IonButton href="/host" expand="full" color="google">
            Host Room
          </IonButton>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default RoomNotFound;
