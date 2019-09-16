import React from 'react';
import { IonList, IonListHeader, IonLabel, IonItem } from '@ionic/react';
import { useQueue } from '../state/useQueue';
import QueueTrack from './QueueTrack';

const Queue = () => {
  const { tracks, upvote, downvote } = useQueue();

  const renderQueueTracks = () => {
    if (!tracks.length) {
      return (
        <IonItem>
          <IonLabel>Nothing in the queue yet, go add some tracks!</IonLabel>
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
      const handleUpvote = () => upvote(id);
      const handleDownvote = () => downvote(id);
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
      <IonListHeader>
        <IonLabel>Next Up</IonLabel>
      </IonListHeader>
      {renderQueueTracks()}
    </IonList>
  );
};

export default Queue;
