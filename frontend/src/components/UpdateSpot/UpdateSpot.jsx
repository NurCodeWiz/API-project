import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchSpecificSpot } from "../../store/spots";
import CreateSpot from "../CreateSpot/CreateSpot";
import './UpdateSpot.css'

const UpdateSpot = () => {
    const dispatch = useDispatch();
    const { spotId } = useParams();

    const spot = useSelector((state) => state.spotsState[spotId]);

    useEffect(() => {
        if (spotId && !spot) {
            dispatch(fetchSpecificSpot(spotId));
        }
    }, [dispatch, spotId, spot]);

    return (
        <>
            <h1 className='form-header'>Update Your Spot</h1>
            {spot && <CreateSpot spot={spot} buttonName="Update Spot" />}
        </>
    );
};

export default UpdateSpot
