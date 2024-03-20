import { csrfFetch } from "./csrf"
const ALL_REVIEWS = '/reviews/ALL_REVIEWS'
const ADD_REVIEW = 'reviews/ADD_REVIEW';
const DELETE_REVIEW = '/reviews/DELETE_REVIEWS'


export const loadReviews = (reviews) => ({
    type: ALL_REVIEWS,
    reviews
})
export const addReviewToSpot = (review) => ({
  type: ADD_REVIEW,
  review,
});
export const deleteReview = (reviewId) => {
    return{
        type: DELETE_REVIEW,
        reviewId
    }
}

// Thunk Action

export const getReviews = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)

    if (response.ok) {
        const data = await response.json()
        console.log("loadReviews", data)
        dispatch(loadReviews(data))
        //return data
    }
}
export const submitReviewForSpot = (spotId, review) => async (dispatch) => {
  console.log("log: ", review)
  try {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    });

    if (res.ok) {
      const newReview = await res.json();
      dispatch(addReviewToSpot(newReview));
      console.log('add review====>>>>',newReview)
      return newReview;
    } else {

      console.error('Failed to submit review');
    }
  } catch (error) {
    console.error('Error submitting new review:', error);
    throw new Error('Submission of new review failed.');
  }

};

export const deleteReviewThunk = (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    })

    if (response.ok) {
        dispatch(deleteReview(reviewId))
    }
}

//reducer
function reviewReducer (state ={}, action){
    switch(action.type){
        case ALL_REVIEWS: {
            const newState = {}
            action.reviews.Reviews.forEach((review) => (newState[review.id] = review))
            console.log('reviewReducer',newState)
            return newState
        }

        case ADD_REVIEW: {
            return {...state, [action.review.id]: action.review}
        }
        case DELETE_REVIEW: {
            const newState = { ...state };
            delete newState[action.reviewId];
            return newState
        }
    default:
        return state;
    }
}

export default reviewReducer;
