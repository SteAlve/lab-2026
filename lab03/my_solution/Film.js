import dayjs from 'dayjs'

export default function Film(id, title, watchDate = null, isFavorite = false, rating = null, userId = 1) {
    this.id = id;
    this.title = title;
    this.isFavorite = isFavorite;
    this.watchDate = watchDate ? dayjs(watchDate) : null;
    this.rating = rating;
    this.userId = userId;

    this.toString = () => {
        return `Id: ${this.id}, Title: ${this.title}, Favorite: ${this.isFavorite}, Watch date: ${
            this.watchDate ? this.watchDate.format("YYYY-MM-DD") : "Non visto"
        }, Rating: ${this.rating}, User id: ${this.userId}`;
    };
}