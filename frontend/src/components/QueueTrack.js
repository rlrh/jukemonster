import React from 'react';
import { IonItem, IonLabel, IonButton, IonIcon, IonBadge } from '@ionic/react';
import { arrowDown, arrowUp, more } from 'ionicons/icons';

const QueueTrack = ({ title, artist, votes, onUpvote, onDownvote }) => {
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
      <IonLabel>
        <h2>{title}</h2>
        <h3>{artist}</h3>
      </IonLabel>
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
