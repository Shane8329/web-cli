import React from 'react';
import './SearchResultItem.css';

const SearchResultItem = ({ icon, name, number, testInfo }) => {
  return (
    <div className="search-result-item">
      <span className={`icon ${icon}`}>{icon}</span>
      <div className="details">
        <span className="name">{name}</span>
        <span className="number">{number}</span>
        <span className="test-info">{testInfo}</span>
      </div>
    </div>
  );
};

export default SearchResultItem;