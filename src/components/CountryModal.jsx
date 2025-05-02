import React from 'react';
import './CountryModal.css';

function CountryModal({ offset, countries, isVisible, onClose }) {
  if (!isVisible) return null;

  // Helper function to format offset for the title
  const formatOffset = (off) => {
    if (off === 0) return 'UTC';
    return `UTC${off > 0 ? '+' : ''}${off}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}> {/* Prevent closing when clicking inside */}
        <h2>{formatOffset(offset)} - Locations</h2>
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        <ul>
          {countries.length > 0 ? (
            countries.map((country) => (
              <li key={country.code + country.name}> {/* Add unique key */}
                <img
                  src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`} // Use flagcdn URL (w40 = 40px width)
                  alt={`Flag of ${country.name}`}
                  className="flag-image" // Use a class for styling
                />
                {country.name}
              </li>
            ))
          ) : (
            <li>No specific examples available for this offset.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default CountryModal; 