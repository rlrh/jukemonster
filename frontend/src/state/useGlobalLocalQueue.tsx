import React, { useState, useContext, createContext } from 'react';

const QueueContext = createContext();

export const useQueue = () => useContext(QueueContext);

export function QueueProvider({ children }) {
  const queue = useProvideQueue();
  return (
    <QueueContext.Provider value={queue}>{children}</QueueContext.Provider>
  );
}

function useProvideQueue() {
  const [tracks, setTracks] = useState([]);

  function addTrack({ id, name, artists, album, isExplicit, imageSource }) {
    if (tracks.find(track => track.id === id))
      throw new Error(`${name} already in queue!`);
    const newTracks = [
      ...tracks,
      { id, name, artists, album, isExplicit, imageSource, votes: 0 },
    ];
    setTracks(newTracks);
  }

  function upvote(id) {
    const newTracks = tracks.map(track =>
      track.id === id ? { ...track, votes: track.votes + 1 } : track,
    );
    setTracks(newTracks);
  }

  function downvote(id) {
    const newTracks = tracks.map(track =>
      track.id === id ? { ...track, votes: track.votes - 1 } : track,
    );
    setTracks(newTracks);
  }

  return {
    tracks,
    addTrack,
    upvote,
    downvote,
  };
}
