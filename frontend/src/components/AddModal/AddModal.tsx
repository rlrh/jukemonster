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
  const { isAuthenticated } = useAuth();

  const [query, setQuery] = useState('');
  const handleChange = event => setQuery(event.target.value);

  const handleClose = () => {
    // setQuery('');
    onClose();
  };

  if (!isAuthenticated) {
    return (
      <IonModal isOpen={isOpen} onDidDismiss={handleClose}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="primary">
              <IonButton onClick={handleClose}>Close</IonButton>
            </IonButtons>
            <IonTitle>Add Songs</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent class="item-background">
          <IonItem>
            <IonLabel>
              <h2>You need to login with Spotify to add songs.</h2>
            </IonLabel>
          </IonItem>
        </IonContent>
      </IonModal>
    );
  }

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleClose}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="primary">
            <IonButton onClick={handleClose}>Close</IonButton>
          </IonButtons>
          <IonTitle>Add Songs</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar value={query} onIonChange={handleChange}></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent class="item-background">
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
