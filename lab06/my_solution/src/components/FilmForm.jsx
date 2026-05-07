import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

function FilmForm({ filmToEdit, onSubmit, onCancel }) {
    const [title, setTitle] = useState(filmToEdit ? filmToEdit.title : '');
    const [favorite, setFavorite] = useState(filmToEdit ? filmToEdit.favorite : false);
    const [watchDate, setWatchDate] = useState(
        filmToEdit?.watchDate ? filmToEdit.watchDate.format('YYYY-MM-DD') : ''
    );
    const [rating, setRating] = useState(filmToEdit?.rating ?? 0);
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!title.trim()) newErrors.title = 'Title is required';
        if (rating < 0 || rating > 5) newErrors.rating = 'Rating must be between 0 and 5';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit({
            title: title.trim(),
            favorite,
            watchDate: watchDate || null,
            rating: Number(rating),
        });
    };

    return (
        <Form onSubmit={handleSubmit} className="p-3 border rounded mb-3">
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
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Rating (0–5)</Form.Label>
                <Form.Control
                    type="number"
                    min={0}
                    max={5}
                    value={rating}
                    onChange={e => setRating(e.target.value)}
                    isInvalid={!!errors.rating}
                />
                <Form.Control.Feedback type="invalid">{errors.rating}</Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" className="me-2">Save</Button>
            <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        </Form>
    );
}

export default FilmForm;
