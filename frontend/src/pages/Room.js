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
} from '@ionic/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { add } from 'ionicons/icons';
import { useAuth } from '../state/useAuth';
import useRoomState from '../hooks/useRoomState';
import Queue from '../components/Queue';
import NowPlaying from '../components/NowPlaying';
import Devices from '../components/Devices';
import AddModal from '../components/AddModal';

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
            {user ? (
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
        <AddModal
          isOpen={showAddTrackModal}
          onClose={() => setShowAddTrackModal(false)}
          onSearchResultClick={handleSearchResultClick}
        />
      </IonContent>
      <IonFooter>
        <Devices />
      </IonFooter>
    </IonPage>
  );
};

export default Room;
