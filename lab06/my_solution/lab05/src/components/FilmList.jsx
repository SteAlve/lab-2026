import { ListGroup } from "react-bootstrap";
import FilmListItem from "./FilmListItem";

function FilmList({ films }) {
  return (
    <ListGroup variant="flush" as="ul">
      {films.map((film) => (
        <FilmListItem key={film.id} film={film} />
      ))}
    </ListGroup>
  );
}

export default FilmList;