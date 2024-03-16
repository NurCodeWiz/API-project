import { csrfFetch } from './csrf';

const CREATE_SPOT = '/spots/CREATE_SPOT';
const UPDATE_SPOT_IMAGE = '/spots/UPDATE_IMAGE'
const CREATE_SPOT_IMAGE = '/spots/CREATE_SPOT_IMAGE'
const UPDATE_SPOT = '/spots/UPDATE_SPOT'
// Action creator for creating a spot
export const createSpot = (spot) => ({
  type: CREATE_SPOT,
  spot,
});
export const updateSpot = (spot) => ({
   type: UPDATE_SPOT,
   spot,
});
export const createSpotImage = (spotId, imageUrl) => ({
    type: CREATE_SPOT_IMAGE,
    spotId,
    imageUrl,
  });

// Thunk action creator for creating a new spot
export const thunkCreateSpot = (spot) => async (dispatch) => {
  const response = await csrfFetch('/api/spots', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(spot),
  });

  if (response.ok) {
    const createdSpot = await response.json();
    dispatch(createSpot(createdSpot));
    return createdSpot;
  } else {
    const error = await response.json();
    throw new Error(error.message || 'Error creating new spot');
  }
};

// Thunk action creator for uploading images associated with a spot
// export const thunkCreateSpotImage = (spotId, imageUrls) => async (dispatch) => {
//   for (let imageUrl of imageUrls) {
//     const response = await csrfFetch(`/api/spots/${spotId}/images`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ url: imageUrl }),
//     });

//     // if (!response.ok) {
//     //   const error = await response.json();
//     //   throw new Error(error.message || 'Failed to upload image');
//     // }
//     if (response.ok) {
//         const spot = await response.json()
//         dispatch(thunkCreateSpotImage(spot))

//     } else {
//         const error = await response.json()
//         return error
//     }
//   }
// };
export const thunkCreateSpotImage = (spotId, imageUrls) => async (dispatch) => {
    const promises = imageUrls.map(async (imageUrl) => {
      const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imageUrl }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload image');
      }
      return response.json(); // Assuming you need the response
    });

    const images = await Promise.all(promises);
    images.forEach(image => dispatch(createSpotImage(spotId, image.url))); // Assuming image structure
  };

export const updateExistingSpot = (newSpot, preSpot) => async (dispatch) => {

    // console.log(newSpot, 'new spot')
    const response = await csrfFetch(`/api/spots/${preSpot.id}`, {
        method: 'PUT',
        body: JSON.stringify(newSpot)
   })
    if(response.ok){
        const data = await response.json();
        dispatch(updateSpot(data))

        if(preSpot.SpotImages) {
            preSpot.SpotImages.forEach(async(img) => {
                await csrfFetch(`/api/spot-images/${img.id}`, {
                    method: 'DELETE'
                })
            })
            newSpot.SpotImages.map(img => {
                csrfFetch(`/api/spots/${data.id}/images`, {
                    method: 'POST',
                    body: JSON.stringify({
                        url: img.url
                    })
                })
            })
        }

        return data;
    }
    if(!response.ok){
        console.error('Error, could not update spot')
    }
}




const spotsReducer = (state = {}, action) => {
    switch (action.type) {
      case CREATE_SPOT:{
        return { ...state, [action.spot.id]: action.spot };
      }
      case UPDATE_SPOT_IMAGE: {
        return { ...state, [action.spot.id]: action.spot}
    }
      case CREATE_SPOT_IMAGE: {
        return { ...state, [action.spot.id]: action.spot }
    }
    case UPDATE_SPOT: {
        return { ...state, [action.spot.id]: action.spot };
    }


      default:
        return state;
    }
  };
export default spotsReducer
