import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteReviewThunk} from '../../store/reviews';
// import { useNavigate } from 'react-router-dom';
// import { fetchSpecificSpot } from '../../store/spots';
import './DeleteReview.css'


const DeleteReview = ({ reviewId }) => {

    const dispatch = useDispatch();

    const { closeModal } = useModal();


    const handleDelete = (e) => {
        e.preventDefault();
        dispatch(deleteReviewThunk(reviewId));
        closeModal();
    };


    return (
        <div className='delete-modal-container'>
            <div className='delete-text-container'>
                <h1 className='delete-title'>Confirm Deletion</h1>
                <p className='delete-text'>Are you sure you want to delete this review?</p>
            </div>
            <div className='delete-button-container'>
                <button className='delete-button' onClick={handleDelete}>
                    Yes, Delete Review
                </button>
                <button className='cancel-button' onClick={closeModal}>
                    No, Keep Review
                </button>
            </div>
        </div>
    );
}


export default DeleteReview;
