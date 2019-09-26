import { useState, useMemo, useEffect, useReducer } from 'react';
import useWebSocket from 'react-use-websocket';
import { produce } from 'immer';
import { useAuth } from '../../state/useAuth';
import useOnlineStatus from '@rehooks/online-status';
import { getItem, setItem, removeItem } from '../../utils/localStorage';
import {
  RoomState,
  Track,
  QueueEvent,
  VoteActionEvent,
  Event,
  EventType,
  Message,
  StopEvent,
} from './types';

const useRoomState = (roomId: string) => {
  const ROOM_STATE_KEY = roomId + '-state';
  const ROOM_ACTIONS_KEY = roomId + '-actions';

  // Initiate state from local storage if available
  let initialState = getItem(ROOM_STATE_KEY);
  if (initialState == null) {
    initialState = {
      nowPlayingTrack: {},
      queuedTracks: [],
      isAlive: true,
      deviceConnected: true,
    };
  }

  // Return new state based on actions receieved from WebSockets
  const reducer = (state: RoomState, action: Event) => {
    console.log('Current state: ' + JSON.stringify(state));
    console.log('Incoming action: ' + JSON.stringify(action));

    let nextState = state;
    switch (action.type) {
      case EventType.Stop:
        nextState = produce(state, draftState => {
          const status = action.payload.type;
          if (status === 'close') {
            draftState.isAlive = false;
          } else if (status === 'disconnect') {
            draftState.deviceConnected = false;
          }
        });
        break;
      case EventType.Playback:
        nextState = produce(state, draftState => {
          const incomingTrack = action.payload;
          draftState.nowPlayingTrack = incomingTrack;
          if ('id' in incomingTrack) {
            draftState.queuedTracks = draftState.queuedTracks.filter(
              track => track.id !== incomingTrack.id,
            );
          }
        });
        break;
      case EventType.Queue:
        nextState = produce(state, draftState => {
          const incomingTracks = action.payload.songs;
          if (action.payload.type == 'all') {
            draftState.queuedTracks = incomingTracks;
          } else {
            incomingTracks.forEach(incomingTrack => {
              const incomingTrackQueueIndex = draftState.queuedTracks.findIndex(
                track => track.id === incomingTrack.id,
              );
              if (incomingTrackQueueIndex === -1) {
                draftState.queuedTracks.push(incomingTrack);
              } else {
                draftState.queuedTracks[
                  incomingTrackQueueIndex
                ] = incomingTrack;
              }
            });
          }
        });
        break;
      case EventType.VoteCount:
        nextState = produce(state, draftState => {
          const incomingTracks = action.payload.songs;
          incomingTracks.forEach(incomingTrack => {
            const incomingTrackQueueIndex = draftState.queuedTracks.findIndex(
              track => track.id === incomingTrack.id,
            );
            if (incomingTrackQueueIndex !== -1) {
              draftState.queuedTracks[incomingTrackQueueIndex].votes =
                incomingTrack.votes;
            }
          });
        });
        break;
      case EventType.Invalidate:
        nextState = { ...state, nowPlayingTrack: {}, queuedTracks: [] };
        break;
      default:
    }
    console.log('Next state: ' + JSON.stringify(nextState));
    setItem(ROOM_STATE_KEY, nextState);
    return nextState;
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  // Setup WebSocket connection hook
  const { isAuthenticated, access_token } = useAuth();
  const auth = useMemo(() => isAuthenticated, []);
  const token = useMemo(() => access_token, []);
  const SOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL + `/ws/room/${roomId}`;
  const [socketUrl, setSocketUrl] = useState(SOCKET_URL);
  const STATIC_OPTIONS = useMemo(
    () => ({
      onOpen: handleOpen,
      onError: console.log,
      onMessage: handleMessage,
      onClose: console.log,
      queryParams: auth ? { access_token: token } : null,
    }),
    [],
  );
  const [sendWebSocketMessage, lastMessage, readyState] = useWebSocket(
    socketUrl,
    STATIC_OPTIONS,
  );

  // Let reducer handle state update
  function handleMessage(rawMessage: any) {
    const message: Message = rawMessage as Message;
    const action: Event = JSON.parse(message.data);
    dispatch(action);
  }

  // Invalidate cache on connection
  function handleOpen(event) {
    console.log(event);
    dispatch({ type: EventType.Invalidate });
  }

  const onlineStatus = useOnlineStatus();
  useEffect(() => {
    if (onlineStatus) {
      sendCachedMessages();
      console.log('Now online');
    } else {
      console.log('Now offline');
    }
  }, [onlineStatus]);

  // Caches message if offline else sends it
  function sendMessage(message) {
    if (!onlineStatus) {
      console.log('Offline - saving message to cache...');
      const oldCache = getItem(ROOM_ACTIONS_KEY);
      if (oldCache != null) {
        oldCache.push(message);
        setItem(ROOM_ACTIONS_KEY, oldCache);
      } else {
        setItem(ROOM_ACTIONS_KEY, [message]);
      }
    } else {
      console.log('Online - sending message...');
      sendWebSocketMessage(JSON.stringify(message));
    }
  }

  // Sends cached messages
  function sendCachedMessages() {
    removeItem(ROOM_STATE_KEY);
    const cachedMessages = getItem(ROOM_ACTIONS_KEY);
    if (cachedMessages != null) {
      console.log('Sending cached messages...');
      cachedMessages.forEach(element => {
        sendWebSocketMessage(JSON.stringify(element));
      });
      removeItem(ROOM_ACTIONS_KEY);
    }
  }

  // Handler for adding track
  function addTrack(track: Track) {
    console.log(`Added track ${track.id}`); // TODO: remove
    const message: QueueEvent = {
      type: EventType.Queue,
      payload: {
        songs: [track],
        type: 'changes',
      },
    };
    console.log('Outgoing action: ' + JSON.stringify(message));
    sendMessage(message);
  }

  // Handler for track upvote
  function upvoteTrack(id: string) {
    console.log(`Upvoted track ${id}`);
    const track = state.queuedTracks.find(track => track.id === id);
    if (track === undefined) {
      return;
    }
    const message: VoteActionEvent = {
      type: EventType.VoteAction,
      payload: {
        votes: [
          {
            id,
            voteDirection: 'up',
          },
        ],
      },
    };
    console.log('Outgoing action: ' + JSON.stringify(message));
    sendMessage(message);
  }

  // Handler for track downvote
  function downvoteTrack(id: string) {
    console.log(`Downvoted track ${id}`);
    const track = state.queuedTracks.find(track => track.id === id);
    if (track === undefined) {
      return;
    }
    const message: VoteActionEvent = {
      type: EventType.VoteAction,
      payload: {
        votes: [
          {
            id,
            voteDirection: 'down',
          },
        ],
      },
    };
    console.log('Outgoing action: ' + JSON.stringify(message));
    sendMessage(message);
  }

  // Handler for sync
  function sync() {
    console.log('Sync requested');
    const message: StopEvent = {
      type: EventType.Stop,
      payload: {
        type: 'reconnect',
      },
    };
    console.log('Outgoing action: ' + JSON.stringify(message));
    sendMessage(message);
  }

  return {
    nowPlayingTrack: state.nowPlayingTrack,
    queuedTracks: state.queuedTracks,
    isAlive: state.isAlive,
    deviceConnected: state.deviceConnected,
    addTrack,
    upvoteTrack,
    downvoteTrack,
    sync,
  };
};

export default useRoomState;
