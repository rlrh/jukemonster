import { useState, useReducer, useMemo } from 'react';
import useWebSocket from 'react-use-websocket';

const useRoomState = roomId => {
  // Setup WebSocket connection hook
  const socketUrl = `ws://127.0.0.1:8000/ws/room/${roomId}/`;
  const STATIC_OPTIONS = useMemo(
    () => ({
      onOpen: console.log,
      onError: console.log,
      onMessage: handleMessage,
      onClose: console.log,
    }),
    [],
  );
  const [sendMessage, lastMessage, readyState] = useWebSocket(
    socketUrl,
    STATIC_OPTIONS,
  );

  // TODO: remove placeholder initial values
  const initialValues = {
    nowPlayingTrack: {
      id: '11dFghVXANMlKmJXsNCbNl',
    },
    queuedTracks: [
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
    ],
  };

  // TODO: return new state based on action type and payload
  const reducer = (state, action) => {
    switch (action.type) {
      case 'joinevent':
        console.log(action.payload);
        return state;
      case 'contentevent':
        console.log(action.payload);
        return state;
      default:
        return state;
    }
  };

  // State management
  const [state, dispatch] = useReducer(reducer, initialValues);

  // Let reducer handle state update
  function handleMessage(message) {
    const action = JSON.parse(message.data);
    dispatch(action);
  }

  // TODO: sendMessage to websocket
  const addTrack = ({
    id,
    name,
    artists,
    album,
    isExplicit,
    imageSource,
    votes,
  }) => {
    console.log(id, name, artists, album, isExplicit, imageSource, votes);
  };

  // TODO: sendMessage to websocket
  const upvoteTrack = id => {
    console.log(`Upvoted track ${id}`);
  };

  // TODO: sendMessage to websocket
  const downvoteTrack = id => {
    console.log(`Downvoted track ${id}`);
  };

  return {
    nowPlayingTrack: state.nowPlayingTrack,
    queuedTracks: state.queuedTracks,
    addTrack,
    upvoteTrack,
    downvoteTrack,
  };
};

export default useRoomState;
