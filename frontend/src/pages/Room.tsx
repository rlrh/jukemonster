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
} from '@ionic/react';
import { RouteComponentProps } from 'react-router-dom';
import useOnlineStatus from '@rehooks/online-status';
import { add } from 'ionicons/icons';
import { useAuth } from '../state/useAuth';
import useRoomState from '../hooks/useRoomState';
import Queue from '../components/Queue';
import NowPlaying from '../components/NowPlaying';
import Devices from '../components/Devices';
import AddModal from '../components/AddModal';
import Sharer from '../components/Sharer';

const Room: React.FC<RouteComponentProps> = ({
  match,
  history,
}: RouteComponentProps) => {
  const { isAuthenticated } = useAuth();
  const onlineStatus = useOnlineStatus();

  const {
    nowPlayingTrack,
    queuedTracks,
    addTrack,
    upvoteTrack,
    downvoteTrack,
    sync,
    isAlive,
    deviceConnected,
  } = useRoomState(match.params.roomId);

  const [showAddTrackModal, setShowAddTrackModal] = useState(false);
  const handleSearchResultClick = args => {
    addTrack(args);
    setShowAddTrackModal(false);
  };

  // TODO: use room title in share message
  const roomId = match.params.roomId;
  const shareUrl = window.location.href;
  const shareTitle = `Join room ${match.params.roomId}`;
  const shareText = 'Choose your music here!';
  const shareMessage = `${shareTitle} - ${shareText}`;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" text="Home" />
          </IonButtons>
          <IonTitle>{`Room ${match.params.roomId}`}</IonTitle>
          <IonButtons slot="primary">
            <Sharer
              render={handleClick => (
                <IonButton onClick={handleClick}>Invite</IonButton>
              )}
              {...{ roomId, shareUrl, shareTitle, shareText, shareMessage }}
            />
            {isAuthenticated ? (
              <IonButton href="/signout">Sign Out</IonButton>
            ) : (
              <IonButton href="/signin">Sign In</IonButton>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid class="no-padding ion-hide-lg-up">
          <IonRow>
            <IonCol size="12">
              <NowPlaying track={nowPlayingTrack} />
            </IonCol>
            <IonCol size="12">
              <Queue
                tracks={queuedTracks}
                onTrackUpvote={upvoteTrack}
                onTrackDownvote={downvoteTrack}
              />
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonGrid class="full-height no-padding ion-hide-md-down">
          <IonRow class="full-height">
            <IonCol size="6">
              <IonContent>
                <NowPlaying track={nowPlayingTrack} />
              </IonContent>
            </IonCol>
            <IonCol size="6">
              <IonContent>
                <Queue
                  tracks={queuedTracks}
                  onTrackUpvote={upvoteTrack}
                  onTrackDownvote={downvoteTrack}
                />
              </IonContent>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowAddTrackModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
      <IonFooter>
        <Devices />
        {onlineStatus ? null : (
          <IonToolbar color="danger">
            <IonTitle>You are offline</IonTitle>
          </IonToolbar>
        )}
        {isAlive ? null : (
          <IonToolbar color="warning" onClick={() => history.push(`/`)}>
            <IonTitle>Room closed. Tap to exit.</IonTitle>
          </IonToolbar>
        )}
        {deviceConnected ? null : (
          <IonToolbar color="danger" onClick={sync}>
            <IonTitle>Device stopped. Tap to sync.</IonTitle>
          </IonToolbar>
        )}
      </IonFooter>
      <AddModal
        isOpen={showAddTrackModal}
        onClose={() => setShowAddTrackModal(false)}
        onSearchResultClick={handleSearchResultClick}
      />
    </IonPage>
  );
};

export default Room;
