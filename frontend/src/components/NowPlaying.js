import React from 'react';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonProgressBar,
  IonImg,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import { useFetch } from 'react-async';
import { useAuth } from '../state/useAuth';

const NowPlaying = props => {
  const { user } = useAuth();

  //Hardcoded to be update
  const trackID = props.songID;
  const progress = props.progress;

  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${user}`,
  };
  const { data, error, isLoading } = useFetch(
    `https://api.spotify.com/v1/tracks/${trackID}`,
    { headers },
  );

  if (isLoading) return 'Loading...';
  if (error) return `Something went wrong, ensure your Spotify token is valid`;

  if (data) {
    const artists = data.artists.map(artist => artist.name).join(', ');
    return (
      <IonCard>
        <IonCardHeader>
          <IonGrid>
            <IonRow>
              <IonCol size="5">
                <IonImg src={data.album.images[1].url} />
              </IonCol>
              <IonCol size="7">
                <IonCardTitle>{data.name}</IonCardTitle>
                <IonCardSubtitle>{data.album.name}</IonCardSubtitle>
              </IonCol>
            </IonRow>
          </IonGrid>
          <IonCardContent>{artists}</IonCardContent>
        </IonCardHeader>
        <IonProgressBar value={progress}></IonProgressBar>
        <br />
      </IonCard>
    );
  }
};

export default NowPlaying;
