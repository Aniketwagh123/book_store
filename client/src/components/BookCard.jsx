import StarIcon from "@mui/icons-material/Star";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const BookCard = ({ book }) => {
  return (
    <Link to={`/books/${book.id}`} style={styles.link}>
      <div style={styles.card}>
        <div style={styles.imageContainer}>
          {book.imgSrc ? (
            <img src={book.imgSrc} alt={book.name} style={styles.image} />
          ) : (
            <div style={styles.placeholder} aria-label="Image not available">
              Image not available
            </div>
          )}
        </div>
        <div style={styles.content}>
          <div style={styles.title} title={book.name}>
            {book.name}
          </div>
          <div style={styles.author}>by {book.author}</div>
          <div style={styles.ratingContainer}>
            <StarIcon color="primary" />
            <span style={styles.rating}>
              {/* {book.rating} ({book.reviews}) */}
              {4} ({10})
            </span>
          </div>
          <div style={styles.priceContainer}>
            Rs. {book.price}
          
          </div>
        </div>
      </div>
    </Link>
  );
};

BookCard.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.number.isRequired,
    imgSrc: PropTypes.string,
    name: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    // rating: PropTypes.number.isRequired,
    // reviews: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    // oldPrice: PropTypes.number,
    stock: PropTypes.bool,
  }).isRequired,
};

const styles = {
  link: {
    textDecoration: "none",
    color: "inherit",
    display: "block",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    maxWidth: "300px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    margin: "20px auto",
    backgroundColor: "#fff",
    transition: "transform 0.2s ease-in-out",
    ":hover": { transform: "scale(1.02)" },
  },
  imageContainer: {
    textAlign: "center",
    backgroundColor: "#F5F5F5",
    height: "200px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottom: "1px solid #ddd",
    padding: "10px",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "cover",
    borderRadius: "4px",
  },
  placeholder: {
    color: "#999",
    fontSize: "14px",
  },
  content: {
    textAlign: "left",
    padding: "20px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "8px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  author: {
    color: "#666",
    fontSize: "14px",
    marginBottom: "8px",
  },
  ratingContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
  },
  rating: {
    marginLeft: "8px",
    fontSize: "14px",
    color: "#666",
  },
  priceContainer: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#007bff",
  },
  oldPrice: {
    fontSize: "14px",
    color: "#999",
    textDecoration: "line-through",
    marginLeft: "10px",
  },
};

export default BookCard;
