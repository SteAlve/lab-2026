import Offcanvas from "react-bootstrap/Offcanvas";
import Nav from "react-bootstrap/Nav";

function MobileFilters({ show, onHide, selectedFilter, setSelectedFilter }) {
  const filters = ["All", "Favorite", "Best Rated", "Seen Last Month", "Unseen"];

  return (
    <Offcanvas show={show} onHide={onHide} className="d-lg-none">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Filters</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="p-2">
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
                  onHide();
                }}
                className={`px-3 py-2 ${
                  isActive ? "rounded bg-primary text-white" : "text-dark"
                }`}
              >
                {filter}
              </Nav.Link>
            );
          })}
        </Nav>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default MobileFilters;