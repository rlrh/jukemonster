import React, { Fragment, useState } from 'react';
import {
  IonItem,
  IonList,
  IonToast,
  IonLabel,
  IonSkeletonText,
} from '@ionic/react';
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

  if (error) {
    return (
      <IonItem>
        <IonLabel>
          <h2>Something went wrong...</h2>
        </IonLabel>
      </IonItem>
    );
  }

  if (isLoading) {
    return (
      <Fragment>
        <IonList>
          <IonItem>
            <IonLabel>
              <h2>
                <IonSkeletonText animated style={{ width: '15%' }} />
              </h2>
              <h3>
                <IonSkeletonText animated style={{ width: '45%' }} />
              </h3>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h2>
                <IonSkeletonText animated style={{ width: '10%' }} />
              </h2>
              <h3>
                <IonSkeletonText animateds style={{ width: '30%' }} />
              </h3>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h2>
                <IonSkeletonText animated style={{ width: '20%' }} />
              </h2>
              <h3>
                <IonSkeletonText animated style={{ width: '60%' }} />
              </h3>
            </IonLabel>
          </IonItem>
        </IonList>
      </Fragment>
    );
  }

  if (data) {
    const tracks = data.tracks.items;

    if (!tracks.length) {
      return (
        <IonItem>
          <IonLabel>
            <h2>No search results to display.</h2>
          </IonLabel>
        </IonItem>
      );
    }

    const renderTracks = () => {
      return tracks.map(track => {
        const id = track.id;
        const name = track.name;
        const artists = track.artists.map(artist => artist.name);
        const album = track.album.name;
        const isExplicit = track.explicit;
        const imageSource = track.album.images.slice(-1)[0].url;
        const trackDuration = track.duration_ms;

        const handleClick = event => {
          try {
            onSearchResultClick({
              id,
              name,
              artists,
              album,
              isExplicit,
              imageSource,
              trackDuration,
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
