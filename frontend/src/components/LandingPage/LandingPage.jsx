import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpots } from "../../store/spots";
import { NavLink } from "react-router-dom";
import './LandingPage.css';


function LandingPage() {
    const dispatch = useDispatch();


    //const spots = useSelector((state) => Object.values(state.spotsState || []));
    const spotsObject = useSelector((state) => state.spotsState);//access the spots data stored in the Redux state
    const spots = Object.values (spotsObject)//transforms it into an array of spot objects,
    // console.log('my spots', spots)
    //Triggers the fetchSpot action.
    useEffect(() => {
        dispatch(fetchSpots());
    }, [dispatch]);
    if(!spots)return null //prevent rendering of an empty or undefined state.

    return (
        <div className="spots-container">
            {spots.map((spot) => (
                <NavLink className='Nav-container' to={`/spots/${spot.id}`} key={spot.id}>
                    <div className="Spot-container" title={spot.name}>
                        <img className='image' src={spot.previewImage} alt={spot.name} />
                        <div className='Review-location-container'>
                            <div className="location">{spot.city}, {spot.state}</div>
                            <div className="review">★ {spot.avgRating > 0 ? spot.avgRating.toFixed(1) : 'New'}</div>
                        </div>
                        <div className="price">${spot.price} per night</div>
                    </div>
                </NavLink>
            ))}
        </div>
    );
}

export default LandingPage;
