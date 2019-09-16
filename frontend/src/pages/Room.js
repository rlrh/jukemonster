import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonButtons,
  IonButton,
  IonFooter,
  IonBackButton,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { useAuth } from '../state/useAuth';
import Queue from '../components/Queue';
import NowPlaying from '../components/NowPlaying';
import Devices from '../components/Devices';

const Room = props => {
  const { user } = useAuth();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/rooms" />
          </IonButtons>
          <IonTitle>{`Room ${props.match.params.roomId}`}</IonTitle>
          <IonButtons slot="primary">
            {user ? (
              <IonButton href="/signout">Sign Out</IonButton>
            ) : (
              <IonButton href="/signin">Sign In</IonButton>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeSm="6">
              <NowPlaying songID="6wo37KVqFJhtuxPTpLCcfe" progress="0.28" />
            </IonCol>
            <IonCol size="12" sizeSm="6">
              <Queue />
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton href={`${props.match.url}/request`}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
      <IonFooter>
        <Devices />
      </IonFooter>
    </IonPage>
  );
};

export default Room;
