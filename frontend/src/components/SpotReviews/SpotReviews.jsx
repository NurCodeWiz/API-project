import { useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getReviews } from '../../store/reviews';
// import ReviewForm from '../ReviewModal/ReviewForm';
// import DeleteReviewModal from '../DeleteReviewModal/DeleteReviewModal';
// import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import './SpotReviews.css';

const SpotFeedbacks = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
//   const session = useSelector(state => state.session);
  const reviewsState = useSelector(state => state.reviewState);

  useEffect(() => {
    dispatch(getReviews(spotId));
  }, [dispatch, spotId]);


  if (!reviewsState) {
    return (<div>Loading...</div>);
  }

  const reviewArray = Object.values(reviewsState).filter((review) => review.spotId === parseInt(spotId)).reverse()

  if (!reviewArray.length) {
    return (<div>No reviews...</div>);
  }

  console.log('yayayayayayayya', reviewArray)

  //return (<div>ready...</div>);

  return (
    <>
        <div className='Reviews-container'>
            {reviewArray.map((review) => (
                <div key={review.id}>
                    <div className='Review-container'>
                        <h2 className='Review-Name'>{review.review}</h2>
                    </div>
                    <div className='Review-container'>
                        <h2 className='Review-Name'>{review.stars}</h2>
                    </div>
                    <hr className='Review-line' />
                </div>
            ))}
        </div>
    </>
)


};
export default SpotFeedbacks
