
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSpecificSpot } from '../../store/spots';
// import { fetchSpots } from '../../store/spots';
import './SpotDetails.css'
// SpotDetails component
const SpotDetails = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  //const spot = useSelector((state) => Object.values(state.spotsState || []));
  const spot = useSelector((state) =>{return  state.spotsState});

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

return (
    <div className='details-container'>
      <h1 className='title-header'>{currentSpot.name}</h1>
      <div className='location-details'>{currentSpot.city}, {currentSpot.state}, {currentSpot.country}</div>
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
        </div>
        <p className='description-text'>{currentSpot.description}</p>
        <div className='reservation-info'>
          <span className='nightly-rate'>${currentSpot.price} / night</span>
          <button className='reserve-btn' onClick={() => alert('Coming soon!')}>Book Now</button>
        </div>
      </div>
    </div>
  )

};

export default SpotDetails;
