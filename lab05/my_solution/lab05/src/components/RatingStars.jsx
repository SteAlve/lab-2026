function RatingStars({ rating }) {
  return (
    <span aria-label={rating > 0 ? `Rating: ${rating} out of 5 stars` : "Not rated"}>
      {[1, 2, 3, 4, 5].map((star) => (
        <i
          key={star}
          className={`bi ${
            star <= rating ? "bi-star-fill text-warning" : "bi-star text-secondary"
          }`}
        ></i>
      ))}
    </span>
  );
}

export default RatingStars;