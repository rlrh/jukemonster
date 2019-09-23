import React from 'react';
import { IonCard, IonCardHeader, IonCardSubtitle } from '@ionic/react';
import NowPlayingCard from './NowPlayingCard';

const NowPlaying = ({ track }) => {
  if ('id' in track) {
    return <NowPlayingCard track={track} />;
  }

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardSubtitle>Nothing Playing Yet</IonCardSubtitle>
      </IonCardHeader>
    </IonCard>
  );
};

export default NowPlaying;
