import { useState } from 'react';

const Star = ({ filled, half, size = 'md', onClick, onHover, onLeave }) => {
  const sizes = { sm: 'w-3 h-3', md: 'w-5 h-5', lg: 'w-7 h-7' };
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`${sizes[size]} transition-transform hover:scale-125 focus:outline-none`}
      style={{ color: filled || half ? '#fbbf24' : '#3a3a3a' }}
    >
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </button>
  );
};

const StarRating = ({ value = 0, max = 5, interactive = false, onChange, size = 'md' }) => {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  if (!interactive) {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(max)].map((_, i) => (
          <Star key={i} filled={i < Math.floor(display)} size={size} />
        ))}
        {value > 0 && (
          <span className="ml-1.5 text-sm text-yellow-400 font-semibold">{Number(value).toFixed(1)}</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
      {[...Array(max)].map((_, i) => (
        <Star
          key={i}
          filled={i < display}
          size={size}
          onClick={() => onChange?.(i + 1)}
          onHover={() => setHovered(i + 1)}
        />
      ))}
    </div>
  );
};

export default StarRating;
