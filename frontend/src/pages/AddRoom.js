import React from 'react';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonItem,
  IonLabel,
  IonCard,
  IonCardTitle,
  IonCardContent,
} from '@ionic/react';

const AddRoom = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/rooms" />
          </IonButtons>
          <IonTitle>Add Room</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardContent>
            <IonCardTitle>Create room</IonCardTitle>
            <IonItem>
              <IonLabel position="floating">Location</IonLabel>
              <IonInput></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Name</IonLabel>
              <IonInput></IonInput>
            </IonItem>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardContent>
            <IonCardTitle>Join room</IonCardTitle>
            <IonItem>
              <IonLabel position="floating">Room ID</IonLabel>
              <IonInput></IonInput>
            </IonItem>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};
export default AddRoom;
