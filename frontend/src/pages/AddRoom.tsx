import React, { useState } from 'react';
import { useOurApi } from '../apis';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonItem,
  IonLabel,
  IonCard,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonCardSubtitle,
} from '@ionic/react';
import Devices from '../components/Devices';

const AddRoom = ({ history }) => {
  const [name, setName] = useState('');
  const [description, setdescription] = useState('');
  const { postApi } = useOurApi();

  const submit = async () => {
    try {
      const res = await postApi('rooms/', { name, description });
      const value = res.data;
      const roomId = value['unique_identifier'];
      history.push(`/room/${roomId}`);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/rooms" />
          </IonButtons>
          <IonTitle>Add Room</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <form
            onSubmit={e => {
              e.preventDefault();
              submit();
            }}
          >
            <IonCardContent>
              <IonCardTitle>Create room</IonCardTitle>
              <IonItem>
                <IonLabel position="floating">Description</IonLabel>
                <IonInput
                  required={true}
                  name="description"
                  type="text"
                  value={description}
                  onIonChange={e =>
                    setdescription((e.target as HTMLInputElement).value)
                  }
                />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Name</IonLabel>
                <IonInput
                  required={true}
                  name="name"
                  type="text"
                  value={name}
                  onIonChange={e =>
                    setName((e.target as HTMLInputElement).value)
                  }
                />
              </IonItem>
              <br />
              <IonItem>
                <IonCardSubtitle>Playback Device: </IonCardSubtitle>
              </IonItem>
              <IonItem>
                <Devices />
              </IonItem>
              <br />
              <IonButton expand="block" type="submit">
                Create
              </IonButton>
            </IonCardContent>

            <IonCardContent></IonCardContent>
          </form>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};
export default AddRoom;
