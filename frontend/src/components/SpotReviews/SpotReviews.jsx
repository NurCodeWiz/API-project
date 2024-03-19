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
  const reviewArray = Object.values(reviewsState).filter((review) => review.spotId == parseInt(spotId)).reverse()
//   const currUser = useSelector((state) => state.session.user)

  useEffect(() => {
    dispatch(getReviews(spotId));
  }, [dispatch, spotId]);


  if (!reviewsState) {
    return (<div>Loading...</div>);
  }

//   const reviewArray = Object.values(reviewsState).filter((review) => review.spotId == parseInt(spotId)).reverse()

  if (!reviewArray.length) {
    return <div className='No-review'>Be the first to post a review!</div>;
  }

  console.log('yayayayayayayya', reviewArray)

  //return (<div>ready...</div>);
  function formatDate(date) {

    const newDate = new Date(date);
    const month = newDate.toLocaleString('default', { month: 'long' });
    const year = newDate.getFullYear();
    return `${month} ${year}`;
}


  return (
    <>
        <div className='Reviews-container'>
            {reviewArray.map((review) => (
                <div key={review.id}>
                    <div className='Review-container'>
                        <h2 className='Review-Name'>{review.review}</h2>
                        <div className='Review-date'>
                        <p className='date-month'>{formatDate(review.createdAt)}</p>
                        </div>
                        <p className='Review-content'>{review.review}</p>
                            {/* {currUser?.id === review.User?.id &&
                                (<OpenModalButton
                                    className='delbtn'
                                    buttonText='Delete'
                                    modalComponent={<DeleteReview reviewId={review.id} />} >
                                </OpenModalButton>
                                )} */}
                        </div>
                        <hr className='Review-line' />
                    </div>
                ))}
            </div>
        </>



)



};
export default SpotFeedbacks
