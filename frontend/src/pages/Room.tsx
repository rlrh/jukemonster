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
  IonToast,
  useIonViewDidEnter,
} from '@ionic/react';
import useOnlineStatus from '@rehooks/online-status';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { add } from 'ionicons/icons';
import { useAuth } from '../state/useAuth';
import useRoomState from '../hooks/useRoomState';
import Queue from '../components/Queue';
import NowPlaying from '../components/NowPlaying';
import Devices from '../components/Devices';
import AddModal from '../components/AddModal';

const Room = ({ match, history }) => {
  const { isAuthenticated } = useAuth();
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

  const onlineStatus = useOnlineStatus();

  const handleSearchResultClick = args => {
    addTrack(args);
    setShowAddTrackModal(false);
  };

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(
    'Link copied. Send your friends :)',
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/rooms" />
          </IonButtons>
          <CopyToClipboard
            text={window.location.href}
            onCopy={() => setShowToast(true)}
          >
            <IonButton fill="clear" expand="full">
              Invite
            </IonButton>
          </CopyToClipboard>

          <IonButtons slot="primary">
            {isAuthenticated ? (
              <IonButton href="/signout">Sign Out</IonButton>
            ) : (
              <IonButton href="/signin">Sign In</IonButton>
            )}
          </IonButtons>
        </IonToolbar>
        <IonToast
          position="top"
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={1500}
        />
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
        <AddModal
          isOpen={showAddTrackModal}
          onClose={() => setShowAddTrackModal(false)}
          onSearchResultClick={handleSearchResultClick}
        />
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
    </IonPage>
  );
};

export default Room;
