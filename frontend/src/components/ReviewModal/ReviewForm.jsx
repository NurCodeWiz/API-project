import { useDispatch } from 'react-redux';
// import { useModal } from '../../context/Modal';
import { submitReviewForSpot} from '../../store/reviews';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSpecificSpot } from '../../store/spots';
import './ReviewForm.css'

const ReviewForm = ({ spotId, onReviewUpdate }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [stars, setStars] = useState(null)
    const [hover, setHover] = useState(null)
    const [isFormVisible, setIsFormVisible] = useState(true);

    // const [validations, setValidations] = useState({})
    // const { closeModal } = useModal()
    // const [submitted, setSubmitted] = useState(false)
    // const [review, setReview] = useState('')
    const [reviewText, setReviewText] = useState('');

    const [errors, setErrors] = useState([]);


  useEffect(() => {
    if (reviewText.length < 10) {
      setErrors(['Review must be at least 10 characters long.']);
    } else {
      setErrors([]);
    }
  }, [reviewText]);

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFormVisible(false);
    setErrors([]); //reset errors

    if (stars > 0) {
      const reviewData = { review: reviewText, stars: stars };

      try {
        await dispatch(submitReviewForSpot(spotId, reviewData));
        dispatch(fetchSpecificSpot(spotId));//including the newly added review.
        //This cb trigger additional updates in the parent component.
        if (onReviewUpdate) {
          onReviewUpdate();
        }
        navigate(`/spots/${spotId}`);
      } catch (error) {

        // console.error('Error submitting the review:', error);
        setErrors(prevErrors => [...prevErrors, "Review already exists for this spot"]);
      }
    } else {
      setErrors(prevErrors => [...prevErrors, "Please select a star rating."]);
    }
  };
  if (!isFormVisible) {
    return <div>Your form has been submitted successfully!</div>;
  }
  return (
    <form onSubmit={handleSubmit} className="review-form">
        <h1 className='title'>How was your stay?</h1>
        {/* {"message" in validations && <p>{validations.message}</p>} */}
      <textarea
        className="review-textarea"
        type='text'
        name='description'
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Share your experience..."

      />
      {errors.map((error, index) => (
        <div key={index} className="form-error">{error}</div>
      ))}
      <div className='StarsBox'>
                {[1, 2, 3, 4, 5].map((star, i) => {
                    const ratingValue = i + 1
                    return (
                      //creating a label element for each star.Allowing it to efficiently update the DOM.
                      //filled star if the ratingValue is less than or equal to the current hover value or the selected stars value.
                        <label key={i}>
                            <span
                                className='Stars'
                                onClick={() => setStars(ratingValue)}
                                onMouseEnter={() => setHover(ratingValue)}
                                onMouseLeave={() => setHover(null)}
                            >
                                {ratingValue <= (hover || stars) ? '★' : '☆'}
                            </span>
                        </label>
                    )
                })}
               <label className='stars-label'>Stars</label>
            </div>
      <button type="submit" disabled={errors.length > 0 || stars < 1}>
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
