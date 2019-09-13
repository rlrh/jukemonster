import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonLabel,
  IonFab,
  IonFabButton,
  IonIcon,
  IonListHeader,
  IonButtons,
  IonButton,
  IonFooter,
} from '@ionic/react';
import { add } from 'ionicons/icons';

import { useAuth } from '../hooks/useAuth';

import QueueSong from '../components/QueueSong';

const Room = props => {
  const { user } = useAuth();

  console.log(`Your token is: ${user}`);

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
        <IonList>
          <IonListHeader>
            <IonLabel>Queue</IonLabel>
          </IonListHeader>
          <QueueSong
            title="There's A Song For Everything"
            artist="Maren Morris"
          />
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
