import { useDispatch, useSelector} from "react-redux"
import { useEffect,useState} from "react";
import { useParams } from "react-router-dom";
import { spotUpdateThunk, fetchSpecificSpot } from "../../store/spots";
import { useNavigate } from "react-router-dom";
import './UpdateSpot.css'

const UpdateSpot = () => {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const navigate = useNavigate();
    const [validations, setValidations] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const spot = useSelector((state) => state.spotsState[spotId]);


    const [country, setCountry] = useState(spot?.country || '');
    const [address, setAddress] = useState(spot?.address || '');
    const [city, setCity] = useState(spot?.city || '');
    const [state, setState] = useState(spot?.state || '');
    const [lat, setLat] = useState(spot?.lat || '');
    const [lng, setLng] = useState(spot?.lng || '');
    const [description, setDescription] = useState(spot?.description || '');
    const [name, setName] = useState(spot?.name || '');
    const [price, setPrice] = useState(spot?.price || '');


    useEffect(() => {
        let valObject = {};
        if (!spotId) return;
        dispatch(fetchSpecificSpot(spotId))

        if (!country) {
            valObject.country = 'Country is required';
        }
        if (!address) {
            valObject.address = 'Address is required'
        }

        if (!city) {
            valObject.city = 'City is required'
        }

        if (!state) {
            valObject.state = 'State is required'
        }
        if (description && description.length < 30) {
            valObject.description = 'Description needs 30 or more characters'
        }

        if (!name) {
            valObject.name = 'Name is required'
        }
        setValidations(valObject)

     }, [dispatch, spotId,country, address, city, state, description, name, price,]);


     const handleInputChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'country': setCountry(value); break;
            case 'address': setAddress(value); break;
            case 'city': setCity(value); break;
            case 'state': setState(value); break;
            case 'lat': setLat(value); break;
            case 'lng': setLng(value); break;
            case 'description': setDescription(value); break;
            case 'name': setName(value); break;
            case 'price': setPrice(value); break;
            default: break;
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        const valObject = {}

        if (Object.keys(valObject).length === 0) {
            try {
                await dispatch(spotUpdateThunk({
                    country,
                    address,
                    city,
                    state,
                    lat,
                    lng,
                    description,
                    name,
                    price
                }, spotId));


                navigate(`/spots/${spotId}`);
            } catch (error) {

                const data = await error.json();
                if (data && data.errors) {
                    setValidations(data.errors);
                } else {
                    console.error("Failed to update spot:", error);
                }
            }
        } else {
            setValidations(valObject);

        }
    };
    return (
        spot && (
            <>
                <div className='spot-update-container'>
                    <form className='spot-update-form' onSubmit={handleSubmit}>
                        <h1 className='update-title'>Update Your Spot</h1>


                        <div className='form-section'>
                            <h2>Location Details</h2>
                            <div className='field'>
                                <label className='form-label'>Country</label>
                                <input
                                    type='text'
                                    className='form-input'
                                    name='country'
                                    value={country}
                                    onChange={handleInputChange}
                                    placeholder='Country'
                                />
                                {submitted && validations.country && <p className='form-error'>{validations.country}</p>}
                            </div>

                            <div className='field'>
                                <label className='form-label'>Address</label>
                                <input
                                    type='text'
                                    className='form-input'
                                    name='address'
                                    value={address}
                                    onChange={handleInputChange}
                                    placeholder='Address'
                                />
                                {submitted && validations.address && <p className='form-error'>{validations.address}</p>}
                            </div>

                            <div className='field'>
                                <label className='form-label'>City</label>
                                <input
                                    type='text'
                                    className='form-input'
                                    name='city'
                                    value={city}
                                    onChange={handleInputChange}
                                    placeholder='City'
                                />
                                {submitted && validations.city && <p className='form-error'>{validations.city}</p>}
                            </div>

                            <div className='field'>
                                <label className='form-label'>State</label>
                                <input
                                    type='text'
                                    className='form-input'
                                    name='state'
                                    value={state}
                                    onChange={handleInputChange}
                                    placeholder='State'
                                />
                                {submitted && validations.state && <p className='form-error'>{validations.state}</p>}
                            </div>
                            <div className='form-section'>
                                <label className='form-label'>Latitude</label>
                                <input
                                    type="text"
                                    className='form-input'
                                    name="lat"
                                    value={lat}
                                    onChange={handleInputChange}
                                    placeholder="Latitude"
                                />
                            {submitted && validations.lat && <p className='form-error'>{validations.lat}</p>}
                            </div>
                            <div className='form-section'>
                                <label className='form-label'>Longitude</label>
                                <input
                                    type="text"
                                    className='form-input'
                                    name="lng"
                                    value={lng}
                                    onChange={handleInputChange}
                                    placeholder="Longitude"
                                />
                            {submitted && validations.lng && <p className='form-error'>{validations.lng}</p>}
                            </div>
                            </div>
                            <div className='form-section'>
                            <h2>Description & Price</h2>
                            <div className='field'>
                                <label className='form-label'>Description</label>
                                <textarea
                                    className='form-textarea'
                                    name='description'
                                    value={description}
                                    onChange={handleInputChange}
                                    placeholder='Describe your spot'
                                />
                                {submitted && validations.description && <p className='form-error'>{validations.description}</p>}
                            </div>

                            <div className='field'>
                                <label className='form-label'>Price per Night (USD)</label>
                                <input
                                    type='number'
                                    className='form-input'
                                    name='price'
                                    value={price}
                                    onChange={handleInputChange}
                                    placeholder='Price per night'
                                />
                                {submitted && validations.price && <p className='form-error'>{validations.price}</p>}
                            </div>
                        </div>

                        <button type='submit' className='submit-btn'>Update Spot</button>
                    </form>
                </div>
            </>
        )
    );
};



export default UpdateSpot
