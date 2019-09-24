import React, { useState, Fragment } from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonToolbar,
  IonTitle,
  IonModal,
  IonHeader,
  IonContent,
  IonButtons,
  IonButton,
} from '@ionic/react';
import { useFetch } from 'react-async';
import { useAuth } from '../state/useAuth';

const Devices: React.FC = () => {
  const { value } = useAuth();

  const [showModal, setShowModal] = useState(false);

  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${value &&
      (typeof value === 'string' ? value : value.spotify_access_token)}`,
  };
  const { data, error, isLoading } = useFetch(
    `https://api.spotify.com/v1/me/player/devices`,
    { headers },
  );

  const setDevice = async id => {
    await fetch(`https://api.spotify.com/v1/me/player`, {
      method: 'PUT',
      headers: headers,
      body: `{device_ids:["${id}]"}`,
    });
  };

  if (isLoading || error)
    return (
      <Fragment>
        <IonModal isOpen={showModal} onDidDismiss={e => setShowModal(false)}>
          <IonHeader translucent>
            <IonToolbar>
              <IonTitle>Change Device</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonCard>
              <IonCardHeader>
                <IonCardSubtitle>Not Logged In</IonCardSubtitle>
              </IonCardHeader>
            </IonCard>
          </IonContent>
        </IonModal>
        <IonToolbar onClick={() => setShowModal(true)}>
          <IonTitle>Change Player</IonTitle>
        </IonToolbar>
      </Fragment>
    );

  if (data) {
    return (
      <Fragment>
        <IonModal isOpen={showModal} onDidDismiss={e => setShowModal(false)}>
          <IonHeader translucent>
            <IonToolbar>
              <IonTitle>Change Device</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {data.devices.length == 0 ? (
              <IonCard>
                <IonCardHeader>
                  <IonCardSubtitle>No Devices Available</IonCardSubtitle>
                </IonCardHeader>
              </IonCard>
            ) : null}
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
          </IonContent>
        </IonModal>
        <IonToolbar onClick={() => setShowModal(true)}>
          <IonTitle>Change Player</IonTitle>
        </IonToolbar>
      </Fragment>
    );
  }
};

export default Devices;
