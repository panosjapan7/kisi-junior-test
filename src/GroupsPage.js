import { useEffect, useState } from "react";
import "./styles.css";
import CreateGroup from "./components/CreateGroup";

import client from "./client";

export default function GroupsPage({ loginSecret }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For pagination
    const [groups, setGroups] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [groupsPerPage, setGroupsPerPage] = useState(10);
    const lastPage = groups.length / groupsPerPage;

    //Get current posts
    const indexOfLastPost = currentPage * groupsPerPage;
    const indexOfFirstPost = indexOfLastPost - groupsPerPage;
    const currentGroups = groups.slice(indexOfFirstPost, indexOfLastPost);
    const totalGroups = groups.length;
    let total = 0;

    const fetchGroups = async () => {
      const response = await fetch(
        "https://api.kisi.io/groups?" +
          new URLSearchParams({ offset: 0, limit: 100 }).toString(),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `KISI-LOGIN ${loginSecret}`
          },
          body: JSON.stringify()
        }
      )
        .then((response) => {
          if (response.ok) {
            console.log("response: ", response)
            return response.json();
          }
          throw response;
        })
        .then((data) => {
          setData(data);
          setGroups(data);
          console.log(data);
        })
        .catch((error) => {
          console.log("Error fetching data: ", error);
          setError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    //Page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalGroups / groupsPerPage); i++) {
      pageNumbers.push(i);
    }

    //Change page
    const paginate = (pageNumber) => {
      setCurrentPage(pageNumber);
    };

    //Go to next page
    const goToNextPage = (currentPageNumber) => {
      setCurrentPage(currentPageNumber + 1);
      // fetch current set of groups
    };

    //Go to previous page
    const goToPrevPage = (currentPageNumber) => {
      setCurrentPage(currentPageNumber - 1);
      // fetch current set of groups
    };
  // End of For pagination

  // Delete group
  const deleteGroup = (itemId) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      fetch(`https://api.kisi.io/groups/${itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `KISI-LOGIN ${loginSecret}`
        }
      }).then(() => {
        fetchGroups();
      });
    }
  };
  // End of Delete group

  // Search groups with debounce
    const [query, setQuery] = useState("");

    function debounce(callbackFunction, delay = 500) {
      let timeout;

      return (...args) => {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
          callbackFunction(...args);
        }, delay);
      };
    }

    const handleSearchInput = (e) => {
      updateSearchInput(e);
    };

    const updateSearchInput = debounce((text) => {
      setQuery(text);
      search(text);
    });

    const search = (query) => {
      if (query) {
        const searchResult = groups.filter((group) =>
          group.name.toLowerCase().includes(query.toLowerCase())
        );

        // console.log(searchResult);
        return searchResult;
      }
    };
  // End of Search groups with debounce



  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="m-4">
      <h4 className="mb-3">Groups</h4>

      {/* Search */}
      <div className="d-flex justify-content-between mb-3">
        <div className="col-9">
          <input
            type="search"
            name="search-form"
            id="search-form"
            className="form-control"
            placeholder="Search Group"
            onChange={(e) => handleSearchInput(e.target.value)}
          />
        </div>

        <CreateGroup loginSecret={loginSecret} fetchGroups={fetchGroups} />

      </div>

      {/* Groups */}
      <ul className="list-group">
        {data && !query
          ? currentGroups.map((item) => (
              <li
                key={item.id}
                className="list-group-item d-flex justify-content-between"
              >
                <div>{item.name}</div>
                <button
                  onClick={() => deleteGroup(item.id)}
                  className="btn btn-outline-danger"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </li>
            ))
          : search(query)?.map((item) => (
              <li
                key={item.id}
                className="list-group-item d-flex justify-content-between"
              >
                <div>{item.name}</div>
                <button
                  onClick={() => deleteGroup(item.id)}
                  className="btn btn-outline-danger"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </li>
            ))}
      </ul>

      {/* nav with pagination */}
      <nav className="mt-3" aria-label="Page navigation">
        <ul className="pagination">
          <li className="page-item">
            <button
              disabled={currentPage === 1}
              onClick={() => goToPrevPage(currentPage)}
              className="page-link"
            >
              Previous
            </button>
          </li>
          {pageNumbers.map((number) => (
            <li key={number} className="page-item">
              <div
                onClick={() => paginate(number)}
                className={`page-link ${
                  number === currentPage
                    ? "page-link current-page"
                    : "page-link"
                }`}
              >
                {number}
              </div>
            </li>
          ))}
          <li className="page-item">
            <button
              disabled={currentPage === Math.ceil(lastPage)}
              onClick={() => goToNextPage(currentPage)}
              className="page-link"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>

    </div>
  );
}
