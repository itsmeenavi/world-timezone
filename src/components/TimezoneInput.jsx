import React, { useState, useEffect } from 'react';
import CountryModal from './CountryModal'; // Import the modal component

// Simple mapping of UTC offsets to example countries/regions
// Note: This is not exhaustive and doesn't account for DST variations precisely
// Structure: { name: 'Country Name', code: 'ISO 3166-1 alpha-2 code' }
const offsetToCountries = {
    // Note: DST is not accounted for here, offsets are standard time
  '-11': [{ name: 'American Samoa', code: 'AS' }, { name: 'Niue', code: 'NU' }, { name: 'USA (Midway Atoll)', code: 'US' }],
  '-10': [{ name: 'USA (Hawaii)', code: 'US' }, { name: 'French Polynesia (Society Islands)', code: 'PF' }, { name: 'Cook Islands', code: 'CK' }, { name: 'USA (Aleutian Islands - West)', code: 'US' }],
  '-9': [{ name: 'USA (Alaska - Mainland)', code: 'US' }, {name: 'French Polynesia (Gambier Is.)', code: 'PF'}],
  '-8': [{ name: 'USA (Pacific - CA, WA, OR etc.)', code: 'US' }, { name: 'Canada (Pacific - BC)', code: 'CA' }, { name: 'Mexico (Baja California)', code: 'MX' }, { name: 'Pitcairn Islands', code: 'PN' }],
  '-7': [{ name: 'USA (Mountain - AZ*, CO, UT etc.)', code: 'US' }, { name: 'Canada (Mountain - AB)', code: 'CA' }, { name: 'Mexico (Chihuahua, Sonora)', code: 'MX' }],
  '-6': [{ name: 'USA (Central - IL, TX etc.)', code: 'US' }, { name: 'Canada (Central - MB, SK*)', code: 'CA' }, { name: 'Mexico (Central)', code: 'MX' }, { name: 'Guatemala', code: 'GT' }, { name: 'El Salvador', code: 'SV' }, { name: 'Costa Rica', code: 'CR' }, { name: 'Belize', code: 'BZ' }],
  '-5': [{ name: 'USA (Eastern - NY, FL etc.)', code: 'US' }, { name: 'Canada (Eastern - ON, QC)', code: 'CA' }, { name: 'Colombia', code: 'CO' }, { name: 'Peru', code: 'PE' }, { name: 'Cuba', code: 'CU' }, { name: 'Jamaica', code: 'JM' }, { name: 'Ecuador', code: 'EC' }, { name: 'Haiti', code: 'HT' }, { name: 'Panama', code: 'PA' }],
  '-4': [{ name: 'Venezuela', code: 'VE' }, { name: 'Bolivia', code: 'BO' }, { name: 'Puerto Rico', code: 'PR' }, { name: 'Canada (Atlantic - NS, NB)', code: 'CA' }, { name: 'Barbados', code: 'BB' }, { name: 'Dominican Republic', code: 'DO' }, { name: 'Guyana', code: 'GY' }, { name: 'Trinidad and Tobago', code: 'TT' }],
  '-3': [{ name: 'Brazil (East, Nordeste)', code: 'BR' }, { name: 'Argentina', code: 'AR' }, { name: 'Chile (Continental)', code: 'CL' }, { name: 'Greenland (West)', code: 'GL' }, { name: 'Uruguay', code: 'UY' }, { name: 'Paraguay', code: 'PY' }, { name: 'Suriname', code: 'SR' }],
  '-2': [{ name: 'Brazil (Fernando de Noronha)', code: 'BR' }, { name: 'South Georgia/Sandwich Is.', code: 'GS' }], // Few landmasses
  '-1': [{ name: 'Azores (Portugal)', code: 'PT' }, { name: 'Cape Verde', code: 'CV' }, { name: 'Greenland (Scoresbysund)', code: 'GL' }],
  '0': [{ name: 'United Kingdom', code: 'GB' }, { name: 'Ireland', code: 'IE' }, { name: 'Portugal', code: 'PT' }, { name: 'Iceland', code: 'IS' }, { name: 'Ghana', code: 'GH' }, { name: 'Senegal', code: 'SN' }, { name: 'Morocco', code: 'MA' }, { name: 'Liberia', code: 'LR' }, { name: 'Mali', code: 'ML' }],
  '1': [{ name: 'Germany', code: 'DE' }, { name: 'France', code: 'FR' }, { name: 'Spain', code: 'ES' }, { name: 'Italy', code: 'IT' }, { name: 'Nigeria', code: 'NG' }, { name: 'Poland', code: 'PL' }, { name: 'Algeria', code: 'DZ' }, { name: 'Norway', code: 'NO' }, { name: 'Sweden', code: 'SE' }, { name: 'Netherlands', code: 'NL' }],
  '2': [{ name: 'Greece', code: 'GR' }, { name: 'South Africa', code: 'ZA' }, { name: 'Egypt', code: 'EG' }, { name: 'Finland', code: 'FI' }, { name: 'Ukraine', code: 'UA' }, { name: 'Romania', code: 'RO' }, { name: 'Israel', code: 'IL' }, { name: 'Libya', code: 'LY' }, { name: 'Bulgaria', code: 'BG' }],
  '3': [{ name: 'Russia (Moscow)', code: 'RU' }, { name: 'Saudi Arabia', code: 'SA' }, { name: 'Kenya', code: 'KE' }, { name: 'Turkey', code: 'TR' }, { name: 'Iraq', code: 'IQ' }, { name: 'Ethiopia', code: 'ET' }, { name: 'Qatar', code: 'QA' }, { name: 'Madagascar', code: 'MG' }, { name: 'Belarus', code: 'BY' }],
  '4': [{ name: 'UAE (Dubai)', code: 'AE' }, { name: 'Oman', code: 'OM' }, { name: 'Georgia', code: 'GE' }, { name: 'Armenia', code: 'AM' }, { name: 'Azerbaijan', code: 'AZ' }, { name: 'Mauritius', code: 'MU' }, { name: 'Seychelles', code: 'SC' }, { name: 'Russia (Samara)', code: 'RU' }],
  '5': [{ name: 'Pakistan', code: 'PK' }, { name: 'Uzbekistan', code: 'UZ' }, { name: 'Maldives', code: 'MV' }, { name: 'Turkmenistan', code: 'TM' }, { name: 'Kazakhstan (West)', code: 'KZ' }, { name: 'Tajikistan', code: 'TJ' }],
  '6': [{ name: 'Bangladesh', code: 'BD' }, { name: 'Kazakhstan (East)', code: 'KZ' }, { name: 'Bhutan', code: 'BT' }, { name: 'Kyrgyzstan', code: 'KG' }, { name: 'Russia (Omsk)', code: 'RU' }],
  '7': [{ name: 'Thailand', code: 'TH' }, { name: 'Vietnam', code: 'VN' }, { name: 'Indonesia (West)', code: 'ID' }, { name: 'Cambodia', code: 'KH' }, { name: 'Laos', code: 'LA' }, { name: 'Russia (Krasnoyarsk)', code: 'RU' }, { name: 'Mongolia (West)', code: 'MN' }],
  '8': [{ name: 'China', code: 'CN' }, { name: 'Singapore', code: 'SG' }, { name: 'Philippines', code: 'PH' }, { name: 'Australia (West)', code: 'AU' }, { name: 'Malaysia', code: 'MY' }, { name: 'Taiwan', code: 'TW' }, { name: 'Hong Kong', code: 'HK' }, { name: 'Mongolia (East)', code: 'MN' }],
  '9': [{ name: 'Japan', code: 'JP' }, { name: 'South Korea', code: 'KR' }, { name: 'Indonesia (East)', code: 'ID' }, { name: 'Palau', code: 'PW' }, { name: 'Russia (Yakutsk)', code: 'RU' }, { name: 'Timor-Leste', code: 'TL' }],
  '10': [{ name: 'Australia (East - QLD, NSW, VIC)', code: 'AU' }, { name: 'Papua New Guinea', code: 'PG' }, { name: 'Guam', code: 'GU' }, { name: 'Micronesia (Chuuk, Yap)', code: 'FM' }, { name: 'Russia (Vladivostok)', code: 'RU' }],
  '11': [{ name: 'Solomon Islands', code: 'SB' }, { name: 'Vanuatu', code: 'VU' }, { name: 'New Caledonia', code: 'NC' }, { name: 'Micronesia (Pohnpei, Kosrae)', code: 'FM' }, { name: 'Russia (Magadan)', code: 'RU' }, { name: 'Australia (Lord Howe Island)', code: 'AU' }], // Lord Howe is UTC+10:30 but shifts to +11 for DST
  '12': [{ name: 'New Zealand', code: 'NZ' }, { name: 'Fiji', code: 'FJ' }, { name: 'Kiribati (Gilbert Islands)', code: 'KI' }, { name: 'Tuvalu', code: 'TV' }, { name: 'Nauru', code: 'NR' }, { name: 'Russia (Kamchatka)', code: 'RU' }, { name: 'Marshall Islands', code: 'MH' }],
};

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
    const [isModalVisible, setIsModalVisible] = useState(false); // State for modal

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

    // Get country data for this offset
    const countryData = offsetToCountries[String(offset)] || [];

    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    return (
        <> {/* Wrap in fragment to allow modal sibling */}
        <div className="timezone-input" style={{ backgroundColor: backgroundColor, color: textColor }} onClick={handleOpenModal} >
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
        <CountryModal
            offset={offset}
            countries={countryData}
            isVisible={isModalVisible}
            onClose={handleCloseModal}
            />
        </>
    );
}

export default TimezoneInput; 