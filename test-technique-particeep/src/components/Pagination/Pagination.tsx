import React, { useState } from "react";

interface PaginationProps {
  moviesPerPage: number;
  totalMovies: number;
  paginate: (pageNumber: number) => void;
  setMoviesPerPage: (moviesPerPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  moviesPerPage,
  totalMovies,
  paginate,
  setMoviesPerPage,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageNumbers: number[] = [];

  for (let i = 1; i <= Math.ceil(totalMovies / moviesPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      paginate(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < pageNumbers.length) {
      setCurrentPage(currentPage + 1);
      paginate(currentPage + 1);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const pageNumber = Number(event.target.value);
    setCurrentPage(pageNumber);
    paginate(pageNumber);
  };

  const handleMoviesPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setMoviesPerPage(Number(event.target.value));
    setCurrentPage(1);
    paginate(1);
  };

  return (
    <nav className="pagination-container">
      <ul className="pagination">
        <li className="page-item">
          <button onClick={handlePrevClick} className="page-link">
            Précedent
          </button>
        </li>
        <li className="page-item">
          <select
            value={currentPage}
            onChange={handlePageChange}
            className="page-select"
          >
            {pageNumbers.map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>
        </li>
        <li className="page-item">
          <button onClick={handleNextClick} className="page-link">
            Suivant
          </button>
        </li>
        <li className="page-item">
          <select
            value={moviesPerPage}
            onChange={handleMoviesPerPageChange}
            className="page-select"
          >
            {[4, 8, 12].map((size) => (
              <option key={size} value={size}>
                {size} par page
              </option>
            ))}
          </select>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
