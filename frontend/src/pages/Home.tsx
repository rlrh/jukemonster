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
  useIonViewWillEnter,
  useIonViewWillLeave,
} from '@ionic/react';
import { useAuth } from '../state/useAuth';
import { useSignInRedirect } from '../hooks/useSignInRedirect';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { signInRedirect } = useSignInRedirect();
  const [roomId, setRoomId] = useState('');

  useIonViewWillEnter(() => setRoomId(''));
  useIonViewWillLeave(() => setRoomId(''));

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
                <IonButton href="/signin" onClick={signInRedirect}>
                  Sign In With Spotify
                </IonButton>
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
              <br />
              <IonItem>
                <IonLabel position="floating">Room ID</IonLabel>
                <IonInput
                  value={roomId}
                  onIonChange={event =>
                    setRoomId((event.target as HTMLInputElement).value)
                  }
                  type="text"
                  minlength={5}
                  maxlength={5}
                  placeholder="Enter the 5-character room ID here"
                  autofocus
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
              <IonButton href="/host" expand="full" color="google">
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
                  Don't know what music to play at your party or gathering? Let
                  your guests choose the music for you!
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
                  Share a web link that lets anyone join the party in seconds.
                  No need to download an app - Jukemonster works in the browser.
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="12" sizeMd="4">
              <IonCard>
                <IonCardHeader>
                  <IonCardSubtitle>For guests</IonCardSubtitle>
                  <IonCardTitle>Influence the songs played</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  Request from millions of tracks on Spotify. Vote songs up or
                  down to influence the song order.
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonContent>
      </IonGrid>
    </IonPage>
  );
};

export default Home;
