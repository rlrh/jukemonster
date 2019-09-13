import React from 'react';
import { IonItem, IonLabel, IonNote, IonButton, IonIcon } from '@ionic/react';
import { arrowDown, arrowUp, more } from 'ionicons/icons';

const QueueSong = ({ title, artist }) => (
  <IonItem>
    <IonLabel>
      <h1>{title}</h1>
      <IonNote>{artist}</IonNote>
    </IonLabel>
    <IonButton fill="clear" slot="end">
      <IonIcon slot="icon-only" icon={arrowUp} />
    </IonButton>
    <IonButton fill="clear" slot="end">
      <IonIcon slot="icon-only" icon={arrowDown} />
    </IonButton>
    <IonButton fill="clear" slot="end">
      <IonIcon slot="icon-only" icon={more} />
    </IonButton>
  </IonItem>
);

export default QueueSong;
