import React, { useState, useCallback } from 'react';
import TimezoneInput from './components/TimezoneInput';
import './App.css'; // Assuming you have some basic styles

function App() {
  // Initialize with current time in UTC
  const [referenceTime, setReferenceTime] = useState(new Date());

  // Generate 24 timezone offsets: UTC-11 to UTC+12
  const timezoneOffsets = Array.from({ length: 24 }, (_, i) => i - 11);

  // Handler function to update the reference time
  // It receives the new time (as Date obj) calculated from a specific input's offset
  const handleTimeChange = useCallback((newTimeUtc) => {
    // Disable live sync if manual change occurs
    // TODO: Maybe add a state variable like isLive? For now, just updating resets.
    // setIsLive(false);

    if (newTimeUtc instanceof Date && !isNaN(newTimeUtc)) {
        setReferenceTime(newTimeUtc);
    } else {
        console.error("Invalid date received:", newTimeUtc);
    }
  }, []);

  // Function to set reference time to the current time
  const syncToLive = () => {
    setReferenceTime(new Date());
    // Optionally, re-enable live sync state if implemented:
    // setIsLive(true);
  };

  return (
    <> {/* Fragment to hold title and container */}
      <h1>World Timezone</h1>
      <button onClick={syncToLive} className="live-sync-button">Sync to Live Time</button>
    <div className="app-container">
      <div className="timezones-grid">
        {timezoneOffsets.map(offset => (
          <TimezoneInput
            key={offset}
            offset={offset} // Pass offset
            referenceTime={referenceTime}
            onTimeChange={handleTimeChange}
          />
        ))}
      </div>
       {/* Display the reference UTC time for debugging/clarity */}
       <div className="utc-debug-time" title={referenceTime.toISOString()}>
         Reference UTC Time: {referenceTime.toISOString()}
       </div>
    </div>
    <footer>
        Created by <a href="https://github.com/itsmeenavi" target="_blank" rel="noopener noreferrer">
          itsmeenavi
        </a>
    </footer>
    </>
  );
}

export default App;
