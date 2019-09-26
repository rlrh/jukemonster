import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonContent,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonButtons,
  IonAlert,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from '@ionic/react';
import { useAuth } from '../state/useAuth';
import { Redirect, RouteComponentProps } from 'react-router-dom';

const Home: React.FC<RouteComponentProps> = ({
  match,
  history,
}: RouteComponentProps) => {
  const {
    isAuthenticated,
    value,
    spotify_access_token,
    ensureTokenValidity,
  } = useAuth();

  const [roomId, setRoomId] = useState('');
  const [showAlertCreateRoom, setShowAlertCreateRoom] = useState(false);

  useIonViewWillEnter(() => setRoomId(''));
  useIonViewWillLeave(() => setRoomId(''));

  const handleCreateRoom = async () => {
    if (isAuthenticated && typeof value !== 'string') {
      const headers = {
        Accept: 'application/json',
        Authorization: `Bearer ${spotify_access_token}`,
      };
      const res = await fetch(`https://api.spotify.com/v1/me`, {
        method: 'GET',
        headers: headers,
      });
      const account = await res.json();
      const hasPremium = account['product'] === 'premium';
      if (!hasPremium) {
        setShowAlertCreateRoom(true);
      } else {
        history.push(`/host`);
      }
    } else {
      setShowAlertCreateRoom(true);
    }
  };

  return (
    <IonPage>
      <IonGrid fixed class="no-padding">
        <IonHeader>
          <IonToolbar class="transparent">
            <IonTitle>Jukemonster</IonTitle>
            <IonButtons slot="primary">
              {isAuthenticated ? (
                <IonButton href="/signout">Sign Out</IonButton>
              ) : (
                <IonButton href="/signin">Sign In</IonButton>
              )}
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonRow>
            <IonCol size="12" sizeMd="6">
              <h1 className="display-5 ion-padding ion-hide-lg-up">
                The social jukebox for Spotify.
              </h1>
              <h1 className="display-4 ion-padding ion-hide-md-down">
                The social jukebox for Spotify.
              </h1>
            </IonCol>
            <IonCol size="12" sizeMd="6">
              <br />
              <IonItem>
                <IonLabel position="floating">Room ID</IonLabel>
                <IonInput
                  value={roomId}
                  onIonChange={event =>
                    setRoomId((event.target as HTMLInputElement).value)
                  }
                />
              </IonItem>
              <IonButton
                href={roomId ? `/room/${roomId}` : ''}
                expand="full"
                color="favorite"
              >
                Join Room
              </IonButton>
              <br />
              <IonButton
                onClick={handleCreateRoom}
                expand="full"
                color="google"
              >
                Host Room
              </IonButton>
              <br />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12" sizeMd="4">
              <IonCard>
                <IonCardHeader>
                  <IonCardSubtitle>For hosts</IonCardSubtitle>
                  <IonCardTitle>
                    Let your guests control your music
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  Perfect for parties, gatherings, bars, coffee shops, clubs,
                  workplaces, events, weddings, gyms and more.
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="12" sizeMd="4">
              <IonCard>
                <IonCardHeader>
                  <IonCardSubtitle>For guests</IonCardSubtitle>
                  <IonCardTitle>Everyone's invited to the party</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  Join any room straight from the web. Share a web link that
                  lets anyone join the fun in seconds.
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="12" sizeMd="4">
              <IonCard>
                <IonCardHeader>
                  <IonCardSubtitle>For guests</IonCardSubtitle>
                  <IonCardTitle>Influence the song order</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  Request from millions of tracks on Spotify. Vote songs up or
                  down to influence the song order.
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonAlert
            isOpen={showAlertCreateRoom}
            onDidDismiss={() => setShowAlertCreateRoom(false)}
            header="You need to sign in with a Spotify Premium account"
            buttons={
              !isAuthenticated
                ? [
                    {
                      text: 'Cancel',
                      role: 'cancel',
                      cssClass: 'secondary',
                    },
                    {
                      text: 'Sign In',
                      handler: () => {
                        history.push(`/signin`);
                      },
                    },
                  ]
                : [
                    {
                      text: 'Cancel',
                      role: 'cancel',
                      cssClass: 'secondary',
                    },
                  ]
            }
          />
        </IonContent>
      </IonGrid>
    </IonPage>
  );
};

export default Home;
