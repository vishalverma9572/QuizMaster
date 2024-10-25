import React, { useState } from 'react';

const UserScoresTable = ({ users }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const usersPerPage = 10;

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset pagination to first page when searching
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleClick = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

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

  const renderPagination = () => {
    const pageNumbers = getPageNumbers();

    return (
      <div className="mt-4 text-center">
        {pageNumbers.map((number, index) => (
          <button
            key={index}
            className={`mx-1 px-3 py-2 text-white ${
              number === currentPage ? 'bg-blue-600' : 'bg-blue-900'
            } rounded hover:bg-blue-700 transition`}
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
    <div className="border border-gray-300 rounded-lg bg-gray-50 p-5 mt-5">
      <h2 className="mb-4 font-serif text-lg font-semibold text-blue-900 border-b-2 border-blue-900">User Scores</h2>
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Search by username"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full max-w-xs p-2 text-base border border-blue-900 rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
        />
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-2 py-3 bg-blue-900 text-white text-center">Rank</th>
            <th className="border px-2 py-3 bg-blue-900 text-white text-center">Username</th>
            <th className="border px-2 py-3 bg-blue-900 text-white text-center">Score</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr key={user.username} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
              <td className="border px-2 py-2">{indexOfFirstUser + index + 1}</td>
              <td className="border px-2 py-2">{user.username}</td>
              <td className="border px-2 py-2">{user.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {renderPagination()}
    </div>
  );
};

export default UserScoresTable;