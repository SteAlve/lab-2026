import sqlite from 'sqlite3'
import dayjs from 'dayjs'
import Film from './Film.js'
import e from 'express';

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

    this.getFilm = async (id) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films WHERE id = ?";

            db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else if (!row){
                    resolve(null);
                }else{
                    const film =new Film(
                        row.id,
                        row.title,
                        row.watchDate ? dayjs(row.watchDate) : null,
                        row.isFavorite,
                        row.rating,
                        row.user_id
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
                            row.user_id
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

    this.updateFilm = async (film) => {
        return new Promise(async (resolve, reject) => {
            const sql = `
                UPDATE films
                SET title = ?, isFavorite = ?, watchDate = ?, rating = ?, userId = ?
                WHERE id = ?`;
            const existingFilm = await this.getFilm(film.id);

            if (!existingFilm) {
                throw new Error("Film not found");
            }
            db.run(
                sql,
                [
                    film.title ?? existingFilm.title,
                    film.favorite !== undefined ? (film.favorite ? 1 : 0) : existingFilm.isFavorite,
                    film.watch_date ? film.watch_date.format("YYYY-MM-DD") : existingFilm.watchDate,
                    film.rating ?? existingFilm.rating,
                    film.user_id ?? existingFilm.user_id,
                    film.id
                ],
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.changes);
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