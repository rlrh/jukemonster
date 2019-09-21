import React, { useContext, createContext } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

const WEB_SOCKET_URL = 'ws://127.0.0.1:8000/ws/room/';

const SocketContext = createContext();

export const useWebSocket = () => useContext(SocketContext);

export function SocketProvider({ children }) {
  const webSocket = UseProvideSocket();
  return (
    <SocketContext.Provider value={webSocket}>
      {children}
    </SocketContext.Provider>
  );
}
function UseProvideSocket() {
  var isOpen = false; // whether an active connection is present
  var roomId = null; // room id of active connection
  var socket = null; // socket object
  var tracks = []; // tracks in room's queue
  var nowPlaying = null; // currently playing track

  // Public Functions
  function openConnection(roomId) {
    if (isOpen) throw new Error(`Connection to ${roomId} already active!`);

    // open connection
    const connection = new W3CWebSocket(WEB_SOCKET_URL + roomId + '/');

    // specify callbacks
    connection.onopen = () => {
      console.log('Websocket connected');
      initState(roomId, connection);
    };

    connection.onmessage = message => {
      console.log(message);
      const dataFromServer = JSON.parse(message.data);
      if (dataFromServer.type === 'user_event')
        handleUserEvent(dataFromServer.payload);
      else if (dataFromServer.type === 'queue_event')
        handleQueueEvent(dataFromServer.payload);
      else if (dataFromServer.type == 'playback_event')
        handlePlaybackEvent(dataFromServer.payload);
    };

    connection.onclose = () => {
      console.log('Websocket disconnected');
    };
  }

  function closeConnection() {
    if (!isOpen) throw new Error(`No active connection`);

    socket.close();
    isOpen = false;
  }

  function sendQueueEvent(content) {
    if (!isOpen) throw new Error(`No active connection`);

    var changedTrack = content;
    if (!changedTrack.has('votes')) {
      changedTrack.votes = 0;
    }

    // send to server
    const dataToServer = { type: 'queue_event', payload: changedTrack };
    socket.send(JSON.stringify(dataToServer));

    // update track list
    const index = tracks.find(track => track.id === changedTrack.id);
    if (typeof index === undefined) {
      tracks = [...tracks, changedTrack];
    } else {
      var newTracks = tracks;
      newTracks[index] = changedTrack;
      tracks = newTracks;
    }
  }

  // Private Functions
  function initState(roomId, connection) {
    tracks = [];
    nowPlaying = null;
    socket = connection;
    roomId = roomId;
    isOpen = true;
  }

  function handleUserEvent(payload) {
    console.log('user_event received');
  }

  function handleQueueEvent(payload) {
    console.log('queue_eventreceived');
    const changedTrack = payload;
    const index = tracks.find(track => track.id === changedTrack.id);
    if (typeof index === undefined) {
      tracks = [...tracks, changedTrack];
    } else {
      var newTracks = tracks;
      newTracks[index] = changedTrack;
      tracks = newTracks;
    }
  }

  function handlePlaybackEvent(payload) {
    console.log('playback_event received');
    const playingTrack = payload;

    // remove playingTrack from queue, if it exists
    tracks = tracks.filter(track => track.id === playingTrack.id);

    nowPlaying = playingTrack;
  }

  return {
    isOpen,
    room: roomId,
    tracks,
    nowPlaying,
    openConnection,
    sendQueueEvent,
    closeConnection,
  };
}
