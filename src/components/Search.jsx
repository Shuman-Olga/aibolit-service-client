import React from 'react';

function Search(props) {
  return props.searchResults.length > 0 ? (
    <div id="search" className="search-wrap">
      <ul>
        {props.searchResults.map((item) => (
          <li key={item.id} onClick={() => props.handleShowEdit(item.id)}>
            {item.lastname} {item.firstname} {item.patronomic} т. {item.phone}
          </li>
        ))}
      </ul>
    </div>
  ) : null;
}

export default Search;
