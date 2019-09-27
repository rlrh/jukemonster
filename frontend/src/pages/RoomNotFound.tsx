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
  IonCard,
  IonCardContent,
  IonCardTitle,
} from '@ionic/react';

const RoomNotFound = () => {
  return (
    <IonPage>
      <IonGrid fixed class="no-padding">
        <IonHeader>
          <IonToolbar class="transparent">
            <IonButtons slot="secondary">
              <IonBackButton defaultHref="/" />
            </IonButtons>
            <IonTitle>Jukemonster</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonCard>
            <IonCardContent>
              <IonCardTitle>Room Not Found</IonCardTitle>
              <h1>Sorry, we can't find the room you're looking for.</h1>
              <br />
              <IonButton href="/host" expand="full" color="google">
                Host A Room?
              </IonButton>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonGrid>
    </IonPage>
  );
};

export default RoomNotFound;
