import React, { useState } from 'react';
import { useOurApi } from '../apis';
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
  IonAlert,
  IonCardSubtitle,
  useIonViewDidEnter,
} from '@ionic/react';
import Devices from '../components/Devices';
import { useAuth } from '../state/useAuth';

const AddRoom = ({ history }) => {
  const [name, setName] = useState('');
  const [description, setdescription] = useState('');
  const [showAlertCreateRoom, setShowAlertCreateRoom] = useState(false);
  const {
    isAuthenticated,
    value,
    spotify_access_token,
    ensureTokenValidity,
  } = useAuth();
  const { postApi } = useOurApi();

  const submit = async () => {
    try {
      const res = await postApi('rooms/', { name, description });
      const value = res.data;
      const roomId = value['unique_identifier'];
      history.push(`/room/${roomId}`);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCreateRoom = async () => {
    if (isAuthenticated && typeof value !== 'string') {
      const headers = {
        Accept: 'application/json',
        Authorization: `Bearer ${spotify_access_token}`,
      };
      const res = await fetch(`https://api.spotify.com/v1/me`, {
        method: 'GET',
        headers: headers,
      });
      const account = await res.json();
      const hasPremium = account['product'] === 'premium';
      if (!hasPremium) {
        setShowAlertCreateRoom(true);
      } else {
        history.push(`/host`);
      }
    } else {
      setShowAlertCreateRoom(false);
      setShowAlertCreateRoom(true);
    }
  };

  useIonViewDidEnter(() => {
    handleCreateRoom();
  });

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
                <IonLabel position="floating">Description</IonLabel>
                <IonInput
                  required={true}
                  name="description"
                  type="text"
                  value={description}
                  onIonChange={e =>
                    setdescription((e.target as HTMLInputElement).value)
                  }
                />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Name</IonLabel>
                <IonInput
                  required={true}
                  name="name"
                  type="text"
                  value={name}
                  onIonChange={e =>
                    setName((e.target as HTMLInputElement).value)
                  }
                />
              </IonItem>
              <br />
              <IonItem>
                <IonCardSubtitle>Playback Device: </IonCardSubtitle>
              </IonItem>
              <IonItem>
                <Devices />
              </IonItem>
              <br />
              <IonButton expand="block" type="submit">
                Create
              </IonButton>
            </IonCardContent>

            <IonCardContent></IonCardContent>
          </form>
        </IonCard>
        <IonAlert
          isOpen={showAlertCreateRoom}
          onDidDismiss={() => history.push(`/`)}
          header="You need to sign in with a Spotify Premium account"
          buttons={
            !isAuthenticated
              ? [
                  {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                      history.push(`/`);
                    },
                  },
                  {
                    text: 'Sign In',
                    handler: () => {
                      history.push(`/signin`);
                    },
                  },
                ]
              : [
                  {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                  },
                ]
          }
        />
      </IonContent>
    </IonPage>
  );
};
export default AddRoom;
