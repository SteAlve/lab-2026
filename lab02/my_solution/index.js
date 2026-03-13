import sqlite from 'sqlite3'
import dayjs from 'dayjs'

const db = new sqlite.Database("films.db", (err) => {
    if(err)
        console.log("Error in opening database");
    else
        console.log("Database connected successfully");
});


function Film(id, title, watch_date = null, favorite = false, rating = null, user_id = 1) {
    this.id = id;
    this.title = title;
    this.favorite = favorite;
    this.watch_date = watch_date ? dayjs(watch_date) : null;
    this.rating = rating;
    this.user_id = user_id;

    this.toString = () => {
        return `Id: ${this.id}, Title: ${this.title}, Favorite: ${this.favorite}, Watch date: ${
            this.watch_date ? this.watch_date.format("YYYY-MM-DD") : "Non visto"
        }, Rating: ${this.rating}, User id: ${this.user_id}`;
    };
}


function FilmLibrary() {

    this.getFilms = async () => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films";

            db.all(sql, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const films = rows.map(row =>
                        new Film(
                            row.id,
                            row.title,
                            row.watchDate ? dayjs(row.watchDate) : null,
                            row.isFavorite,
                            row.rating,
                            row.user_id
                        )
                    );
                    resolve(films);
                }
            });
        });
    };

    this.getFavorites = async () => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films WHERE isFavorite = 1";

            db.all(sql, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const films = rows.map(row =>
                        new Film(
                            row.id,
                            row.title,
                            row.watchDate ? dayjs(row.watchDate) : null,
                            row.isFavorite,
                            row.rating,
                            row.user_id
                        )
                    );
                    resolve(films);
                }
            });
        });
    };

    this.getBeforeDate = async (date) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films WHERE watchDate < ?";

            db.all(sql, [date], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const films = rows.map(row =>
                        new Film(
                            row.id,
                            row.title,
                            row.watchDate ? dayjs(row.watchDate) : null,
                            row.isFavorite,
                            row.rating,
                            row.user_id
                        )
                    );
                    resolve(films);
                }
            });
        });
    };

    this.getFilmsByString = async (str) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films WHERE title LIKE ?";

            db.all(sql, [`%${str}%`], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const films = rows.map(row =>
                        new Film(
                            row.id,
                            row.title,
                            row.watchDate ? dayjs(row.watchDate) : null,
                            row.isFavorite,
                            row.rating,
                            row.user_id
                        )
                    );
                    resolve(films);
                }
            });
        });
    };

    this.addFilm = async (film) => {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO films(title, isFavorite, watchDate, rating, userId)
                VALUES(?, ?, ?, ?, ?)
            `;

            db.run(
                sql,
                [
                    film.title,
                    film.favorite ? 1 : 0,
                    film.watch_date ? film.watch_date.format("YYYY-MM-DD") : null,
                    film.rating,
                    film.user_id
                ],
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                }
            );
        });
    };

    this.deleteFilm = async (id) => {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM films WHERE id = ?";

            db.run(sql, [id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });
    };

    this.deleteAllWatchDates = async () => {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE films SET watchDate = NULL";

            db.run(sql, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });
    };

    this.toString = (films) => {
        return films.reduce((str, film) => str + film.toString() + "\n", "");
    };
}

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
