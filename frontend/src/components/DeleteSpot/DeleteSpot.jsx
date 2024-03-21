import { useDispatch } from 'react-redux'
import { useModal } from '../../context/Modal'
import { deleteSpotThunk } from '../../store/spots'
// import { useNavigate } from 'react-router-dom';
import './DeleteSpot.css'

const DeleteSpot = ({spot}) =>{
    const dispatch=useDispatch()
    const { closeModal } = useModal()
    // const nav = useNavigate();
    const handleDelete=(e)=>{
        e.preventDefault()
        dispatch(deleteSpotThunk(spot.id))
        // togglePostSpot()
        // nav('/spots/current')
        closeModal()

}
return (
    <div className='delete-modal-container'>
      <div className='text-container'>
        <h1 className='title'>Confirm Deletion</h1>
        <p className='text'>Are you sure you want to delete this spot?</p>
      </div>
      <div className='button-container'>
        <button className='delete-button' onClick={handleDelete}>
          Yes, Delete Spot
        </button>
        <button className='cancel-button' onClick={closeModal}>
          No, Keep Spot
        </button>
      </div>
    </div>
  );
}
export default DeleteSpot
