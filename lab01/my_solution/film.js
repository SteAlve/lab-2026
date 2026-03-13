import dayjs from 'dayjs'

function Film(id, title, watch_date=null, favorite=false, rating=null, user_id=1){
    this.id = id;
    this.title = title;
    this.favorite = favorite;
    this.watch_date = watch_date ? dayjs(watch_date) : null;
    this.rating = rating;
    this.user_id = user_id;

    this.toString = () => {return `Id: ${this.id}, Title: ${this.title}, Favorite: ${this.favorite}, Watch date: ${this.watch_date ? this.watch_date.format("[On the] MMMM DD, YYYY") : "Non visto"}, Rating: ${this.rating}, User id: ${this.user_id}`}
}

function FilmLibrary(){
    this.films = [];

    this.addFilm = (f) => {this.films.push(f)};
    this.getFilms = () => {return this.films};
    this.sortByDate = () => {this.films.sort((a,b) => {
        if(!a.watch_date && !b.watch_date){
            return 0;
        }
        if(!a.watch_date){
            return 1;
        }
        if(!b.watch_date){
            return -1;
        }
        return a.watch_date.diff(b.watch_date);
    })}
    this.toString = () => {
        return this.films.reduce((str, f) => str + f.toString() + "\n", "");
    };
    this.removeFilm = (id) => {
        const index = this.films.findIndex((f) => f.id === id);
        if(index != -1){
            this.films.splice(index,1);
        }
    };
    this.updateRating = (id, rating) => {
        const film = this.films.find((f) => f.id === id);
        if(film){
            film.rating = rating;
        }
    }
}



const f1 = new Film(1, "Pirati dei caraibi");
console.log(f1);
const f2 = new Film(2, "Star wars", "2026-03-01", false, 4, 2);
console.log(f2);
const f3 = new Film(3, "Pippo baudo", "2026-01-01");
console.log(f3);
const fl = new FilmLibrary();
fl.addFilm(f1);
fl.addFilm(f2);
fl.addFilm(f3);
console.log(fl.toString());
fl.sortByDate();
console.log(fl.toString());
fl.removeFilm(2);
console.log(fl.toString());
fl.updateRating(3,5);
console.log(fl.toString());