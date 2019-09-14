import React, { Fragment, useState } from 'react';
import { IonItem, IonLabel, IonList, IonToast } from '@ionic/react';
import { useFetch } from 'react-async';
import { useAuth } from '../state/useAuth';

const SearchResults = ({ query, onSearchResultClick }) => {
  const { user } = useAuth();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Track added to queue!');

  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${user}`,
  };
  const { data, error, isLoading } = useFetch(
    `https://api.spotify.com/v1/search?q=${query}&type=track`,
    { headers },
  );

  if (isLoading) return 'Loading...';
  if (error) return `Something went wrong, ensure your Spotify token is valid`;

  if (data) {
    const tracks = data.tracks.items;

    const renderTracks = () => {
      return tracks.map(track => {
        const id = track.id;
        const title = track.name;
        const artists = track.artists.map(artist => artist.name).join(', ');

        const handleClick = event => {
          try {
            onSearchResultClick(id, title, artists);
            setToastMessage(`${title} by ${artists} added to queue!`);
          } catch (err) {
            setToastMessage(err.message);
          } finally {
            setShowToast(true);
          }
        };

        return (
          <IonItem key={id} onClick={handleClick}>
            <IonLabel>
              <h2>{title}</h2>
              <h3>{artists}</h3>
            </IonLabel>
          </IonItem>
        );
      });
    };

    return (
      <Fragment>
        <IonList>{renderTracks()}</IonList>
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={500}
        />
      </Fragment>
    );
  }
};
export default SearchResults;
