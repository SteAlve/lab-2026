import dayjs from 'dayjs';
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router';
import { Film } from '../films.mjs';

function FilmForm({ film, addFilm, editFilm }) {
    const [title, setTitle] = useState(film ? film.title : '');
    const [favorite, setFavorite] = useState(film ? film.favorite : false);
    const [watchDate, setWatchDate] = useState(
        film?.watchDate ? dayjs(film.watchDate).format('YYYY-MM-DD') : ''
    );
    const [rating, setRating] = useState(film?.rating ?? 0);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const location = useLocation();
    const nextpage = location.state?.nextpage || '/';

    const validate = () => {
        const errs = {};
        if (!title.trim()) errs.title = 'Il titolo è obbligatorio';
        if (watchDate && dayjs(watchDate).isAfter(dayjs())) errs.watchDate = 'La data non può essere nel futuro';
        if (rating < 0 || rating > 5) errs.rating = 'Il voto deve essere tra 0 e 5';
        return errs;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        const newFilm = new Film(
            film ? film.id : undefined,
            title.trim(),
            favorite,
            watchDate || null,
            Number(rating)
        );

        if (film) {
            editFilm(newFilm);
        } else {
            addFilm(newFilm);
        }
        navigate('/');
    };

    return (
        <Form onSubmit={handleSubmit} className="block-example border border-primary rounded mt-4 mb-0 px-5 py-4">
            <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    isInvalid={!!errors.title}
                />
                <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Check
                    type="checkbox"
                    label="Favorite"
                    checked={favorite}
                    onChange={e => setFavorite(e.target.checked)}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Watch Date</Form.Label>
                <Form.Control
                    type="date"
                    value={watchDate}
                    onChange={e => setWatchDate(e.target.value)}
                    isInvalid={!!errors.watchDate}
                />
                <Form.Control.Feedback type="invalid">{errors.watchDate}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Rate (0–5)</Form.Label>
                <Form.Control
                    type="number"
                    min={0}
                    max={5}
                    step={1}
                    value={rating}
                    onChange={e => setRating(e.target.value === '' ? 0 : parseInt(e.target.value))}
                    isInvalid={!!errors.rating}
                />
                <Form.Control.Feedback type="invalid">{errors.rating}</Form.Control.Feedback>
            </Form.Group>

            {Object.keys(errors).length > 0 && (
                <div className="mb-3">
                    {Object.values(errors).map((err, i) => (
                        <p key={i} className="text-danger mb-1"><b>Errore {i + 1}:</b> {err}</p>
                    ))}
                </div>
            )}

            <Button className="me-2" variant="primary" type="submit">Save</Button>
            <Link className="btn btn-danger" to={nextpage}>Cancel</Link>
        </Form>
    );
}

export default FilmForm;
