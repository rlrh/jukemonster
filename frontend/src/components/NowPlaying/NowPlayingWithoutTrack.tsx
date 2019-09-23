import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
} from '@ionic/react';

const NowPlayingWithoutTrack: React.FC = () => (
  <IonCard>
    <IonCardHeader>
      <IonCardTitle>Nothing Playing Yet</IonCardTitle>
      <IonCardSubtitle>Add some songs!</IonCardSubtitle>
    </IonCardHeader>
  </IonCard>
);

export default NowPlayingWithoutTrack;
