import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { thunkCreateSpot,thunkCreateSpotImage, updateExistingSpot} from '../../store/spots';
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
        imgUrls: existingSpot?.SpotImages?.map(image => image.url) || ['']
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



      const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        if(name.startsWith('img')) {
          // Update specific image URL in the array
          setSpotDetails(prevDetails => {
            const updatedImgUrls = [...prevDetails.imgUrls];
            updatedImgUrls[index] = value;
            return { ...prevDetails, imgUrls: updatedImgUrls };
          });
        } else {
          setSpotDetails(prevDetails => ({ ...prevDetails, [name]: value }));
        }
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        if (Object.keys(validations).length === 0) {
          const { imgUrls, ...spotData } = spotDetails;

          try {
            // Check if it's updating or creating a new spot and use the appropriate thunk
            let spot;
            if (!isUpdating) {
              spot = await dispatch(thunkCreateSpot(spotData));
            } else {

              spot = await dispatch(updateExistingSpot({ ...spotData, id: spotId }));
            }

            // If spot creation (or update) was successful and there are images to upload
            if (spot && imgUrls.length > 0 && !isUpdating) {
              await dispatch(thunkCreateSpotImage(spot.id, imgUrls.filter(url => url)));
            }

            // Navigate to the newly created or updated spot's page
            navigate(`/spots/${spot.id}`);
          } catch (error) {
            // Handle any errors that occur during the spot creation or update process
            console.error("Failed to create or update spot:", error);
            // Optionally, set error messages to display to the user
          }
        }
      };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setSubmitted(true);

    //     if (!Object.keys(validations).length) {
    //         try {
    //             // Destructuring to directly pass spotDetails to thunkCreateSpot
    //             const spotData = { ...spotDetails, price: parseFloat(spotDetails.price) };
    //             // Removing imgUrls from spotData before dispatching
    //             const { imgUrls, ...spotDetailsWithoutImages } = spotData;

    //             const response = await dispatch(thunkCreateSpot(spotDetailsWithoutImages));
    //             const spot = response.payload;

    //             // Check if spot is defined and has an id
    //             if (spot && spot.id) {
    //                 // Filter out empty URLs and dispatch image upload action
    //                 const validImgUrls = imgUrls.filter(url => url.trim() !== '');
    //                 await dispatch(thunkCreateSpotImage(spot.id, validImgUrls));

    //                 // Navigate to the newly created spot's detail page
    //                 navigate(`/spots/${spot.id}`);
    //             }
    //         } catch (error) {
    //             console.error("Failed to create spot:", error);
    //             // Handle displaying the error to the user, potentially updating `validations` state with error messages
    //             // Example: setValidations({ general: 'Failed to create spot. Please try again.' });
    //         }
    //     }
    // };

      return (
        <div className='Form-container'>
          <form className='Form' onSubmit={handleSubmit}>
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

            <div className="field">
              <label>Description</label>
              <textarea
                name="description"
                value={spotDetails.description}
                onChange={(e) => handleInputChange(e)}
                placeholder="Description"
              />
              {submitted && validations.description && <p className="error">{validations.description}</p>}
            </div>

            <div className="field">
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
              <label>Price per night (USD)</label>
              <input
                type="number"
                name="price"
                value={spotDetails.price}
                onChange={(e) => handleInputChange(e)}
                placeholder="Price"
              />
              {submitted && validations.price && <p className="error">{validations.price}</p>}
            </div>

            {/* Image URL fields */}
            {spotDetails.imgUrls.map((url, index) => (
              <div className="field" key={index}>
                <label>Image URL {index + 1}</label>
                <input
                  type="text"
                  name={`img${index}`}
                  placeholder="Image URL"
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
