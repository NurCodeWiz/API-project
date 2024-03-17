

import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpecificSpot } from '../../store/spots';

// SpotDetails component
const SpotDetails = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) =>{return  state.spotsState});
//   console.log("loookatmeeeee",spot)

  useEffect(() => {
    dispatch(fetchSpecificSpot(spotId));
  }, [spotId,dispatch]);

  if (!spot) {
    return <div>Loading...</div>;
  }

  return (
    <h2 className='Spot-title'>{spot?.name}</h2>
  );
};

export default SpotDetails;
