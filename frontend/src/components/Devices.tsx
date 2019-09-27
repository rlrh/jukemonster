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

export interface Device {
  id: string;
  type: string;
  name: string;
  is_active: boolean;
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
    if (res && res.data) {
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
    setTimeout(function() {
      getDevices();
    }, 500);
  };

  if (isLoading || error)
    return (
      <Fragment>
        <IonToolbar>
          <IonTitle>Loading...</IonTitle>
          <IonButton
            size="small"
            slot="start"
            color="black"
            onClick={getDevices}
          >
            Refresh
          </IonButton>
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
          <IonContent class="item-background">
            {data.devices.length == 0 ? (
              <IonCard>
                <IonCardHeader>
                  <IonCardSubtitle>No Devices Available</IonCardSubtitle>
                </IonCardHeader>
              </IonCard>
            ) : null}
            {data.devices.map(item => {
              return (
                <IonCard
                  key={item.id}
                  onClick={() => {
                    setDevice(item.id);
                    setShowModal(false);
                  }}
                  class="item-background-light"
                >
                  <IonCardHeader>
                    <IonCardSubtitle>{item.type}</IonCardSubtitle>
                    <IonCardTitle>{item.name}</IonCardTitle>
                  </IonCardHeader>
                </IonCard>
              );
            })}
          </IonContent>
        </IonModal>

        <IonToolbar>
          {data.devices.filter(x => x.is_active).length == 0 ? (
            <IonTitle>No active devices</IonTitle>
          ) : null}
          {data.devices
            .filter(x => x.is_active)
            .map(item => {
              return <IonTitle key={item.id}>{item.name}</IonTitle>;
            })}
          <IonButton
            size="small"
            slot="start"
            color="black"
            onClick={getDevices}
          >
            Refresh
          </IonButton>
          <IonButton
            size="small"
            slot="end"
            color="black"
            onClick={() => setShowModal(true)}
          >
            Change
          </IonButton>
        </IonToolbar>
      </Fragment>
    );
  }
};

export default Devices;
