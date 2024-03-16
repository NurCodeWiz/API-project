import { csrfFetch } from './csrf';

const CREATE_SPOT = '/spots/CREATE_SPOT';

// Action creator for creating a spot
export const createSpot = (spot) => ({
  type: CREATE_SPOT,
  spot,
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
export const thunkCreateSpotImage = (spotId, imageUrls) => async (dispatch) => {
  for (let imageUrl of imageUrls) {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: imageUrl }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload image');
    }
  }
};


const spotsReducer = (state = {}, action) => {
    switch (action.type) {
      case CREATE_SPOT:
        return { ...state, [action.spot.id]: action.spot };
      default:
        return state;
    }
  };
export default spotsReducer
