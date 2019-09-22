import React, { useState } from 'react';
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
  IonButton,
} from '@ionic/react';

const AddRoom = ({ history }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  const submit = async () => {
    try {
      console.log(`name is ${name}\n location is ${location}`);
      /*
        Network call to create room ID
      */
      const roomId = 'h12ss712a';
      history.push(`/room/${roomId}`);
    } catch (e) {
      console.log(e);
    }
  };

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
          <form
            onSubmit={e => {
              e.preventDefault();
              submit();
            }}
          >
            <IonCardContent>
              <IonCardTitle>Create room</IonCardTitle>
              <IonItem>
                <IonLabel position="floating">Location</IonLabel>
                <IonInput
                  required="true"
                  name="location"
                  type="location"
                  value={location}
                  onIonChange={e => setLocation(e.target.value)}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Name</IonLabel>
                <IonInput
                  name="name"
                  type="name"
                  value={name}
                  onIonChange={e => setName(e.target.value)}
                />
              </IonItem>
              <br />
              <IonButton expand="block" type="submit">
                Create
              </IonButton>
            </IonCardContent>
          </form>
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
