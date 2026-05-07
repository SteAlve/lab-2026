import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import { Film, INITIAL_FILMS } from "./films.mjs";

import dayjs from 'dayjs';

import { useState } from 'react';
import { Container } from 'react-bootstrap/';
import { Routes, Route } from 'react-router';

import Header from "./components/Header.jsx";
import FilmForm from './components/FilmForm.jsx';
import { FilmLibraryLayout, FilmListLayout, EditLayout, NotFoundLayout } from './components/PageLayout.jsx';

function App() {
    const filters = {
        'filter-all': { label: 'All', url: '/', filterFunction: () => true },
        'filter-favorite': { label: 'Favorites', url: '/filters/filter-favorite', filterFunction: film => film.favorite },
        'filter-best': { label: 'Best Rated', url: '/filters/filter-best', filterFunction: film => film.rating >= 5 },
        'filter-lastmonth': {
            label: 'Seen Last Month',
            url: '/filters/filter-lastmonth',
            filterFunction: film => {
                if (!film?.watchDate) return false;
                const diff = film.watchDate.diff(dayjs(), 'month');
                return diff <= 0 && diff > -1;
            }
        },
        'filter-unseen': { label: 'Unseen', url: '/filters/filter-unseen', filterFunction: film => !film?.watchDate }
    };

    const [films, setFilms] = useState(INITIAL_FILMS);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

    const addFilm = (filmData) => {
        const newId = Math.max(...films.map(f => f.id)) + 1;
        const film = new Film(newId, filmData.title, filmData.favorite, filmData.watchDate, filmData.rating);
        setFilms(old => [...old, film]);
    };

    const updateFilm = (filmData) => {
        setFilms(old => old.map(f => f.id !== filmData.id ? f : filmData));
    };

    const deleteFilm = (filmId) => {
        setFilms(old => old.filter(f => f.id !== filmId));
    };

    return (
        <div className="min-vh-100 d-flex flex-column">
            <Header isSidebarExpanded={isSidebarExpanded} setIsSidebarExpanded={setIsSidebarExpanded} />
            <Container fluid className="flex-grow-1 d-flex flex-column">
                <Routes>
                    <Route path="/" element={<FilmLibraryLayout isSidebarExpanded={isSidebarExpanded} filters={filters} />}>
                        <Route path="*" element={<NotFoundLayout />} />
                        <Route index element={<FilmListLayout films={films} filters={filters} updateFilm={updateFilm} deleteFilm={deleteFilm} />} />
                        <Route path="filters/:filterLabel" element={<FilmListLayout films={films} filters={filters} updateFilm={updateFilm} deleteFilm={deleteFilm} />} />
                    </Route>
                    <Route path="add" element={<FilmForm addFilm={addFilm} />} />
                    <Route path="edit/:filmId" element={<EditLayout films={films} updateFilm={updateFilm} />} />
                </Routes>
            </Container>
        </div>
    );
}

export default App;
