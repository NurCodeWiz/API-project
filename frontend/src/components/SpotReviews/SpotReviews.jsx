import { useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getReviews } from '../../store/reviews';
import DeleteReview from '../DeleteReview/DeleteReview'
import OpenModalButton from '../OpenModalButton'
// import ReviewForm from '../ReviewModal/ReviewForm';
// import DeleteReviewModal from '../DeleteReviewModal/DeleteReviewModal';
// import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import './SpotReviews.css';

const SpotFeedbacks = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
//   const session = useSelector(state => state.session);
  const reviewsState = useSelector(state => state.reviewState);
  console.log('0000000000000',reviewsState)
  const reviewArray = Object.values(reviewsState).filter((review) => review.spotId == parseInt(spotId)).reverse()
  const currUser = useSelector((state) => state.session.user)

  useEffect(() => {
    dispatch(getReviews(spotId));
  }, [dispatch, spotId]);


//   if (!reviewsState.User || !reviewsState) {
//     return (<div>Loading...</div>);
//   }

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
// let currentReviews = []
//     if(reviewArray.length){
//         reviewArray.forEach(rev => {
//             let date = (new Date(rev.createdAt)).toDateString()
//             let month = date.slice(4,8)
//             const year = (new Date(rev.createdAt)).getFullYear()
//             rev.newDate = `${month} ${year}`
//         })
//         reviewArray.map(rev => {
//             if(rev.spotId ==  spot.id){
//                 currentReviews.push(rev)
//             }
//         })
//     }
//     let userId = users.user ? users.user.id : null
//     currentReviews.reverse();

//     let hasReview = currentReviews.filter((rev) => rev.userId == userId)

  return (
    <>
        <div className='Reviews-container'>
            {reviewArray.map((review) => (
                <div key={review.id}>
                    <div className='Review-container'>
                        {review.User && (<h2 className='Review-Name'>{review.User.firstName}</h2>)}
                        <div className='Review-date'>
                        <p className='date-month'>{formatDate(review.createdAt)}</p>
                        </div>
                        <p className='Review-content'>{review.review}</p>
                            {currUser?.id === review.User?.id &&
                                (<OpenModalButton
                                    className='delbtn'
                                    buttonText='Delete'
                                    modalComponent={<DeleteReview reviewId={review.id} />} >
                                </OpenModalButton>
                                )}
                        </div>
                        <hr className='Review-line' />
                    </div>
                ))}
            </div>
        </>



)



};
export default SpotFeedbacks
