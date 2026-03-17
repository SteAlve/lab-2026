import dayjs from 'dayjs'
import FilmLibrary from './FilmLibrary.js';
import Film from './Film.js';

const fl = new FilmLibrary();

try {
    const newFilm = new Film(
        null,
        "Interstellar",
        dayjs("2024-03-01"),
        true,
        5,
        1
    );

    const id = await fl.addFilm(newFilm);
    console.log("Added film with id:", id);
} catch (err) {
    console.log("Add film: failure");
    console.error(err);
}

try {
    const deletedRows = await fl.deleteFilm(1);
    if (deletedRows > 0)
        console.log("Delete film: success");
    else
        console.log("Delete film: failure - film not found");
} catch (err) {
    console.log("Delete film: failure");
    console.error(err);
}

try {
    await fl.deleteAllWatchDates();
    console.log("Delete all watch dates: success");
} catch (err) {
    console.log("Delete all watch dates: failure");
    console.error(err);
}

const films = await fl.getFilms();
console.log("\nUpdated films:");
console.log(fl.toString(films));
const allFilms = await fl.getFilms();
console.log("All films:");
console.log(fl.toString(allFilms));

const favoriteFilms = await fl.getFavorites();
console.log("Favorite films:");
console.log(fl.toString(favoriteFilms));

const filmsBeforeDate = await fl.getBeforeDate("2026-03-17");
console.log("Films watched before 2026-03-17:");
console.log(fl.toString(filmsBeforeDate));

const filmsWithString = await fl.getFilmsByString("Star");
console.log('Films containing "Star" in the title:');
console.log(fl.toString(filmsWithString));
