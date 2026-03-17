import sqlite from 'sqlite3'
import dayjs from 'dayjs'
import Film from './Film.js'

export default function FilmLibrary() {

    const db = new sqlite.Database("films.db", (err) => {
        if(err)
            console.log("Error in opening database");
        else
            console.log("Database connected successfully");
    });

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
                            row.userId
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
                            row.userId
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
                            row.userId
                        )
                    );
                    resolve(films);
                }
            });
        });
    };

    this.getFilm = async (id) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films WHERE id = ?";

            db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else if (!row){
                    resolve(null);
                }else{
                    const film = new Film(
                        row.id,
                        row.title,
                        row.watchDate ? dayjs(row.watchDate) : null,
                        row.isFavorite,
                        row.rating,
                        row.userId
                    );
                    resolve(film);
                }
            });
        });
    };

    this.getInterval = async (dateS, dateE) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films WHERE watchDate >= ? AND watchDate < ?";

            db.all(sql, [dateS, dateE], (err, rows) => {
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
                            row.userId
                        )
                    );
                    resolve(films);
                }
            });
        });
    };

    this.getUnseen = async () => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films WHERE watchDate IS NULL";

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
                            row.userId
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
                            row.userId
                        )
                    );
                    resolve(films);
                }
            });
        });
    };

    this.getMostRatedFilms = async () => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films WHERE rating = 5";
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
                            row.userId
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
                    film.isFavorite ? 1 : 0,
                    film.watchDate ? film.watchDate.format("YYYY-MM-DD") : null,
                    film.rating,
                    film.userId
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

    this.updateFilm = async (id, updates) => {
        const existingFilm = await this.getFilm(id);

        if (!existingFilm) {
            throw new Error("Film not found");
        }

        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE films
                SET title = ?,
                    isFavorite = ?,
                    watchDate = ?,
                    rating = ?,
                    userId = ?
                WHERE id = ?`;

            const title = Object.hasOwn(updates, "title")
                ? updates.title
                : existingFilm.title;

            const isFavorite = Object.hasOwn(updates, "isFavorite")
                ? (updates.isFavorite ? 1 : 0)
                : existingFilm.isFavorite;

            const watchDate = Object.hasOwn(updates, "watchDate")
                ? (updates.watchDate ? dayjs(updates.watchDate).format("YYYY-MM-DD") : null)
                : (existingFilm.watchDate ? existingFilm.watchDate.format("YYYY-MM-DD") : null);

            const rating = Object.hasOwn(updates, "rating")
                ? updates.rating
                : existingFilm.rating;

            const userId = Object.hasOwn(updates, "userId")
                ? updates.userId
                : existingFilm.userId;

            db.run(sql, [title, isFavorite, watchDate, rating, userId, id], function (err) {
                if (err) reject(err);
                else resolve(this.changes);
            });
        });
    };

    this.updateRating = async (id, rating) => {
        const existingFilm = await this.getFilm(id);

        if (!existingFilm) {
            throw new Error("Film not found");
        }

        return new Promise((resolve, reject) => {
            const sql = 'UPDATE films SET rating = ? WHERE id = ?';
            db.run(sql, [rating, id], function (err) {
                if (err) {
                    reject(err);
                    return;
                }

                if (this.changes === 0) {
                    reject({ error: 'Film not found' });
                    return;
                }

                resolve(this.changes);
            });
        });
    };

    this.updateFavorite = async (id, isFavorite) => {
        const existingFilm = await this.getFilm(id);

        if (!existingFilm) {
            throw new Error("Film not found");
        }

        return new Promise((resolve, reject) => {
            const sql = 'UPDATE films SET isFavorite = ? WHERE id = ?';

            db.run(sql, [isFavorite, id], function (err) {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(this.changes);
            });
        });
    };

    this.deleteFilm = async (id) => {
        const existingFilm = await this.getFilm(id);

        if (!existingFilm) {
            throw new Error("Film not found");
        }
        
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