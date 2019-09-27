import React from 'react';
import { IonItem, IonButton, IonIcon, IonBadge } from '@ionic/react';
import { arrowDown, arrowUp } from 'ionicons/icons';
import Track from '../Track';
import { QueueTrackProps } from './types';

const QueueTrack: React.FC<QueueTrackProps> = ({
  name,
  artists,
  album,
  isExplicit,
  imageSource,
  votes,
  onUpvote,
  onDownvote,
  voteDirection,
}) => {
  const renderVotes = () => {
    if (votes < 0) {
      return (
        <IonBadge color="danger" slot="end">
          {votes}
        </IonBadge>
      );
    } else if (votes > 0) {
      return (
        <IonBadge color="success" slot="end">
          {`+${votes}`}
        </IonBadge>
      );
    } else {
      return (
        <IonBadge color="warning" slot="end">
          {votes}
        </IonBadge>
      );
    }
  };

  return (
    <IonItem class="transparent">
      <Track
        name={name}
        artists={artists}
        album={album}
        isExplicit={isExplicit}
        imageSource={imageSource}
      />
      {renderVotes()}
      <IonButton
        onClick={() => onUpvote()}
        color={voteDirection === 'up' ? 'success' : 'medium'}
        fill="clear"
        slot="end"
      >
        <IonIcon slot="icon-only" icon={arrowUp} />
      </IonButton>
      <IonButton
        onClick={() => onDownvote()}
        color={voteDirection === 'down' ? 'danger' : 'medium'}
        fill="clear"
        slot="end"
      >
        <IonIcon slot="icon-only" icon={arrowDown} />
      </IonButton>
    </IonItem>
  );
};

export default QueueTrack;
