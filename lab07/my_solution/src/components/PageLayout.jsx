import { Row, Col, Collapse } from "react-bootstrap";
import { Outlet, Link, useParams, useLocation } from "react-router";

import Filters from "./Filters.jsx";
import FilmForm from "./FilmForm.jsx";
import FilmList from "./FilmList.jsx";

export function FilmLibraryLayout({ isSidebarExpanded, filters }) {
    return (
        <Row className="flex-grow-1">
            <Collapse id="films-filters" in={isSidebarExpanded} className="col-md-3 bg-light d-md-block">
                <div className="py-4">
                    <h5 className="mb-3">Filters</h5>
                    <Filters items={filters} />
                </div>
            </Collapse>
            <Col md={9} className="pt-3">
                <Outlet />
            </Col>
        </Row>
    );
}

export function FilmListLayout({ films, filters, updateFilm, deleteFilm }) {
    const { filterLabel } = useParams();
    const filterName = filterLabel && filters[filterLabel] ? filters[filterLabel].label : 'All';
    const filteredFilms = (filterLabel && filterLabel in filters)
        ? films.filter(filters[filterLabel].filterFunction)
        : films;

    const location = useLocation();

    return (
        <>
            <Row>
                <Col>
                    <h1><span id="filter-title">{filterName}</span> films</h1>
                </Col>
            </Row>
            <FilmList films={filteredFilms} updateFilm={updateFilm} deleteFilm={deleteFilm} />
            <Row>
                <Col>
                    <Link
                        className="btn btn-primary rounded-circle fixed-right-bottom"
                        to="/add"
                        state={{ nextpage: location.pathname }}
                    >
                        <i className="bi bi-plus" />
                    </Link>
                </Col>
            </Row>
        </>
    );
}

export function EditLayout({ films, updateFilm }) {
    const { filmId } = useParams();
    const film = films && films.find(f => f.id === Number(filmId));

    return !film ? (
        <Row>
            <Col>
                <p className="lead mt-3">Errore: film non trovato!</p>
                <Link className="btn btn-primary" to="/" >Torna alla home</Link>
            </Col>
        </Row>
    ) : (
        <Row>
            <Col>
                <FilmForm film={film} editFilm={updateFilm} />
            </Col>
        </Row>
    );
}

export function NotFoundLayout() {
    return (
        <>
            <Row><Col><h2>Errore: pagina non trovata!</h2></Col></Row>
            <Row><Col>
                <Link to="/" className="btn btn-primary mt-3">Torna alla home</Link>
            </Col></Row>
        </>
    );
}
