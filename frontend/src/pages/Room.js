import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonFab,
  IonFabButton,
  IonIcon,
  IonButtons,
  IonButton,
  IonFooter,
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { useAuth } from '../state/useAuth';
import Queue from '../components/Queue';
import NowPlaying from '../components/NowPlaying';

const Room = props => {
  const { user } = useAuth();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{`Room ${props.match.params.roomId}`}</IonTitle>
          <IonButtons slot="primary">
            {user ? (
              <IonButton href={`/signout/${props.match.params.roomId}`}>
                Sign Out
              </IonButton>
            ) : (
              <IonButton href={`/signin/${props.match.params.roomId}`}>
                Sign In
              </IonButton>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <NowPlaying songID="6wo37KVqFJhtuxPTpLCcfe" progress="0.28" />
        <IonList>
          <Queue />
        </IonList>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton href={`${props.match.url}/request`}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonTitle>
            {user
              ? `Your Spotify token is: ${user}`
              : 'Sign in to provide a Spotify token'}
          </IonTitle>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Room;
