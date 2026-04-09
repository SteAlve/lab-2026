import {Offcanvas, Nav} from 'react-bootstrap';

function MobileFilters({ show, onHide }) {
  const filters = ["All", "Favorites", "Best Rated", "Seen Last Month", "Unseen"];

  return (
    <Offcanvas show={show} onHide={onHide} id="filterOffcanvas">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Filters</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="p-2">
        <Nav className="flex-column">
          {filters.map((filter, index) => (
            <Nav.Link
              key={filter}
              href="#"
              className={`px-3 py-2 ${
                index === 0 ? "rounded bg-primary text-white" : "text-dark"
              }`}
            >
              {filter}
            </Nav.Link>
          ))}
        </Nav>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default MobileFilters;