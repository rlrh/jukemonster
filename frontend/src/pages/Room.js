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
} from '@ionic/react';
import { add } from 'ionicons/icons';
import QueueSong from '../components/QueueSong';

const Room = props => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Room</IonTitle>
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
          <IonFabButton
            onClick={() => props.history.push(`${props.match.url}/request`)}
          >
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Room;
