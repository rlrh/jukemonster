import React, { useState, useEffect } from 'react';
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
  useIonViewWillLeave,
} from '@ionic/react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import useOnlineStatus from '@rehooks/online-status';
import { add, trash, closeCircle, shareAlt } from 'ionicons/icons';
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
  const roomId = match.params.roomId;

  const { isAuthenticated } = useAuth();
  const { getApi, deleteApi } = useOurApi();
  const { signInRedirect } = useSignInRedirect();
  const onlineStatus = useOnlineStatus();

  const PATH = `rooms/${roomId}`;
  const [path, setPath] = useState(PATH);
  const { data, isLoading, isError } = useDeclarativeDataFetching(
    getApi,
    path,
    isAuthenticated ? false : true,
  );
  useEffect(() => setPath(PATH), [onlineStatus]);
  const [isHost, setIsHost] = useState(false);
  useEffect(() => {
    if (data) setIsHost(data.isHost);
  }, [data]);

  const {
    error,
    reopenSocket,
    offlineToOnline,
    nowPlayingTrack,
    queuedTracks,
    addTrack,
    upvoteTrack,
    downvoteTrack,
    sync,
    isAlive,
    deviceConnected,
  } = useRoomState(roomId);

  const [showAddTrackModal, setShowAddTrackModal] = useState(false);
  const handleSearchResultClick = args => {
    addTrack(args);
    setShowAddTrackModal(false);
  };

  const [showAlertViewRoom, setShowAlertViewRoom] = useState(false);
  useIonViewWillEnter(() => {
    if (!isAuthenticated) setShowAlertViewRoom(true);
  });
  useIonViewWillLeave(() => setShowAlertViewRoom(false));

  const [showDesc, setShowDesc] = useState(false);

  const shareUrl = window.location.href;
  const shareTitle = `Join ${data ? data.name : `room ${roomId}`}`;
  const shareText = 'Choose your music here!';
  const shareMessage = `${shareTitle} - ${shareText}`;

  const renderExitButton = () => {
    if (isHost) {
      const handleClick = async () => {
        await deleteApi(`rooms/${roomId}`);
        return history.push('/');
      };
      return (
        <IonButton onClick={handleClick} color="danger">
          <IonIcon slot="start" icon={trash} />
          Delete Room
        </IonButton>
      );
    } else {
      return (
        <IonButton href="/" color="danger">
          <IonIcon slot="start" icon={closeCircle} />
          Leave
        </IonButton>
      );
    }
  };

  if (isError) {
    return <Redirect to="/roomNotFound" />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="secondary">{renderExitButton()}</IonButtons>
          <IonTitle onClick={() => setShowDesc(!showDesc)}>
            {data ? data.name : `Room ${roomId}`} {showDesc ? '▲' : '▼'}
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
          <IonToolbar class="ion-padding-horizontal ion-padding-bottom">
            <small>{data ? data.description : 'No description'}</small>
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
        {isHost ? <Devices /> : null}
        {onlineStatus ? null : (
          <IonToolbar color="danger">
            <IonTitle>You are offline.</IonTitle>
          </IonToolbar>
        )}
        {isAlive ? null : (
          <IonToolbar color="danger" onClick={() => history.push(`/`)}>
            <IonTitle>Room closed. Tap to exit.</IonTitle>
          </IonToolbar>
        )}
        {deviceConnected ? null : (
          <IonToolbar color="danger" onClick={sync}>
            <IonTitle>Device stopped. Tap to sync.</IonTitle>
          </IonToolbar>
        )}
        {offlineToOnline ? (
          <IonToolbar color="danger" onClick={reopenSocket}>
            <IonTitle>Out of sync. Tap to resync.</IonTitle>
          </IonToolbar>
        ) : null}
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
};

export default Room;
