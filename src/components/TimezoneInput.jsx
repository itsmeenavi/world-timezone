import React, { useState, useEffect } from 'react';

// Helper function to format offset (e.g., +5, -3, 0)
const formatOffset = (offset) => {
    if (offset === 0) return 'UTC';
    return `UTC${offset > 0 ? '+' : ''}${offset}`;
};

// Helper to format time as HH:mm
const formatTime = (date, offset) => { // Added offset parameter
    if (!(date instanceof Date) || isNaN(date)) {
        return '--:--'; // Return placeholder if date is invalid
    }
    // IMPORTANT: We need UTC hours/minutes *after* applying the offset logically
    // to correctly display the time in that zone *without* being affected by the browser's local TZ setting.
    const localTime = new Date(date.getTime() + offset * 3600 * 1000);
    const hours = String(localTime.getUTCHours()).padStart(2, '0');
    const minutes = String(localTime.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

// Function to get background color based on the hour (0-23)
const getBackgroundColorForHour = (hour) => {
    if (hour < 6 || hour >= 21) { // Night (e.g., 9 PM to 6 AM)
        return '#4a5568'; // Dark blue-gray
    } else if (hour < 8 || hour >= 18) { // Dawn / Dusk (e.g., 6 AM - 8 AM, 6 PM - 9 PM)
        return '#a0aec0'; // Medium gray
    } else { // Daytime (e.g., 8 AM to 6 PM)
        return '#edf2f7'; // Light gray
    }
};

// Function to get text color based on the hour for contrast
const getTextColorForHour = (hour) => {
    if (hour < 6 || hour >= 21) { // Night
        return '#ffffff'; // White text
    }
    return '#2d3748'; // Dark text for day/dawn/dusk
};

function TimezoneInput({ offset, referenceTime, onTimeChange }) {
    const [displayTime, setDisplayTime] = useState('');

    // Calculate and format local time whenever referenceTime or offset changes
    useEffect(() => {
        if (referenceTime instanceof Date && !isNaN(referenceTime)) {
             setDisplayTime(formatTime(referenceTime, offset)); // Pass referenceTime and offset
        } else {
             setDisplayTime('--:--');
        }
    }, [referenceTime, offset]); // Dependency includes offset


    // Handle changes in the input field
    const handleInputChange = (event) => {
        const inputVal = event.target.value; // e.g., "14:30"
        setDisplayTime(inputVal); // Update display immediately for responsiveness

        // Attempt to parse the input time
        const timeParts = inputVal.match(/^(\d{1,2}):(\d{1,2})$/);
        if (timeParts) {
            const hours = parseInt(timeParts[1], 10);
            const minutes = parseInt(timeParts[2], 10);

            if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
                const newTime = new Date(referenceTime); // Clone reference time
                // Calculate the UTC hour corresponding to the input local hour
                let utcHour = hours - offset;
                newTime.setUTCHours(utcHour, minutes, 0, 0);
                onTimeChange(newTime);
            }
        }
    };

    // Determine colors based on the *current* reference time's hour in this timezone
    let currentLocalHour = -1;
    if (referenceTime instanceof Date && !isNaN(referenceTime)){
         const localTime = new Date(referenceTime.getTime() + offset * 3600 * 1000);
         currentLocalHour = localTime.getUTCHours(); // Get the hour in the specific timezone
    }
    const backgroundColor = currentLocalHour !== -1 ? getBackgroundColorForHour(currentLocalHour) : '#e2e8f0';
    const textColor = currentLocalHour !== -1 ? getTextColorForHour(currentLocalHour) : '#000000';

    return (
        <div className="timezone-input" style={{ backgroundColor: backgroundColor, color: textColor }}>
            <label>{formatOffset(offset)}</label>
            <input
                type="time"
                value={displayTime}
                onChange={handleInputChange}
                 // Adjust border color for better contrast on dark backgrounds
                 // Text color is inherited via `color: inherit` in CSS
                style={{ border: `1px solid ${textColor === '#ffffff' ? '#aaa' : '#777'}` }}
            />
        </div>
    );
}

export default TimezoneInput; 