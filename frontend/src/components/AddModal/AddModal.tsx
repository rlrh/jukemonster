import React, { useState } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonSearchbar,
} from '@ionic/react';
import { useAuth } from '../../state/useAuth';
import SearchResults from './SearchResults';
import { AddModalProps } from './types';

const AddModal: React.FC<AddModalProps> = ({
  isOpen,
  onClose,
  onSearchResultClick,
}) => {
  const { user } = useAuth();

  const [query, setQuery] = useState('');
  const handleChange = event => setQuery(event.target.value);

  if (!user) {
    return (
      <IonModal isOpen={isOpen} onDidDismiss={onClose}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="primary">
              <IonButton onClick={onClose}>Close</IonButton>
            </IonButtons>
            <IonTitle>Add A Track</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonItem>
            <IonLabel>
              <h2>You need to login with Spotify to add a track.</h2>
            </IonLabel>
          </IonItem>
        </IonContent>
      </IonModal>
    );
  }

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="primary">
            <IonButton onClick={onClose}>Close</IonButton>
          </IonButtons>
          <IonTitle>Add A Track</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar value={query} onIonChange={handleChange}></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {query ? (
          <SearchResults
            query={query}
            onSearchResultClick={onSearchResultClick}
          />
        ) : (
          <IonItem>
            <IonLabel>
              <h2>No search results to display.</h2>
            </IonLabel>
          </IonItem>
        )}
      </IonContent>
    </IonModal>
  );
};

export default AddModal;
