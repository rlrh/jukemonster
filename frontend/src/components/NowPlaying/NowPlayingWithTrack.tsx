import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonProgressBar,
} from '@ionic/react';
import { useFetch } from 'react-async';
import { useAuth } from '../../state/useAuth';
import { NowPlayingWithTrackProps } from './types';
import NowPlayingWithTrackData from './NowPlayingWithTrackData';

const NowPlayingWithTrack: React.FC<NowPlayingWithTrackProps> = ({ track }) => {
  const { spotify_access_token } = useAuth();

  // TODO: use track info returned from server
  const trackID = track.id;
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${spotify_access_token}`,
  };
  const { data, error } = useFetch(
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
    const name = data.name;
    const artists = data.artists.map(artist => artist.name).join(', ');
    const album = data.album.name;
    const isExplicit = data.explicit;
    const imageSource = data.album.images[0].url;
    return (
      <NowPlayingWithTrackData
        {...{ name, artists, album, isExplicit, imageSource }}
      />
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
