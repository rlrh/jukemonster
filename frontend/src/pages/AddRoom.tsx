import React, { useState } from 'react';
import { useOurApi, useSpotifyApi } from '../apis';
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
  IonToast,
  IonGrid,
  useIonViewDidEnter,
} from '@ionic/react';
import Devices, { Device } from '../components/Devices';
import { useAuth } from '../state/useAuth';
import { useSignInRedirect } from '../hooks/useSignInRedirect';

const AddRoom = ({ history }) => {
  const [name, setName] = useState('');
  const [description, setdescription] = useState('');
  const [showAlertCreateRoom, setShowAlertCreateRoom] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { isAuthenticated, value, spotify_access_token } = useAuth();
  const { postApi } = useOurApi();
  const spotify = useSpotifyApi();

  const deviceChosen = async () => {
    try {
      const res = await spotify.getApi(
        `https://api.spotify.com/v1/me/player/devices`,
      );
      if (res && res.data && res.data.devices) {
        const devices: [Device] = res.data.devices;
        const activeDevices = devices.filter(x => x.is_active);
        return activeDevices[0];
      }
      return null;
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  const { signInRedirect } = useSignInRedirect();

  const submit = async () => {
    const chosen = await deviceChosen();
    if (!chosen) {
      setShowToast(true);
      return;
    }
    try {
      const res = await postApi('rooms/', {
        name,
        description,
        device_id: chosen.id,
      });
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
      <IonGrid fixed class="no-padding">
        <IonHeader>
          <IonToolbar class="transparent">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/" />
            </IonButtons>
            <IonTitle>Jukemonster</IonTitle>
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
                <IonCardTitle>Host Room</IonCardTitle>
                <IonItem>
                  <IonLabel position="floating">Name</IonLabel>
                  <IonInput
                    required={true}
                    name="name"
                    type="text"
                    maxlength={70}
                    value={name}
                    onIonChange={e =>
                      setName((e.target as HTMLInputElement).value)
                    }
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Description</IonLabel>
                  <IonInput
                    required={true}
                    name="description"
                    type="text"
                    maxlength={280}
                    value={description}
                    onIonChange={e =>
                      setdescription((e.target as HTMLInputElement).value)
                    }
                  />
                </IonItem>
                <br />
                <IonItem>
                  <IonLabel>Select a Spotify Connect playback device</IonLabel>
                </IonItem>
                <IonItem>
                  <Devices />
                </IonItem>
                <br />
                <IonButton type="submit" expand="full" color="google">
                  Host!
                </IonButton>
              </IonCardContent>
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
                      handler: signInRedirect,
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
          <IonToast
            isOpen={showToast}
            position="middle"
            onDidDismiss={() => setShowToast(false)}
            message="Open spotify on your device"
            duration={1000}
          />
        </IonContent>
      </IonGrid>
    </IonPage>
  );
};
export default AddRoom;
