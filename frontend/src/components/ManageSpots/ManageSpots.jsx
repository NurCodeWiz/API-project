import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchSpots  } from "../../store/spots"
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom"
import OpenModalButton from "../OpenModalButton"
import DeleteSpot from "../DeleteSpot/DeleteSpot"
import './ManageSpots.css'

const ManageSpots = () => {
    const user = useSelector(state => {return state.session.user})
    const spots = useSelector(state =>
        Object.values(state.spotsState).filter(spot => spot.ownerId === user.id)
      );
    // const userId = user.id;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const spotsArray = Object.values(spots)
    // console.log('spotsarray===>>>>', spotsArray)
    const [postSpot, setPostSpot] = useState(false)
    //arr only current owners
    let spotArray = Object.values(spots)
    // spotArray = spotArray.filter(spot => spot.ownerId == userId)
    // const spots = useSelector(state => {return state.spotsState})
    const togglePostSpot = () => {
        setPostSpot(currentValue => !currentValue);
    };

   useEffect(()=> {
    dispatch(fetchSpots())
   },[dispatch,postSpot])



   const navigateToCreate = () => navigate('/spots/new');



return (
    <>
        <h1 className='ManageSpot-title'>Manage Spots</h1>
        {spotArray.length === 0 && (
        <button className='Create-btn' onClick={navigateToCreate}>
            Create a New Spot
            </button>)}
        <div className='Spots-container'>
            {spotArray.map((spot) => (
                <div key={spot.id} className='each-spot-container'>
                    <NavLink className='Manage-container' to={`/spots/${spot.id}`}>
                        <div className="Spot-container" title={spot.name}>
                            <img className='image' src={spot.previewImage} alt={spot.name} />
                            <div className='Review-location-container'>
                                <div className="location">{spot.city}, {spot.state}</div>
                                <div className="review">★{isNaN(spot.avgRating) ? 'New' : parseFloat(spot.avgRating).toFixed(1)}</div>
                            </div>
                            <div className="price">${spot.price} night</div>
                        </div>
                    </NavLink>
                    <div className='update-delete-container'>
                        <NavLink className='Update-btn' to={`/spots/${spot.id}/edit`}>Update</NavLink>
                        <OpenModalButton
                            buttonText='Delete'
                            className='Delete-btn'
                            modalComponent={<DeleteSpot spot={spot} togglePostSpot={togglePostSpot} />}
                        />
                    </div>
                </div>
            ))}
        </div>
    </>
  )
}




export default ManageSpots
