import { useState } from "react";
import dayjs from "dayjs";
import {Container, Row, Col} from "react-bootstrap";

import Header from "./components/Header";
import SidebarFilters from "./components/SidebarFilters";
import FilmList from "./components/FilmList";
import filmsData from "./data/films";
import AddFilmButton from "./components/AddFilmButton";

function App() {
  const [films] = useState(filmsData);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filterTitles = {
    All: "All films",
    Favorite: "Favorite films",
    "Best Rated": "Best rated films",
    "Seen Last Month": "Seen last month",
    Unseen: "Unseen films",
  };

  const getFilteredFilms = () => {
    switch (selectedFilter) {
      case "Favorite":
        return films.filter((film) => film.favorite);

      case "Best Rated":
        return films.filter((film) => film.rating === 5);

      case "Seen Last Month":
        return films.filter((film) => {
          if (!film.watchDate) return false;

          const watchDate = dayjs(film.watchDate);
          const today = dayjs();
          const thirtyDaysAgo = dayjs().subtract(30, "day");

          return watchDate.isValid() &&
            watchDate.isBefore(today.add(1, "day")) &&
            watchDate.isAfter(thirtyDaysAgo);
        });

      case "Unseen":
        return films.filter((film) => !film.watchDate);

      case "All":
      default:
        return films;
    }
  };

  const filteredFilms = getFilteredFilms();

  return (
    <>
      <Header />

      <Container fluid>
        <Row>
          <SidebarFilters
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
          />

          <Col className="pt-3 pb-5">
            <h2 className="mb-3">{filterTitles[selectedFilter]}</h2>
            <FilmList films={filteredFilms} />
          </Col>
        </Row>
      </Container>
      <AddFilmButton/>
    </>
  );
}

export default App;