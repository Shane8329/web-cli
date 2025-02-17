import React from 'react';
import SearchResultItem from './SearchResultItem';

const searchResults = [
  { icon: 'V', name: 'Vikey', number: '67782889', testInfo: 'Eamon test / MEIYIMI' },
  { icon: 'T', name: 'Thielke Can', number: '67782889', testInfo: 'Test1 / --' },
  { icon: 'V', name: 'Vikey', number: '67782889', testInfo: 'Eamon test / MEIYIMI' },
  { icon: 'U', name: 'UDIDIO', number: '67782889', testInfo: 'CBA test / esajil' },
];

const SearchResults = () => {
  return (
    <div className="search-results">
      {searchResults.map((result, index) => (
        <SearchResultItem
          key={index}
          icon={result.icon}
          name={result.name}
          number={result.number}
          testInfo={result.testInfo}
        />
      ))}
    </div>
  );
};

export default SearchResults;