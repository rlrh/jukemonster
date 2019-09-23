import React, { useState } from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonToolbar,
  IonTitle,
  IonPopover,
} from '@ionic/react';
import { useFetch } from 'react-async';
import { useAuth } from '../state/useAuth';

const Devices: React.FC = () => {
  const { value } = useAuth();

  const [showPopover, setShowPopover] = useState(false);

  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${
      typeof value === 'string' ? value : value.spotify_access_token
    }`,
  };
  const { data, error, isLoading } = useFetch(
    `https://api.spotify.com/v1/me/player/devices`,
    { headers },
  );

  const setDevice = async id => {
    await fetch(`https://api.spotify.com/v1/me/player`, {
      method: 'PUT',
      headers: headers,
      body: `{\"device_ids\":[\"${id}\"]}`,
    });
  };

  if (isLoading || error)
    return (
      <IonToolbar onClick={() => setShowPopover(true)}>
        <IonPopover
          isOpen={showPopover}
          onDidDismiss={e => setShowPopover(false)}
          cssClass="popover"
        >
          <IonCard>
            <IonCardHeader>Not Logged In</IonCardHeader>
          </IonCard>
        </IonPopover>
        <IonTitle>Change Player</IonTitle>
      </IonToolbar>
    );

  if (data) {
    return (
      <IonToolbar onClick={() => setShowPopover(true)}>
        <IonPopover
          isOpen={showPopover}
          onDidDismiss={e => setShowPopover(false)}
          cssClass="popover"
        >
          {data.devices.length == 0 ? (
            <IonCard>
              <IonCardHeader>No Devices Available</IonCardHeader>
            </IonCard>
          ) : (
            <p></p>
          )}
          {data.devices.map(item => {
            return (
              <IonCard key={item.id} onClick={() => setDevice(item.id)}>
                <IonCardHeader>
                  <IonCardSubtitle>{item.type}</IonCardSubtitle>
                  <IonCardTitle>{item.name}</IonCardTitle>
                </IonCardHeader>
              </IonCard>
            );
          })}
        </IonPopover>
        <IonTitle>Change player</IonTitle>
      </IonToolbar>
    );
  }
};

export default Devices;
