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

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

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
              <IonButton href={`/rooms/addRoom`} expand="full" color="google">
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
        </IonContent>
      </IonGrid>
    </IonPage>
  );
};

export default Home;
