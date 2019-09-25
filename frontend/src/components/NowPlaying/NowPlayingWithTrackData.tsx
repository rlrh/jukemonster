import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonNote,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';

const NowPlayingWithTrackData = ({ data }) => {
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
};

export default NowPlayingWithTrackData;
