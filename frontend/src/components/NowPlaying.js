import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle } from '@ionic/react';
import NowPlayingCard from './NowPlayingCard';

const NowPlaying = ({ track }) => {
  if ('id' in track) {
    return <NowPlayingCard track={track} />;
  }

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Nothing Playing Yet</IonCardTitle>
      </IonCardHeader>
    </IonCard>
  );
};

export default NowPlaying;
