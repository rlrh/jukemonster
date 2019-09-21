import { useReducer, useMemo } from 'react';
import produce from 'immer';
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
    queuedTracks: [],
  };

  // Return new state based on actions receieved from WebSockets
  const reducer = (state, action) => {
    console.log(action);
    switch (action.type) {
      case 'user_event':
        return state;
      case 'playback_event':
        return {
          nowPlayingTrack: action.payload,
          queuedTracks: state.queuedTracks.filter(
            track => track.id !== action.payload.id,
          ),
        };
      case 'queue_event':
        return produce(state, draft => {
          const changedTrack = action.payload;
          const index = draft.queuedTracks.findIndex(
            track => track.id === changedTrack.id,
          );
          if (index === undefined) {
            draft.queuedTracks.push(changedTrack);
          } else {
            draft.queuedTracks[index] = changedTrack;
          }
        });
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

  // Handler for adding track
  const addTrack = ({ id, name, artists, album, isExplicit, imageSource }) => {
    console.log(`Added track ${id}`);
    const message = {
      type: 'queue_event',
      payload: {
        id,
        name,
        artists,
        album,
        isExplicit,
        imageSource,
        votes: 0,
      },
    };
    console.log(message);
    sendMessage(JSON.stringify(message));
  };

  // Handler for track upvote
  const upvoteTrack = id => {
    console.log(`Upvoted track ${id}`);
    const track = state.queuedTracks.find(track => track.id === id);
    if (track === undefined) {
      return;
    }
    const message = {
      type: 'queue_event',
      payload: {
        ...track,
        votes: track.votes + 1,
      },
    };
    console.log(message);
    sendMessage(JSON.stringify(message));
  };

  // Handler for track downvote
  const downvoteTrack = id => {
    console.log(`Downvoted track ${id}`);
    const track = state.queuedTracks.find(track => track.id === id);
    if (track === undefined) {
      return;
    }
    const message = {
      type: 'queue_event',
      payload: {
        ...track,
        votes: track.votes - 1,
      },
    };
    console.log(message);
    sendMessage(JSON.stringify(message));
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
