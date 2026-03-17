import dayjs from 'dayjs'

export default function Film(id, title, watch_date = null, favorite = false, rating = null, user_id = 1) {
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