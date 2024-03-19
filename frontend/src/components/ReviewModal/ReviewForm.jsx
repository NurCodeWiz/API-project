import { useDispatch } from 'react-redux';
// import { useModal } from '../../context/Modal';
import { submitReviewForSpot} from '../../store/reviews';
import StarRating from './Rating';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSpecificSpot } from '../../store/spots';
import './ReviewForm.css'

const ReviewForm = ({ spotId, onReviewUpdate }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [reviewText, setReviewText] = useState('');
    const [starRating, setStarRating] = useState(0);
    const [errors, setErrors] = useState([]);


    // Function to handle star rating click
  const handleStarRating = (rating) => {
    setStarRating(rating);
  };

  useEffect(() => {
    if (reviewText.length < 10) {
      setErrors(['Review must be at least 10 characters long.']);
    } else {
      setErrors([]);
    }
  }, [reviewText]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errors.length === 0 && starRating > 0) {
      const review = { review: reviewText, stars: starRating };
      await dispatch(submitReviewForSpot(spotId, review));
      dispatch(fetchSpecificSpot(spotId)); // refresh the spot details
      if (onReviewUpdate) onReviewUpdate(); //callback for parent component
      navigate(`/spots/${spotId}`);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="review-form">
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Share your experience..."
        className="review-textarea"
      />
      {errors.map((error, index) => (
        <div key={index} className="form-error">{error}</div>
      ))}
      <StarRating currentRating={starRating} onStarSelected={handleStarRating} />
      <button type="submit" disabled={errors.length > 0 || starRating === 0}>
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
