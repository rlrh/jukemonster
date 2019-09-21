import React, { useState } from 'react';
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
  IonModal,
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { useAuth } from '../state/useAuth';
import useRoomState from '../hooks/useRoomState';
import Queue from '../components/Queue';
import NowPlaying from '../components/NowPlaying';
import Devices from '../components/Devices';
import Search from '../components/Search';

const Room = ({ match }) => {
  const { user } = useAuth();
  const {
    nowPlayingTrack,
    queuedTracks,
    addTrack,
    upvoteTrack,
    downvoteTrack,
  } = useRoomState(match.params.roomId);
  const [showAddTrackModal, setShowAddTrackModal] = useState(false);

  const handleSearchResultClick = args => {
    addTrack(args);
    setShowAddTrackModal(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/rooms" />
          </IonButtons>
          <IonTitle>{`Room ${match.params.roomId}`}</IonTitle>
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
              <NowPlaying track={nowPlayingTrack} />
            </IonCol>
            <IonCol size="12" sizeSm="6">
              <Queue
                tracks={queuedTracks}
                onTrackUpvote={upvoteTrack}
                onTrackDownvote={downvoteTrack}
              />
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowAddTrackModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
        <IonModal
          isOpen={showAddTrackModal}
          onDidDismiss={() => setShowAddTrackModal(false)}
        >
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="primary">
                <IonButton onClick={() => setShowAddTrackModal(false)}>
                  Close
                </IonButton>
              </IonButtons>
              <IonTitle>Add A Track</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {user ? (
              <Search onSearchResultClick={handleSearchResultClick} />
            ) : (
              <h1>You are not signed in to Spotify.</h1>
            )}
          </IonContent>
        </IonModal>
      </IonContent>
      <IonFooter>
        <Devices />
      </IonFooter>
    </IonPage>
  );
};

export default Room;
