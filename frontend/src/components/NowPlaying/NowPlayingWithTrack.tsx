import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonProgressBar,
  IonNote,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import { useFetch } from 'react-async';
import { useAuth } from '../../state/useAuth';
import NowPlayingWithTrackData from './NowPlayingWithTrackData';
import { NowPlayingWithTrackProps } from './types';

const NowPlayingWithTrack: React.FC<NowPlayingWithTrackProps> = ({ track }) => {
  const { spotify_access_token } = useAuth();

  // TODO: use track info returned from server
  const trackID = track.id;
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${spotify_access_token}`,
  };
  const { data, error, isLoading } = useFetch(
    `https://api.spotify.com/v1/tracks/${trackID}`,
    { headers },
  );

  if (error)
    return (
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Error</IonCardTitle>
          <IonCardSubtitle>Something went wrong...</IonCardSubtitle>
        </IonCardHeader>
      </IonCard>
    );

  if (data) {
    const artists = data.artists.map(artist => artist.name).join(', ');
    return (
      <IonCard>
        <IonCardHeader>
          <IonGrid>
            <IonRow>
              <IonCol size="3" sizeMd="4" sizeLg="3" />
              <IonCol size="6" sizeMd="4" sizeLg="6">
                <img src={data.album.images[0].url} className="ion-padding" />
              </IonCol>
              <IonCol size="3" sizeMd="4" sizeLg="3" />
            </IonRow>
          </IonGrid>
          <IonCardSubtitle>Now Playing</IonCardSubtitle>
          <IonCardTitle>{data.name}</IonCardTitle>
          <IonNote color="dark">
            {artists} • {data.album.name}
          </IonNote>
        </IonCardHeader>
      </IonCard>
    );
  }

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Loading...</IonCardTitle>
        <IonCardSubtitle>Please wait</IonCardSubtitle>
        <IonProgressBar type="indeterminate"></IonProgressBar>
      </IonCardHeader>
    </IonCard>
  );
};

export default NowPlayingWithTrack;
