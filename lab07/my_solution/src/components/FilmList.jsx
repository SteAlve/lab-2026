import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { Col, Row, ListGroup, ListGroupItem } from 'react-bootstrap/';
import { Link, useLocation } from "react-router";

function FilmList({ films, updateFilm, deleteFilm }) {
    return (
        <ListGroup id="films-list" variant="flush">
            {films.map(film => (
                <FilmInList key={film.id} filmData={film} updateFilm={updateFilm} deleteFilm={deleteFilm} />
            ))}
        </ListGroup>
    );
}

FilmList.propTypes = {
    films: PropTypes.array.isRequired,
    updateFilm: PropTypes.func.isRequired,
    deleteFilm: PropTypes.func.isRequired,
};

function FilmInList({ filmData, updateFilm, deleteFilm }) {
    return (
        <ListGroupItem>
            <Row className="gy-2">
                <Col xs={6} xl={3} className="favorite-title d-flex gap-2 align-items-center">
                    {filmData.title}
                    <div className="d-xl-none actions">
                        <FilmIcons filmData={filmData} deleteFilm={deleteFilm} />
                    </div>
                </Col>
                <Col xs={6} xl={3} className="text-end text-xl-center">
                    <span className="custom-control custom-checkbox">
                        <input
                            type="checkbox"
                            className="custom-control-input"
                            checked={filmData.favorite}
                            onChange={e => updateFilm({ ...filmData, favorite: e.target.checked })}
                        />
                        <label className="custom-control-label">Favorite</label>
                    </span>
                </Col>
                <Col xs={4} xl={3} className="text-xl-center">
                    {filmData.watchDate ? dayjs(filmData.watchDate).format('MMMM D, YYYY') : ''}
                </Col>
                <Col xs={8} xl={3} className="actions-container text-end">
                    <div className="rating">
                        <Rating
                            rating={filmData.rating}
                            maxStars={5}
                            updateRating={newRating => updateFilm({ ...filmData, rating: newRating })}
                        />
                    </div>
                    <div className="d-none d-xl-flex actions">
                        <FilmIcons filmData={filmData} deleteFilm={deleteFilm} />
                    </div>
                </Col>
            </Row>
        </ListGroupItem>
    );
}

FilmInList.propTypes = {
    filmData: PropTypes.object.isRequired,
    updateFilm: PropTypes.func.isRequired,
    deleteFilm: PropTypes.func.isRequired,
};

function FilmIcons({ filmData, deleteFilm }) {
    const location = useLocation();
    return (
        <>
            <Link className="bi bi-pencil" to={`/edit/${filmData.id}`} state={{ nextpage: location.pathname }} />
            <i className="bi bi-trash" style={{ cursor: 'pointer' }} onClick={() => deleteFilm(filmData.id)} />
        </>
    );
}

FilmIcons.propTypes = {
    filmData: PropTypes.object.isRequired,
    deleteFilm: PropTypes.func.isRequired,
};

function Rating({ maxStars, rating, updateRating }) {
    return [...Array(maxStars)].map((_, index) => (
        <i
            key={index}
            className={index < rating ? "bi bi-star-fill" : "bi bi-star"}
            style={{ cursor: 'pointer' }}
            onClick={() => updateRating(index + 1)}
        />
    ));
}

Rating.propTypes = {
    maxStars: PropTypes.number.isRequired,
    rating: PropTypes.number,
    updateRating: PropTypes.func.isRequired,
};

export default FilmList;
