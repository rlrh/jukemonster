import React, { useState, useEffect } from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonToolbar,
  IonTitle,
  IonPopover,
} from '@ionic/react';
import { useOurApi, useSpotifyApi } from '../apis';

interface Device {
  id: string;
  type: string;
  name: string;
}

const Devices: React.FC = () => {
  const spotify = useSpotifyApi();
  const ours = useOurApi();

  const [showPopover, setShowPopover] = useState(false);

  const [data, setData] = useState({ devices: [] as Device[] });
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getDevices = async () => {
    setLoading(true);
    const res = await spotify.getApi(
      `https://api.spotify.com/v1/me/player/devices`,
    );
    setData(res.data);
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
      <IonToolbar onClick={() => setShowPopover(true)}>
        <IonPopover
          isOpen={showPopover}
          onDidDismiss={() => setShowPopover(false)}
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
          onDidDismiss={() => setShowPopover(false)}
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
