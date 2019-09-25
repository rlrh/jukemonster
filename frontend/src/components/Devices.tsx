import React, { useState, useEffect, Fragment } from 'react';
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
import { useOurApi, useSpotifyApi } from '../apis';

interface Device {
  id: string;
  type: string;
  name: string;
}

const Devices = () => {
  const spotify = useSpotifyApi();
  const ours = useOurApi();

  const [showModal, setShowModal] = useState(false);

  const [data, setData] = useState({ devices: [] });
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getDevices = async () => {
    setLoading(true);
    const res = await spotify.getApi(
      `https://api.spotify.com/v1/me/player/devices`,
    );
    if (res) {
      setData(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    getDevices();
  }, []);

  const setDevice = async (id: string) => {
    spotify.putApi(`https://api.spotify.com/v1/me/player`, {
      device_ids: [id],
    });
    ours.putApi(`users/device/`, { device_id: id });
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
