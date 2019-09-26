import React, { Fragment, useState, useEffect } from 'react';
import {
  IonItem,
  IonList,
  IonToast,
  IonLabel,
  IonSkeletonText,
} from '@ionic/react';
import { useSpotifyApi } from '../../apis';
import useDeclarativeDataFetching from '../../hooks/useDeclarativeDataFetching';
import Track from '../Track';
import { SearchResultsProps } from './types';

const SearchResults: React.FC<SearchResultsProps> = ({
  query,
  onSearchResultClick,
}) => {
  const [toastMessage, setToastMessage] = useState('Track added to queue!');
  const [showToast, setShowToast] = useState(false);

  const { getApi } = useSpotifyApi();
  const { isLoading, isError, data } = useDeclarativeDataFetching(
    getApi,
    `https://api.spotify.com/v1/search?q=${query}&type=track`,
  );

  /* Legacy code
  const error = null;
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  useEffect(() => {
    const getData = async () => {
      const resp = await getApi(
        `https://api.spotify.com/v1/search?q=${query}&type=track`,
      );
      setData(resp.data);
      setLoading(false);
    };
    getData();
  }, [query]);
  */

  if (isError) {
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
          {Array.from(Array(20).keys()).map(i => (
            <IonItem key={i}>
              <IonLabel>
                <h2>
                  <IonSkeletonText animated style={{ width: '15%' }} />
                </h2>
                <h3>
                  <IonSkeletonText animated style={{ width: '30%' }} />
                </h3>
              </IonLabel>
            </IonItem>
          ))}
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
  return (
    <IonItem>
      <IonLabel>
        <h2>No search results to display.</h2>
      </IonLabel>
    </IonItem>
  );
};
export default SearchResults;
