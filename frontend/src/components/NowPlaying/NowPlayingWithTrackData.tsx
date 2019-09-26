import React from 'react';
import {
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonNote,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
} from '@ionic/react';
import { usePalette } from 'react-palette';
import { NowPlayingWithTrackDataProps } from './types';

const NowPlayingWithTrackData: React.FC<NowPlayingWithTrackDataProps> = ({
  name,
  artists,
  album,
  isExplicit,
  imageSource,
}) => {
  const { data } = usePalette(imageSource);
  return (
    <IonCardHeader
      style={{
        background: `linear-gradient(${data.darkVibrant ||
          'var(--ion-background-color)'}, var(--ion-background-color))`,
      }}
    >
      <IonGrid>
        <IonRow>
          <IonCol size="3" sizeMd="4" sizeLg="3" />
          <IonCol size="6" sizeMd="4" sizeLg="6">
            <img
              src={imageSource}
              alt={`Album art for ${album}`}
              className="ion-padding"
            />
          </IonCol>
          <IonCol size="3" sizeMd="4" sizeLg="3" />
        </IonRow>
      </IonGrid>
      <IonCardSubtitle>Now Playing</IonCardSubtitle>
      <IonCardTitle>{name}</IonCardTitle>
      <IonNote color="dark" class="block">
        {artists.join(', ')} • {album}
      </IonNote>
      {isExplicit ? <IonBadge color="medium">Explicit</IonBadge> : null}
    </IonCardHeader>
  );
};

export default NowPlayingWithTrackData;
