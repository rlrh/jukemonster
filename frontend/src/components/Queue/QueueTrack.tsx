import React from 'react';
import { IonItem, IonButton, IonIcon, IonBadge } from '@ionic/react';
import { arrowDown, arrowUp, more } from 'ionicons/icons';
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
    <IonItem>
      <Track
        name={name}
        artists={artists}
        album={album}
        isExplicit={isExplicit}
        imageSource={imageSource}
      />
      {renderVotes()}
      <IonButton onClick={() => onUpvote()} fill="clear" slot="end">
        <IonIcon slot="icon-only" icon={arrowUp} />
      </IonButton>
      <IonButton onClick={() => onDownvote()} fill="clear" slot="end">
        <IonIcon slot="icon-only" icon={arrowDown} />
      </IonButton>
      <IonButton fill="clear" slot="end">
        <IonIcon slot="icon-only" icon={more} />
      </IonButton>
    </IonItem>
  );
};

export default QueueTrack;
