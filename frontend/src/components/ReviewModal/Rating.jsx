import { useState } from 'react';
import { FaStar } from "react-icons/fa";
import './Rating.css';

const StarRating = ({ currentRating, onStarSelected }) => {
  const [hoveredStar, setHoveredStar] = useState(0);

  // Function to manage hover state for stars
  const handleStarHover = (index) => {
    setHoveredStar(index);
  };

  // Array to represent star ratings (1-5)
  const starIndices = [1, 2, 3, 4, 5];

  return (
    <div className='stars-wrapper'>
      {starIndices.map(index => (
        <span
          key={index}
          className={index <= (currentRating || hoveredStar) ? 'star-filled' : 'star-empty'}
          onMouseEnter={() => handleStarHover(index)}
          onMouseLeave={() => handleStarHover(0)}
          onClick={() => onStarSelected(index)}
        >
          <FaStar />
        </span>
      ))}
      <span className='rating-label'>Stars</span>
    </div>
  );
};

export default StarRating;
