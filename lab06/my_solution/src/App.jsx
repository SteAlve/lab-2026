/*
 * 01UDFOV Applicazioni Web I / 01TXYOV Web Applications I
 * Lab 6 - 2024
 */
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import { Film, INITIAL_FILMS } from "./films.mjs";

import dayjs from 'dayjs';

import { useState } from 'react';
import { Button, Collapse, Col, Container, Row } from 'react-bootstrap/';
import Filters from './components/Filters';
import Header from "./components/Header.jsx";
import FilmList from "./components/FilmList.jsx";
import FilmForm from "./components/FilmForm.jsx";

function App() {
    const [films, setFilms] = useState(INITIAL_FILMS);
    const [showForm, setShowForm] = useState(false);
    const [filmToEdit, setFilmToEdit] = useState(null);

    const filters = {
        'filter-all': { label: 'All', id: 'filter-all', filterFunction: () => true },
        'filter-favorite': { label: 'Favorites', id: 'filter-favorite', filterFunction: film => film.favorite },
        'filter-best': { label: 'Best Rated', id: 'filter-best', filterFunction: film => film.rating >= 5 },
        'filter-lastmonth': {
            label: 'Seen Last Month',
            id: 'filter-lastmonth',
            filterFunction: film => {
                if (!film?.watchDate) return false;
                const diff = film.watchDate.diff(dayjs(), 'month');
                return diff <= 0 && diff > -1;
            }
        },
        'filter-unseen': { label: 'Unseen', id: 'filter-unseen', filterFunction: film => !film?.watchDate }
    };

    const addFilm = (filmData) => {
        const newId = Math.max(...films.map(a => a.id)) + 1;
        const film = new Film(newId, filmData.title, filmData.favorite, filmData.watchDate, filmData.rating);
        setFilms(oldFilms => [...oldFilms, film]);
    };

    const updateFilm = (filmData) => {
        const film = new Film(filmToEdit.id, filmData.title, filmData.favorite, filmData.watchDate, filmData.rating);
        setFilms(oldFilms => oldFilms.map(f => f.id !== film.id ? f : film));
    };

    const handleFormSubmit = (filmData) => {
        if (filmToEdit === null) {
            addFilm(filmData);
        } else {
            updateFilm(filmData);
        }
        setShowForm(false);
        setFilmToEdit(null);
    };

    const handleEdit = (film) => {
        setFilmToEdit(film);
        setShowForm(true);
    };

    const [activeFilter, setActiveFilter] = useState('filter-all');
    const visibleFilms = films.filter(filters[activeFilter].filterFunction);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

    return (
        <div className="min-vh-100 d-flex flex-column">
            <Header isSidebarExpanded={isSidebarExpanded} setIsSidebarExpanded={setIsSidebarExpanded} />

            <Container fluid className="flex-grow-1 d-flex flex-column">
                <Row className="flex-grow-1">
                    <Collapse id="films-filters" in={isSidebarExpanded} className="col-md-3 bg-light d-md-block">
                        <div className="py-4">
                            <h5 className="mb-3">Filters</h5>
                            <Filters items={filters} selected={activeFilter} onSelect={setActiveFilter} />
                        </div>
                    </Collapse>
                    <Col md={9} className="pt-3">
                        <h1><span id="filter-title">{filters[activeFilter].label}</span> films</h1>
                        <FilmList films={visibleFilms} onEdit={handleEdit} />
                        {showForm && (
                            <FilmForm
                                filmToEdit={filmToEdit}
                                onSubmit={handleFormSubmit}
                                onCancel={() => { setShowForm(false); setFilmToEdit(null); }}
                            />
                        )}
                    </Col>
                </Row>
                {!showForm && (
                    <Button
                        variant="primary"
                        className="rounded-circle fixed-right-bottom"
                        onClick={() => { setFilmToEdit(null); setShowForm(true); }}
                    >
                        <i className="bi bi-plus"></i>
                    </Button>
                )}
            </Container>
        </div>
    );
}

export default App;
