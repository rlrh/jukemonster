import React, { useContext, createContext } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

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
  var tracks = []; // tracks

  function openConnection(roomId) {
    if (isOpen) throw new Error(`Connection to ${roomId} already active!`);

    // open connection
    const connection = new W3CWebSocket(
      'ws://127.0.0.1:8000/ws/room/' + roomId + '/',
    );

    // specify callbacks
    connection.onopen = () => {
      console.log('Websocket connected');
      tracks = [];
      socket = connection;
      roomId = roomId;
      isOpen = true;
    };

    connection.onmessage = message => {
      console.log(message);
      const dataFromServer = JSON.parse(message.data);
      if (dataFromServer.type === 'joinevent') {
        console.log('joinevent message received');
      } else if (dataFromServer.type === 'contentevent') {
        console.log('contentevent message received');
        const changedTrack = dataFromServer.message;
        const index = tracks.find(track => track.id === changedTrack.id);
        if (typeof index === undefined) {
          tracks = [...tracks, changedTrack];
        } else {
          var newTracks = tracks;
          newTracks[index] = changedTrack;
          tracks = newTracks;
        }
      }
    };

    connection.onclose = () => {
      console.log('Websocket disconnected');
    };
  }

  function contentChange(content) {
    if (!isOpen) throw new Error(`No active connection`);

    var changedTrack = content;
    if (!changedTrack.has('votes')) {
      changedTrack.votes = 0;
    }

    // send to server
    const dataToServer = { type: 'contentevent', message: changedTrack };
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

  function closeConnection() {
    if (!isOpen) throw new Error(`No active connection`);

    socket.close();
    isOpen = false;
  }

  return {
    isOpen,
    room: roomId,
    tracks,
    openConnection,
    contentChange,
    closeConnection,
  };
}
