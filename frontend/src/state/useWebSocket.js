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

    const connection = new W3CWebSocket(
      'ws://127.0.0.1:8000/ws/room/' + roomId + '/',
    );

    connection.onopen = () => {
      console.log('Websocket Connected');
      tracks = [];
      socket = connection;
      roomId = roomId;
      isOpen = true;
    };
    connection.onmessage = message => {
      console.log(message);
      const dataFromServer = JSON.parse(message.data);
      if (dataFromServer.type === 'joinevent') {
      } else if (dataFromServer.type === 'contentevent') {
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

  function contentChange({
    id,
    name,
    artists,
    album,
    isExplicit,
    imageSource,
  }) {
    const changedTrack = {
      id,
      name,
      artists,
      album,
      isExplicit,
      imageSource,
      votes: 0,
    };

    // send to server
    const dataToServer = { type: 'contentevent', message: changedTrack };
    socket.send(JSON.stringify(dataToServer));

    // update track list
    const index = tracks.find(track => track.id === id);
    if (typeof index === undefined) {
      tracks = [...tracks, changedTrack];
    } else {
      var newTracks = tracks;
      newTracks[index] = changedTrack;
      tracks = newTracks;
    }
  }

  function closeConnection() {
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
