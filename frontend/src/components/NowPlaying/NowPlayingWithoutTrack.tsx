import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonNote,
} from '@ionic/react';

const NowPlayingWithoutTrack: React.FC = () => (
  <IonCard>
    <IonCardHeader>
      <IonCardSubtitle>Now Playing</IonCardSubtitle>
      <IonCardTitle>Nothing Playing Now</IonCardTitle>
      <IonNote color="dark">Add some songs!</IonNote>
    </IonCardHeader>
  </IonCard>
);

export default NowPlayingWithoutTrack;
