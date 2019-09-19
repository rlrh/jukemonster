import React, { Fragment, useState } from 'react';
import { IonSearchbar } from '@ionic/react';
import { useQueue } from '../state/useGlobalLocalQueue';
import SearchResults from './SearchResults';

const Search = () => {
  const { addTrack } = useQueue();

  const [query, setQuery] = useState('');
  const handleChange = event => setQuery(event.target.value);

  return (
    <Fragment>
      <IonSearchbar value={query} onIonChange={handleChange}></IonSearchbar>
      {query ? (
        <SearchResults query={query} onSearchResultClick={addTrack} />
      ) : null}
    </Fragment>
  );
};
export default Search;
