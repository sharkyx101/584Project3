import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [businesses, setBusinesses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPageOptions = [25, 50, 100];
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [filters, setFilters] = useState({
    categories: '',
    city: '',
    state: '',
  });

  const [selectedBusiness, setSelectedBusiness] = useState(null);

  useEffect(() => {
    fetchData();
  }, [page, itemsPerPage, filters]);

  const fetchData = () => {
    axios
      .get(`http://localhost:5000/api/business?page=${page}&limit=${itemsPerPage}`, {
        params: { ...filters },
      })
      .then((response) => {
        setBusinesses(response.data.businesses);
        setTotalPages(response.data.total_pages);
      })
      .catch((error) => console.error(error));
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setPage(1);
  };

  const handleShowAll = () => {
    setFilters({
      categories: '',
      city: '',
      state: '',
    });
    fetchData();
  };

  const handleBusinessClick = (business) => {
    setSelectedBusiness(business);
  };

  return (
    <div>
      <h1>Businesses</h1>

      <div>
        <label>Results per Page: </label>
        <select value={itemsPerPage} onChange={(e) => handleItemsPerPageChange(e.target.value)}>
          {itemsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Categories: </label>
        <input
          type="text"
          value={filters.categories}
          onChange={(e) => {
            setFilters({ ...filters, categories: e.target.value });
            fetchData();
          }}
        />
      </div>

      <div>
        <label>City: </label>
        <input
          type="text"
          value={filters.city}
          onChange={(e) => {
            setFilters({ ...filters, city: e.target.value });
            fetchData();
          }}
        />
      </div>

      <div>
        <label>State: </label>
        <input
          type="text"
          value={filters.state}
          onChange={(e) => {
            setFilters({ ...filters, state: e.target.value });
            fetchData();
          }}
        />
      </div>

      <div>
        <button onClick={handleShowAll}>Show All</button>
      </div>

      {selectedBusiness && (
        <div>
          <h2>Selected Business</h2>
          <p>Business ID: {selectedBusiness.business_id}</p>
          <p>Name: {selectedBusiness.name}</p>
          <p>Address: {selectedBusiness.address}</p>
          <p>City: {selectedBusiness.city}</p>
          <p>State: {selectedBusiness.state}</p>
          <p>Postal Code: {selectedBusiness.postal_code}</p>
          <p>Stars: {selectedBusiness.stars}</p>
          <p>Review Count: {selectedBusiness.review_count}</p>
          {/* Remove Is Open display */}
          <p>Categories:</p>
          <ul>
            {selectedBusiness.categories.map((category) => (
              <li key={category}>{category}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
          Previous Page
        </button>
        <span>
          {' '}
          Page {page} of {totalPages}{' '}
        </span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
          Next Page
        </button>
      </div>

      <ul>
        {businesses.map((business) => (
          <li key={business.business_id} onClick={() => handleBusinessClick(business)}>
            {business.name} - {business.city}, {business.state}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
