import React, { Fragment, useState } from 'react';
import { IonSearchbar, IonItem, IonLabel, IonToolbar } from '@ionic/react';
import SearchResults from './SearchResults';

const Search = ({ onSearchResultClick }) => {
  const [query, setQuery] = useState('');
  const handleChange = event => setQuery(event.target.value);

  return (
    <Fragment>
      <IonToolbar>
        <IonSearchbar value={query} onIonChange={handleChange}></IonSearchbar>
      </IonToolbar>
      {query ? (
        <SearchResults
          query={query}
          onSearchResultClick={onSearchResultClick}
        />
      ) : (
        <IonItem>
          <IonLabel>
            <h2>No search results to display.</h2>
          </IonLabel>
        </IonItem>
      )}
    </Fragment>
  );
};
export default Search;
