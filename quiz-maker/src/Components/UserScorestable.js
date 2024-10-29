import React, { useState } from 'react';
import './UserScorestable.css';

const UserScoresTable = ({ users }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const usersPerPage = 10;

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset pagination to first page when searching
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleClick = (page) => {
    setCurrentPage(page);
  };

  // Logic to calculate which users to display for current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Logic to generate pagination buttons
  const getPageNumbers = () => {
    let pageNumbers = [];

    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pageNumbers = [1, 2, 3, 4, 5, '...', totalPages];
      } else if (currentPage > totalPages - 4) {
        pageNumbers = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pageNumbers = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
      }
    }

    return pageNumbers;
  };

  // Render pagination buttons
  const renderPagination = () => {
    const pageNumbers = getPageNumbers();

    return (
      <div className="pagination">
        {pageNumbers.map((number, index) => (
          <button
            key={index}
            className={number === currentPage ? 'active' : ''}
            onClick={() => {
              if (typeof number === 'number') {
                handleClick(number);
              }
            }}
          >
            {number}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="user-scores-table">
      <h2>User Scores</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by username"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr key={user.username}>
              <td>{indexOfFirstUser + index + 1}</td>
              <td>{user.username}</td>
              <td>{user.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {renderPagination()}
    </div>
  );
};

export default UserScoresTable;
