import React from 'react';
import {
  IonCard,
  IonCardContent,
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
import { Track } from '../../hooks/useRoomState/types';

type NowPlayingWithTrackProps = {
  track: Track;
};

const NowPlayingWithTrack: React.FC<NowPlayingWithTrackProps> = ({ track }) => {
  const { user } = useAuth();

  // TODO: use track info returned from server
  const trackID = track.id;
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${user}`,
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
          <IonCardSubtitle>Now Playing</IonCardSubtitle>
          <IonGrid>
            <IonRow>
              <IonCol size="3" sizeSm="4" />
              <IonCol size="6" sizeSm="4">
                <img src={data.album.images[0].url} className="ion-padding" />
              </IonCol>
              <IonCol size="3" sizeSm="4" />
            </IonRow>
          </IonGrid>
          <IonCardTitle>{data.name}</IonCardTitle>
          <IonNote color="medium">
            {artists} • {data.album.name}
          </IonNote>
        </IonCardHeader>
        <IonCardContent>
          <IonProgressBar value={0.28}></IonProgressBar>
        </IonCardContent>
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
