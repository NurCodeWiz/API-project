import { csrfFetch } from './csrf';

const CREATE_SPOT = '/spots/CREATE_SPOT';
const UPDATE_SPOT_IMAGE = '/spots/UPDATE_IMAGE'
const CREATE_SPOT_IMAGE = '/spots/CREATE_SPOT_IMAGE'
const UPDATE_SPOT = '/spots/UPDATE_SPOT'
const SET_SPOTS = 'spots/SET_SPOTS';
const SET_SPECIFIC_SPOT = 'spots/SET_SPECIFIC_SPOT';
// Action creator for creating a spot
export const setSpots = (spots) => ({
    type: SET_SPOTS,
    spots
});
export const setSpecificSpot = (spot) => ({
    type: SET_SPECIFIC_SPOT,
    spot,
});

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

export const fetchSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots');

    if (response.ok) {
        const spotsData = await response.json();
        console.log('API spotsData:', spotsData);

        dispatch(setSpots(spotsData));
        return spotsData
    }
}

export const fetchSpecificSpot = (spotId) => async (dispatch) => {
    // try {
    //   const response = await csrfFetch(`/api/spots/${spotId}`);
    //   if (response.ok) {
    //     const spot = await response.json();
    //     console.log('API spot:', spot);
    //     dispatch(setSpecificSpot(spot));
    //   } else {
    //     // Handle error response
    //     const error = await response.json();
    //     throw new Error(error.message || 'Could not fetch spot details');
    //   }
    // } catch (error) {
    //   console.error('Fetch specific spot error:', error);

    // }
    const response = await csrfFetch(`/api/spots/${spotId}`)

    if (response.ok) {
        const spot = await response.json()
        console.log('API spot:', spot);
        dispatch(setSpecificSpot(spot))
    }
};

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


export const thunkCreateSpotImage = (spotId, images) => async (dispatch) => {
    console.log('spotId========>>>', spotId)
    console.log('images=========>>>', images)

    const imgArray = []
    for (let image of images) {
        const response = await csrfFetch(`/api/spots/${spotId}/images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: image, preview: true })
        })

        if (response.ok) {
            const spot = await response.json()
            dispatch(createSpotImage (spot))
            imgArray.push(image)
        } else {
            const error = await response.json()
            return error
        }
    }
}

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
        case SET_SPOTS:{
            const newState = {};
            console.log("HEYS", action)
            if (Array.isArray(action.spots.Spots)) {
                action.spots.Spots.forEach(spot => newState[spot.id] = spot);
            } else {
                console.error('SET_SPOTS action.payload is not an array:', action.payload);
            }
            return newState;
        }
        case SET_SPECIFIC_SPOT:{
            return {...state, [action.spot.id]: action.spot };
        }
        case CREATE_SPOT:{
            return { ...state, [action.spot.id]: action.spot };
        }
        case UPDATE_SPOT_IMAGE: {
            return { ...state, [action.spot.id]: action.spot}
        }
        // case CREATE_SPOT_IMAGE: {
        //     return { ...state, [action.spot.id]: action.spot }
        // }
        case UPDATE_SPOT: {
            return { ...state, [action.spot.id]: action.spot };
    }
    default:
      return state;
    }
  };
export default spotsReducer
