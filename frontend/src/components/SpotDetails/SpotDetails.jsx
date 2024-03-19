
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSpecificSpot } from '../../store/spots';
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


  const currentUser = useSelector((state) => state.session.user)
  console.log('currentuser================>', currentUser)

  function isOwner(currUser) {
      let currUserIsOwner
      if (currentUser && spot?.Owner) {
          currUserIsOwner = currUser?.id === spot?.Owner.id
          return currUserIsOwner
      }
  }
  useEffect(() => {
    dispatch(fetchSpecificSpot(spotId))
  }, [spotId, dispatch]);
    // useEffect(() => {
    //     dispatch(fetchSpots());
    // }, [dispatch]);

  console.log("ggggg",spotId)

  let currentSpot = spot[spotId]

  if (!currentSpot || !currentSpot.Owner) {
    return (<div>Loading...</div>);
  }

  console.log("loookatmeeeee", currentSpot)



//   const hasReview = Object.values(reviews).some(review =>
//     review.userId === currentUser?.id && review.spotId === Number(spotId));
let rev = '';
const { numReviews } = currentSpot;

rev = numReviews === 1
    ? `• ${numReviews} Review`
    : numReviews > 1
        ? `• ${numReviews} Reviews`
        : '';

const hasReview = Object.values(rev).some(review =>
  review.userId === currentUser?.id && review.spotId === Number(spotId));


return (
    <div className='details-container'>
    <h1 className='title-header'>{currentSpot.name}</h1>
    <div className='location-details'>
        {currentSpot.city}, {currentSpot.state}, {currentSpot.country}
    </div>
    <div className='image-gallery'>
        <img className='primary-image' src={currentSpot.SpotImages[0]?.url} alt='Spot view' />
        <div className='secondary-images'>
            {currentSpot.SpotImages.slice(1).map((image) => (
                <img key={image.id} className='additional-image' src={image.url} alt='Spot' />
            ))}
        </div>
    </div>
    <div className='info-section'>
        <div className='hosting-details'>
            <p>Managed by {currentSpot.Owner.firstName} {currentSpot.Owner.lastName}</p>
            <p className='description-text'>{currentSpot.description}</p>
        </div>
        <div className='reservation-info'>
            <div className='pricing-and-rating'>
                <span className='nightly-rate'>${currentSpot.price} / night</span>
                <div className='star-rating-container'>
                    <p>★ {currentSpot.avgStarRating > 0 ? currentSpot.avgStarRating.toFixed(1) : 'New'}
                    {currentSpot.numReviews > 0 && ` · ${currentSpot.numReviews} ${currentSpot.numReviews === 1 ? 'Review' : 'Reviews'}`}</p>
                </div>
            </div>
            {!isOwner(currentSpot.Owner.id) && !hasReview &&
                <div className='Post-review'>
                    <OpenModalButton
                        className='reserve-btn'
                        buttonText='Post Your Review'
                        modalComponent={<ReviewForm spotId={currentSpot.id} />} />
                </div>
            }
            {<div className='Reviews-container'>
                <SpotFeedbacks spotId={currentSpot.id}/>
            </div>}
        </div>
    </div>
</div>

)


};

export default SpotDetails;
