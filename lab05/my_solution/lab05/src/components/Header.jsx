import { Navbar, Container, Form, Button } from "react-bootstrap";

function Header() {
  return (
    <Navbar bg="primary" variant="dark" className="py-2">
      <Container fluid className="gap-2">
        <Button
          variant="link"
          className="text-white p-1 d-lg-none"
          data-bs-toggle="offcanvas"
          data-bs-target="#filterOffcanvas"
          aria-label="Toggle filters"
        >
          <i className="bi bi-list fs-4"></i>
        </Button>

        <Navbar.Brand href="#" className="flex-grow-1 text-center d-lg-none">
          <i className="bi bi-film"></i> Film Library
        </Navbar.Brand>

        <Navbar.Brand href="#" className="d-none d-lg-flex me-0">
          <i className="bi bi-film"></i> Film Library
        </Navbar.Brand>

        <Form className="flex-grow-1 d-none d-lg-flex mx-2">
          <Form.Control type="search" placeholder="Search..." />
        </Form>

        <Button variant="link" className="text-white p-1" aria-label="User profile">
          <i className="bi bi-person-circle fs-4"></i>
        </Button>
      </Container>
    </Navbar>
  );
}

export default Header;