import Button from "react-bootstrap/Button";
import dayjs from "dayjs";
import RatingStars from "./RatingStars";

function FilmListItem({ film }) {
  const formattedDate = film.watchDate
    ? dayjs(film.watchDate).format("MMMM D, YYYY")
    : null;

  return (
    <li className="list-group-item d-flex align-items-center gap-2 py-3">
      <Button
        variant="link"
        className={`p-0 ${film.favorite ? "text-danger" : "text-secondary"}`}
        aria-label={film.favorite ? "Remove from favorites" : "Add to favorites"}
      >
        <i className={`bi ${film.favorite ? "bi-heart-fill" : "bi-heart"}`}></i>
      </Button>

      <span className="flex-grow-1">{film.title}</span>

      {formattedDate && <span className="text-muted me-2">{formattedDate}</span>}

      <RatingStars rating={film.rating} />

      <Button variant="link" className="p-0 text-secondary" aria-label="Edit">
        <i className="bi bi-pencil"></i>
      </Button>

      <Button variant="link" className="p-0 text-secondary" aria-label="Delete">
        <i className="bi bi-trash"></i>
      </Button>
    </li>
  );
}

export default FilmListItem;