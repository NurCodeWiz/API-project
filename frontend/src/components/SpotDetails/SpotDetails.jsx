
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSpecificSpot } from '../../store/spots';
import { getReviews } from '../../store/reviews'
// import {getReviews } from '../../store/reviews'
import SpotFeedbacks from '../SpotReviews/SpotReviews'
import ReviewForm from '../ReviewModal/ReviewForm'
import OpenModalButton from '../OpenModalButton'
import './SpotDetails.css'
// SpotDetails component
const SpotDetails = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  //const spot = useSelector((state) => Object.values(state.spotsState || []));
  const spot = useSelector((state) =>{return  state.spotsState});
//   const review = useSelector(state => state.reviews);


  const currentUser = useSelector((state) => state.session.user)// accesses parts of the Redux storeall reviews, and the current user session.
  console.log('currentuser================>', currentUser)

  function isOwner(spotOwner) {
      if (currentUser && spotOwner) {
        return currentUser.id == spotOwner.id
      }
      else
      {
        return null
      }
  }

  const review = useSelector((state) => {return state.reviewState})
  const reviewArray = Object.values(review)// transform the reviews and images into arrays for easier iteration.
  useEffect(() => {
    dispatch(fetchSpecificSpot(spotId))

    dispatch(getReviews(spotId))
}, [dispatch, spotId, reviewArray.length]) //reviewArray.length

//   useEffect(() => {
//     dispatch(fetchSpecificSpot(spotId))
//   }, [spotId, dispatch]);

//     // useEffect(() => {
//     //     dispatch(fetchSpots());
//     // }, [dispatch]);


  console.log("ggggg",spotId)

  let currentSpot = spot[spotId]

  if (!currentSpot || !currentSpot.Owner) {
    return (<div>Loading...</div>);
  }

  console.log("loookatmeeeee", currentSpot)

  const reserveBtn = (e) => {
    e.preventDefault();
    alert("Feature coming soon");
};

let currSpot = spot[spotId]
console.log("spots:",spot[spotId])
let imgarr = [currSpot.SpotImages]
console.log("images array:",imgarr)
let newImgArr = structuredClone(...imgarr)
newImgArr.shift()

//   const hasReview = Object.values(reviews).some(review =>
//     review.userId === currentUser?.id && review.spotId === Number(spotId));
// let rev = '';
// const { numReviews } = currentSpot;

// rev = numReviews === 1
//     ? `• ${numReviews} Review`
//     : numReviews > 1
//         ? `• ${numReviews} Reviews`
//         : '';

// const hasReview = Object.values(rev).some(review =>
//   review.userId === currentUser.userId);

const hasReview = reviewArray.some(review =>
    review.userId === currentUser?.id);

return (
    <div className='page-container'>
      <div className='details-container'>
      <h1 className='title-header'>{currentSpot.name}</h1>
      <h3 className='location-details'>{currentSpot.city}, {currentSpot.state}, {currentSpot.country}</h3>
      {/* <div className='location-details'>
         {currentSpot.city}, {currentSpot.state}, {currentSpot.country}
     </div> */}
    </div>

      <div className='image-gallery'>
        {/* Primary image */}
        <img className='primary-image' src={currentSpot.SpotImages[0]?.url} alt='Spot view' />
        {/* Secondary images */}
        <div className='secondary-images'>
          {currentSpot.SpotImages.slice(1).map((image) => (
            <img key={image.id} className='additional-image' src={image.url} alt='Spot' />
          ))}
        </div>
      </div>


      <div className='details-container'>

        <div className='info-section'>
          <div className='hosting-details'>
            <p>Managed by {currentSpot.Owner.firstName} {currentSpot.Owner.lastName}</p>
            <p className='description-text'>{currentSpot.description}</p>
          </div>
          <div className='reservation-info'>
            <div className='pricing-and-rating'>
              <span className='nightly-rate'>${currentSpot.price}/night</span>
              <div className='star-rating-container'>
                <p>★ {currentSpot.avgStarRating > 0 ? currentSpot.avgStarRating.toFixed(1) : 'New'}&nbsp;
            {/* ·{currentSpot.numReviews} {currentSpot.numReviews === 1 ? 'Review' : 'Reviews'}</p> */}
            {currentSpot.numReviews > 0 ? ` · ${currentSpot.numReviews} ${currentSpot.numReviews === 1 ? 'Review' : 'Reviews'}` : ''}</p>

              </div>
            </div>
            <button className='reserve-btn' onClick={reserveBtn}>Reserve</button>
          </div>
        </div>
      </div>
      <div className='reviews-container'>
        <div className='ReviewTitle-container'>
          {/* <h2>Reviews</h2> */}
          <p>★ {currentSpot.avgStarRating > 0 ? currentSpot.avgStarRating.toFixed(1) : 'New'}&nbsp;
            {/* · {currentSpot.numReviews} {currentSpot.numReviews === 1 ? 'Review' : 'Reviews'}</p> */}
            {currentSpot.numReviews > 0 ? ` · ${currentSpot.numReviews} ${currentSpot.numReviews === 1 ? 'Review' : 'Reviews'}` : ''}</p>
            {currentUser && !isOwner(currentSpot.Owner) && !hasReview &&
          <div className='Post-review'>
            <OpenModalButton
              className='reserve-btn'
              buttonText='Post Your Review'
              modalComponent={<ReviewForm spotId={currentSpot.id} />} />
          </div>
        }
        </div>
        <div className='reviews-list'>
          <SpotFeedbacks spotId={currentSpot.id} />
        </div>
      </div>
    </div>
  );
}

export default SpotDetails;
