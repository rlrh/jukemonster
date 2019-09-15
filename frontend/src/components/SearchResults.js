import React, { Fragment, useState } from 'react';
import { IonItem, IonList, IonToast } from '@ionic/react';
import { useFetch } from 'react-async';
import { useAuth } from '../state/useAuth';
import Track from './Track';

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
        const name = track.name;
        const artists = track.artists.map(artist => artist.name);
        const album = track.album.name;
        const isExplicit = track.explicit;
        const imageSource = track.album.images.slice(-1)[0].url;

        const handleClick = event => {
          try {
            onSearchResultClick({
              id,
              name,
              artists,
              album,
              isExplicit,
              imageSource,
            });
            setToastMessage(`${name} added to queue!`);
          } catch (err) {
            setToastMessage(err.message);
          } finally {
            setShowToast(true);
          }
        };

        return (
          <IonItem key={id} onClick={handleClick}>
            <Track
              name={name}
              artists={artists}
              album={album}
              isExplicit={isExplicit}
              imageSource={imageSource}
            />
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
