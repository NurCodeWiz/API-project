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

  const spot = useSelector((state) =>{return  state.spotsState});
  let currentSpot = spot[spotId]

//   const session = useSelector(state => state.session);
  const reviewsState = useSelector(state => state.reviewState);
  console.log('0000000000000',reviewsState)
  //using "==" for reviewArray
  const reviewArray = Object.values(reviewsState).filter((review) => review.spotId == parseInt(spotId)).reverse()
  const currUser = useSelector((state) => state.session.user)

  useEffect(() => {
    dispatch(getReviews(spotId));
  }, [dispatch, spotId]);


//   if (!reviewsState.User || !reviewsState) {
//     return (<div>Loading...</div>);
//   }

function isOwner(spotOwner) {
  if (currUser && spotOwner) {
    return currUser.id == spotOwner.id
  }
  else
  {
    return null
  }
}

const hasReview = reviewArray.some(review =>
review.userId === currUser?.id);
if (!reviewArray.length && currUser && !isOwner (currentSpot.Owner) && !hasReview ) {
    return <div className='No-review'>Be the first to post a review!</div>;
}

// console.log('yayayayayayayya', reviewArray)


function formatDateV2(date) {
  // Parse the input date string to a Date object
  const parsedDate = new Date(date);
  // Define formatting options
  const options = {
    month: 'long', // Full name of the month
    year: 'numeric' // Numeric year
  };
  // Create a formatter using the Intl.DateTimeFormat API
  const dateFormatter = new Intl.DateTimeFormat('default', options);
  // Format and return the date
  return dateFormatter.format(parsedDate);
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
        {reviewArray.map(({ id, User, createdAt, review }) => (
            <div key={id}>
                <div className='Review-container'>
                    {User && <h2 className='Review-Name'>{User.firstName}</h2>}
                    <div className='Review-date'>
                        <p className='date-month'>{formatDateV2(createdAt)}</p>
                    </div>
                    <p className='Review-content'>{review}</p>
                    {currUser?.id === User?.id && (
                        <OpenModalButton
                            className='delbtn'
                            buttonText='Delete'
                            modalComponent={<DeleteReview reviewId={id} />}
                        />
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
