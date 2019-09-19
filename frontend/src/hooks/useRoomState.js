import { useState, useEffect, useMemo } from 'react';
import useWebSocket from 'react-use-websocket';

const useRoomState = roomId => {
  const socketUrl = `ws://127.0.0.1:8000/ws/room/${roomId}/`;
  const STATIC_OPTIONS = useMemo(
    () => ({
      onOpen: console.log,
      onError: console.log,
      onMessage: console.log,
      onClose: console.log,
    }),
    [],
  );
  const [sendMessage, lastMessage, readyState] = useWebSocket(
    socketUrl,
    STATIC_OPTIONS,
  );

  const [nowPlayingTrack, setNowPlayingTrack] = useState({});
  const [queuedTracks, setQueuedTracks] = useState([]);

  // TODO: send message to websocket
  const addTrack = ({
    id,
    name,
    artists,
    album,
    isExplicit,
    imageSource,
    votes,
  }) => console.log(id, name, artists, album, isExplicit, imageSource, votes);

  // TODO: send message to websocket
  const upvoteTrack = id => {
    console.log(`Upvoted track ${id}`);
  };

  // TODO: send message to websocket
  const downvoteTrack = id => {
    console.log(`Downvoted track ${id}`);
  };

  // TODO: remove this placeholder state
  useEffect(() => {
    setNowPlayingTrack({ id: '11dFghVXANMlKmJXsNCbNl' });
    setQueuedTracks([
      {
        id: '11dFghVXANMlKmJXsNCbNl',
        name: 'Cut To The Feeling',
        artists: ['Carly Rae Jepsen'],
        album: 'Cut To The Feeling',
        isExplicit: false,
        imageSource:
          'https://i.scdn.co/image/107819f5dc557d5d0a4b216781c6ec1b2f3c5ab2',
        votes: 0,
      },
      {
        id: '7xGfFoTpQ2E7fRF5lN10tr',
        name: 'Run Away With Me',
        artists: ['Carly Rae Jepsen'],
        album: 'Emotion (Deluxe)',
        isExplicit: false,
        imageSource:
          'https://i.scdn.co/image/ff347680d9e62ccc144926377d4769b02a1024dc',
        votes: 0,
      },
    ]);
  }, []);

  return {
    nowPlayingTrack,
    queuedTracks,
    addTrack,
    upvoteTrack,
    downvoteTrack,
  };
};

export default useRoomState;
