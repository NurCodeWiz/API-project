import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { thunkCreateSpot,thunkCreateSpotImage, spotUpdateThunk} from '../../store/spots';
import './CreateSpot.css';

const CreateSpot= ({ existingSpot }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { spotId } = useParams();
    // if existingSpot was truthy, !!existingSpot becomes true.
    const isUpdating = !!existingSpot;
    // Form state initialization
    const [spotDetails, setSpotDetails] = useState({
        country: existingSpot?.country || '',
        address: existingSpot?.address || '',
        city: existingSpot?.city || '',
        state: existingSpot?.state || '',
        lat: existingSpot?.lat || '',
        lng: existingSpot?.lng || '',
        description: existingSpot?.description || '',
        name: existingSpot?.name || '',
        price: existingSpot?.price || '',
        imgUrls: existingSpot?.SpotImages?.map(image => image.url) || Array(5).fill('')
      });
      const [validations, setValidations] = useState({});
      const [submitted, setSubmitted] = useState(false);


        useEffect(() => {
            const newValidations = {};


            if (!spotDetails.country.trim()) newValidations.country = 'Country is required';
            if (!spotDetails.address.trim()) newValidations.address = 'Address is required';
            if (!spotDetails.city.trim()) newValidations.city = 'City is required';
            if (!spotDetails.state.trim()) newValidations.state = 'State is required';
            if (!spotDetails.name.trim()) newValidations.name = 'Name is required';
            if (!spotDetails.price) newValidations.price = 'Price per night is required';
            else if (Number(spotDetails.price) < 0) newValidations.price = 'Price must be a positive value';


            if (spotDetails.description.length < 30) newValidations.description = 'Description needs at least 30 characters';


            const lat = parseFloat(spotDetails.lat);
            if (isNaN(lat) || lat < -90 || lat > 90) newValidations.lat = 'Latitude must be between -90 and 90';

            const lng = parseFloat(spotDetails.lng);
            if (isNaN(lng) || lng < -180 || lng > 180) newValidations.lng = 'Longitude must be between -180 and 180';


            spotDetails.imgUrls.forEach((url, index) => {
              if (url && !url.match(/\.(jpeg|jpg|png)$/i)) {
                newValidations[`img${index}`] = 'Image URL must end with .png, .jpg, or .jpeg';
              }
            });


            if (spotDetails.imgUrls.every(url => !url.trim())) {
              newValidations.img0 = 'At least one image is required and must end with .png, .jpg, or .jpeg.';
            }

            setValidations(newValidations);
          }, [spotDetails]);



    //   const handleInputChange = (e, index) => {
    //     const { name, value } = e.target;
    //     if(name.startsWith('img')) {

    //       setSpotDetails(prevDetails => {
    //         const updatedImgUrls = [...prevDetails.imgUrls];
    //         updatedImgUrls[index] = value;
    //         return { ...prevDetails, imgUrls: updatedImgUrls };
    //       });
    //     } else {
    //       setSpotDetails(prevDetails => ({ ...prevDetails, [name]: value }));
    //     }
    //   };
    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        if(name.startsWith('img')) {
            const updatedImgUrls = [...spotDetails.imgUrls];
            updatedImgUrls[index] = value;
            setSpotDetails({ ...spotDetails, imgUrls: updatedImgUrls });
        } else {
            setSpotDetails({ ...spotDetails, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        if (Object.keys(validations).length === 0) {
          const { imgUrls, ...spotData } = spotDetails;

          try {

            let spot;
            if (!isUpdating) {
              spot = await dispatch(thunkCreateSpot(spotData));
            } else {

              spot = await dispatch(spotUpdateThunk({ ...spotData, id: spotId }));
            }

            // If spot creation (or update) was successful and there are images to upload
            if (spot && imgUrls.length > 0 && !isUpdating) {
              await dispatch(thunkCreateSpotImage(spot.id, imgUrls.filter(url => url)));
            }


            navigate(`/spots/${spot.id}`);
          } catch (error) {

            console.error("Failed to create or update spot:", error);

          }
        }
      };

      return (
        <div className='Form-container'>
          <form className='Form' onSubmit={handleSubmit}>
            <h2>Where&apos;s your place located?</h2>
            <p>Guests will only get your exact address once they booked a reservation.</p>
            <div className="field">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={spotDetails.country}
                onChange={(e) => handleInputChange(e)}
                placeholder="Country"
              />
              {submitted && validations.country && <p className="error">{validations.country}</p>}
            </div>

            <div className="field">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={spotDetails.address}
                onChange={(e) => handleInputChange(e)}
                placeholder="Address"
              />
              {submitted && validations.address && <p className="error">{validations.address}</p>}
            </div>

            <div className="field">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={spotDetails.city}
                onChange={(e) => handleInputChange(e)}
                placeholder="City"
              />
              {submitted && validations.city && <p className="error">{validations.city}</p>}
            </div>

            <div className="field">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={spotDetails.state}
                onChange={(e) => handleInputChange(e)}
                placeholder="State"
              />
              {submitted && validations.state && <p className="error">{validations.state}</p>}
            </div>

            <div className="field">
              <label>Latitude</label>
              <input
                type="text"
                name="lat"
                value={spotDetails.lat}
                onChange={(e) => handleInputChange(e)}
                placeholder="Latitude"
              />
              {submitted && validations.lat && <p className="error">{validations.lat}</p>}
            </div>

            <div className="field">
              <label>Longitude</label>
              <input
                type="text"
                name="lng"
                value={spotDetails.lng}
                onChange={(e) => handleInputChange(e)}
                placeholder="Longitude"
              />
              {submitted && validations.lng && <p className="error">{validations.lng}</p>}
            </div>
            <hr></hr>
            <h2>Describe your place to guests</h2>
            <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
            <div className="field">
              <label>Description</label>
              <textarea
                name="description"
                value={spotDetails.description}
                onChange={(e) => handleInputChange(e)}
                placeholder="Please write at least 30 characters"
              />
              {submitted && validations.description && <p className="error">{validations.description}</p>}
            </div>

            <div className="field">
            <hr></hr>
            <h2>Create a title for your spot</h2>
            <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={spotDetails.name}
                onChange={(e) => handleInputChange(e)}
                placeholder="Name of the spot"
              />
              {submitted && validations.name && <p className="error">{validations.name}</p>}
            </div>

            <div className="field">
              <h2>Set a base price for your spot</h2>
              <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
              <label>Price per night (USD)</label>
               <input
                type="number"
                name="price"
                value={spotDetails.price}
                onChange={(e) => handleInputChange(e)}
                placeholder="Price per night (USD)"
              />
              {submitted && validations.price && <p className="error">{validations.price}</p>}
            </div>
            <hr></hr>
            <h2>Liven up your spot with photos</h2>
            <p>Submit a link to at least one photo to publish your spot</p>
            {spotDetails.imgUrls.map((url, index) => (
              <div className="field" key={index}>
                <label>Image URL {index + 1}</label>
                <input
                  type="text"
                  name={`img${index}`}
                  placeholder={index === 0 ? "Preview Image URL" : `Image URL`}
                  value={url}
                  onChange={(e) => handleInputChange(e, index)}
                />
                {submitted && validations[`img${index}`] && <p className="error">{validations[`img${index}`]}</p>}
              </div>
            ))}

            <button type="submit">{isUpdating ? 'Update Spot' : 'Create Spot'}</button>
          </form>
        </div>
      );
}
export default CreateSpot
