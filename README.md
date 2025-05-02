# World Timezone

A simple interactive React application to visualize and compare times across different UTC offsets.

## Features

*   Displays 24 timezone inputs (UTC-11 to UTC+12) in a 4x6 grid.
*   Interactively update the time in one timezone, and all others update accordingly.
*   Dynamic background colors for each timezone block based on the local hour (Day/Dawn/Dusk/Night).
*   "Sync to Live Time" button to set all timezones to the current time.
*   Hover over a timezone block to see example countries/regions for that UTC offset.
*   Dark theme UI.

## Running the Project

1.  **Prerequisites:**
    *   Node.js (which includes npm)
    *   pnpm (Install with `npm install -g pnpm` if you don't have it)

2.  **Clone the repository (if applicable):**
    ```bash
    # git clone <repository-url>
    # cd world-timezone
    ```

3.  **Install dependencies:**
    ```bash
    pnpm install
    ```

4.  **Start the development server:**
    ```bash
    pnpm dev
    ```

    The application should now be running on `http://localhost:5173` (or the next available port).

## Technologies Used

*   React
*   Vite
*   CSS
*   pnpm
