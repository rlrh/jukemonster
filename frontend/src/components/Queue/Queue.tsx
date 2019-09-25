import React from 'react';
import { IonList, IonListHeader, IonLabel, IonItem } from '@ionic/react';
import QueueTrack from './QueueTrack';
import { QueueProps } from './types';

const Queue: React.FC<QueueProps> = ({
  tracks,
  onTrackUpvote,
  onTrackDownvote,
}) => {
  const renderQueueTracks = () => {
    if (!tracks.length) {
      return (
        <IonItem class="transparent">
          <IonLabel>Nothing in the queue - add some songs!</IonLabel>
        </IonItem>
      );
    }

    const sortedTracks = [...tracks].sort((a, b) => b.votes - a.votes);
    return sortedTracks.map(track => {
      const {
        id,
        name,
        artists,
        album,
        isExplicit,
        imageSource,
        votes,
      } = track;
      const handleUpvote = () => onTrackUpvote(id);
      const handleDownvote = () => onTrackDownvote(id);
      return (
        <QueueTrack
          key={id}
          name={name}
          artists={artists}
          album={album}
          isExplicit={isExplicit}
          imageSource={imageSource}
          votes={votes}
          onUpvote={handleUpvote}
          onDownvote={handleDownvote}
        />
      );
    });
  };

  return (
    <IonList>
      <IonListHeader class="transparent">
        <IonLabel>Next Up</IonLabel>
      </IonListHeader>
      {renderQueueTracks()}
    </IonList>
  );
};

export default Queue;
