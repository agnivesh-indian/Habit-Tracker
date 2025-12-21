# Habit Tracker

A simple, static web application for tracking habits, displaying descriptive statistics, and identifying correlations.

## Project Overview

This application allows users to track their habits, define goals, and gain a deeper understanding of their patterns and consistency. It features a robust statistics engine to calculate completion rates, consistency, and trends, as well as a basic correlation analysis. The UI is built using plain HTML, CSS, and JavaScript, making it lightweight and easy to deploy as a static website.

## Features

-   **Descriptive Statistics:**
    -   **Mean Completion Rate:** The average completion rate of a habit.
    -   **Standard Deviation:** A measure of habit consistency.
    -   **Trend Velocity:** The percentage change in completion rate over time.
    -   **Correlation Analysis:** Insights into how different habits influence each other.
-   **Navigation:** Simple client-side routing for Home and Habit Detail views.
-   **UI:** Clean and functional UI using basic CSS.

## Tech Stack

-   **Frontend:** HTML5, CSS3, JavaScript (ES6+)
-   **Statistics Engine:** Pure JavaScript
-   **Visualizations:** (Placeholders for now, can be implemented with charting libraries like Chart.js or D3.js)

## Installation and Usage

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/<your-username>/Habit-Tracker.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd Habit-Tracker
    ```
3.  **Open `index.html`:**
    Simply open the `index.html` file in your web browser. You can also deploy this directory to any static web hosting service (e.g., GitHub Pages).

## Folder Structure

```
/
├── index.html
├── style.css
├── script.js
├── statsEngine.js
├── README.md
└── .gitignore
```

## Habit Object Interface (Conceptual)

While this is a pure JavaScript project, here's a conceptual TypeScript-like interface for the `Habit` and `HabitLog` objects used internally:

```typescript
interface HabitLog {
  date: string; // 'YYYY-MM-DD'
  value?: number; // For cumulative habits
  completed?: boolean; // For daily habits
}

interface Habit {
  id: string;
  name: string;
  category: string;
  goalType: 'daily' | 'cumulative';
  goalAmount?: number; // For cumulative habits
  logs: HabitLog[];
}
```
