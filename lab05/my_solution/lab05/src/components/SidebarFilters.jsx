import Nav from "react-bootstrap/Nav";

function SidebarFilters({ selectedFilter, setSelectedFilter }) {
  const filters = ["All", "Favorite", "Best Rated", "Seen Last Month", "Unseen"];

  return (
    <aside className="col-lg-3 d-none d-lg-block pt-3">
      <h6 className="fw-bold px-3 mb-2">Filters</h6>

      <Nav className="flex-column">
        {filters.map((filter) => {
          const isActive = selectedFilter === filter;

          return (
            <Nav.Link
              key={filter}
              href="#"
              onClick={(event) => {
                event.preventDefault();
                setSelectedFilter(filter);
              }}
              className={`px-3 py-2 ${
                isActive
                  ? "rounded bg-primary text-white"
                  : "text-dark"
              }`}
            >
              {filter}
            </Nav.Link>
          );
        })}
      </Nav>
    </aside>
  );
}

export default SidebarFilters;