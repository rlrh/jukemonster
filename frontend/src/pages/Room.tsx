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
  IonGrid,
  IonRow,
  IonCol,
  IonAlert,
  useIonViewWillEnter,
} from '@ionic/react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import useOnlineStatus from '@rehooks/online-status';
import { add, closeCircle, shareAlt } from 'ionicons/icons';
import { useAuth } from '../state/useAuth';
import { useOurApi } from '../apis';
import useDeclarativeDataFetching from '../hooks/useDeclarativeDataFetching';
import { useSignInRedirect } from '../hooks/useSignInRedirect';
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
  const { getApi } = useOurApi();
  const { signInRedirect } = useSignInRedirect();
  const onlineStatus = useOnlineStatus();

  const { isLoading, isError, data } = useDeclarativeDataFetching(
    getApi,
    `rooms/${match.params.roomId}`,
    true,
  );

  const {
    error,
    nowPlayingTrack,
    queuedTracks,
    addTrack,
    upvoteTrack,
    downvoteTrack,
    sync,
    isAlive,
    deviceConnected,
  } = useRoomState(match.params.roomId);

  const [showDesc, setShowDesc] = useState(false);

  const [showAddTrackModal, setShowAddTrackModal] = useState(false);
  const handleSearchResultClick = args => {
    addTrack(args);
    setShowAddTrackModal(false);
  };

  const [showAlertViewRoom, setShowAlertViewRoom] = useState(false);
  useIonViewWillEnter(() => {
    if (!isAuthenticated) setShowAlertViewRoom(true);
  });

  // TODO: use room title in share message
  const roomId = match.params.roomId;
  const shareUrl = window.location.href;
  const shareTitle = `Join room ${match.params.roomId}`;
  const shareText = 'Choose your music here!';
  const shareMessage = `${shareTitle} - ${shareText}`;

  if (!error) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="secondary">
              <IonButton href="/" color="danger">
                <IonIcon slot="start" icon={closeCircle} />
                Leave
              </IonButton>
            </IonButtons>
            <IonTitle onClick={() => setShowDesc(!showDesc)}>
              {data ? data.name : `Room ${match.params.roomId}`}{' '}
              {showDesc ? '▲' : '▼'}
            </IonTitle>
            <IonButtons slot="primary">
              <Sharer
                render={handleClick => (
                  <IonButton onClick={handleClick}>
                    <IonIcon slot="start" icon={shareAlt} />
                    Invite
                  </IonButton>
                )}
                {...{ roomId, shareUrl, shareTitle, shareText, shareMessage }}
              />
            </IonButtons>
          </IonToolbar>
          {showDesc ? (
            <IonToolbar>
              <IonTitle color="medium">
                {data ? data.description : 'No description'}
              </IonTitle>
            </IonToolbar>
          ) : null}
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
        <IonAlert
          isOpen={showAlertViewRoom}
          onDidDismiss={() => history.push(`/`)}
          header="You need to sign in with Spotify to join the room."
          buttons={[
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
          ]}
        />
      </IonPage>
    );
  }

  if (error) {
    return <Redirect to="/roomNotFound" />;
  }
};

export default Room;
