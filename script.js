import { calculateCompletionRate, calculateConsistency, calculateTrendVelocity, analyzeCorrelations } from './statsEngine.js';

// --- MOCK DATA ---
const allHabits = [
    {
        id: 'h1',
        name: 'Work Out',
        category: 'Health',
        goalType: 'daily',
        logs: [
            { date: '2025-11-01', completed: true },
            { date: '2025-11-02', completed: false },
            { date: '2025-11-03', completed: true },
            { date: '2025-11-04', completed: true },
            { date: '2025-11-05', completed: false },
            { date: '2025-11-06', completed: true },
            { date: '2025-11-07', completed: true },
            { date: '2025-11-08', completed: false },
            { date: '2025-11-09', completed: true },
            { date: '2025-11-10', completed: true },
            { date: '2025-11-11', completed: false },
            { date: '2025-11-12', completed: true },
            { date: '2025-11-13', completed: true },
            { date: '2025-11-14', completed: true },
            { date: '2025-11-15', completed: false },
            { date: '2025-11-16', completed: true },
            { date: '2025-11-17', completed: true },
            { date: '2025-11-18', completed: false },
            { date: '2025-11-19', completed: true },
            { date: '2025-11-20', completed: true },
            { date: '2025-11-21', completed: false },
            { date: '2025-11-22', completed: true },
            { date: '2025-11-23', completed: true },
            { date: '2025-11-24', completed: false },
            { date: '2025-11-25', completed: true },
            { date: '2025-11-26', completed: true },
            { date: '2025-11-27', completed: false },
            { date: '2025-11-28', completed: true },
            { date: '2025-11-29', completed: true },
            { date: '2025-11-30', completed: true },
        ],
    },
    {
        id: 'h2',
        name: 'Sleep 8+ hours',
        category: 'Health',
        goalType: 'daily',
        logs: [
            { date: '2025-11-01', completed: true },
            { date: '2025-11-02', completed: true },
            { date: '2025-11-03', completed: false },
            { date: '2025-11-04', completed: true },
            { date: '2025-11-05', completed: true },
            { date: '2025-11-06', completed: true },
            { date: '2025-11-07', completed: true },
            { date: '2025-11-08', completed: true },
            { date: '2025-11-09', completed: true },
            { date: '2025-11-10', completed: true },
            { date: '2025-11-11', completed: true },
            { date: '2025-11-12', completed: true },
            { date: '2025-11-13', completed: true },
            { date: '2025-11-14', completed: true },
            { date: '2025-11-15', completed: true },
            { date: '2025-11-16', completed: true },
            { date: '2025-11-17', completed: true },
            { date: '2025-11-18', completed: true },
            { date: '2025-11-19', completed: true },
            { date: '2025-11-20', completed: true },
            { date: '2025-11-21', completed: true },
            { date: '2025-11-22', completed: true },
            { date: '2025-11-23', completed: true },
            { date: '2025-11-24', completed: true },
            { date: '2025-11-25', completed: true },
            { date: '2025-11-26', completed: true },
            { date: '2025-11-27', completed: true },
            { date: '2025-11-28', completed: true },
            { date: '2025-11-29', completed: true },
            { date: '2025-11-30', completed: true },
        ],
    },
    {
        id: 'h3',
        name: 'Read 20 Pages',
        category: 'Personal Growth',
        goalType: 'cumulative',
        goalAmount: 20,
        logs: [
            { date: '2025-11-01', value: 25 },
            { date: '2025-11-02', value: 10 },
            { date: '2025-11-03', value: 20 },
            { date: '2025-11-04', value: 15 },
            { date: '2025-11-05', value: 22 },
            { date: '2025-11-06', value: 18 },
            { date: '2025-11-07', value: 30 },
            { date: '2025-11-08', value: 10 },
            { date: '2025-11-09', value: 20 },
            { date: '2025-11-10', value: 25 },
            { date: '2025-11-11', value: 12 },
            { date: '2025-11-12', value: 19 },
            { date: '2025-11-13', value: 28 },
            { date: '2025-11-14', value: 20 },
            { date: '2025-11-15', value: 15 },
            { date: '2025-11-16', value: 23 },
            { date: '2025-11-17', value: 27 },
            { date: '2025-11-18', value: 10 },
            { date: '2025-11-19', value: 20 },
            { date: '2025-11-20', value: 25 },
            { date: '2025-11-21', value: 14 },
            { date: '2025-11-22', value: 21 },
            { date: '2025-11-23', value: 26 },
            { date: '2025-11-24', value: 11 },
            { date: '2025-11-25', value: 20 },
            { date: '2025-11-26', value: 29 },
            { date: '2025-11-27', value: 13 },
            { date: '2025-11-28', value: 20 },
            { date: '2025-11-29', value: 24 },
            { date: '2025-11-30', value: 30 },
        ],
    },
];

// --- DOM ELEMENTS ---
const homePage = document.getElementById('home-page');
const habitDetailPage = document.getElementById('habit-detail-page');
const habitListContainer = document.getElementById('habit-list');
const homeLink = document.getElementById('home-link');

// --- RENDERING FUNCTIONS ---
function renderHabitList() {
    habitListContainer.innerHTML = ''; // Clear previous list
    allHabits.forEach(habit => {
        const habitItem = document.createElement('div');
        habitItem.className = 'habit-item';
        habitItem.innerHTML = `
            <h3>${habit.name}</h3>
            <p>${habit.category}</p>
        `;
        habitItem.addEventListener('click', () => showHabitDetail(habit.id));
        habitListContainer.appendChild(habitItem);
    });
}

function showHabitDetail(habitId) {
    const habit = allHabits.find(h => h.id === habitId);

    if (!habit) {
        // Handle case where habit is not found
        console.error('Habit not found:', habitId);
        return;
    }

    // Update URL for direct linking/refresh
    history.pushState({ habitId: habit.id }, habit.name, `#habit/${habit.id}`);

    document.getElementById('detail-habit-name').textContent = habit.name;
    document.getElementById('detail-habit-category').textContent = habit.category;

    // Calculate and display stats
    document.getElementById('stat-completion-rate').textContent = `${calculateCompletionRate(habit).toFixed(1)}%`;
    document.getElementById('stat-consistency').textContent = calculateConsistency(habit).toFixed(2);
    document.getElementById('stat-trend').textContent = `${calculateTrendVelocity(habit).toFixed(1)}%`;

    // Display correlations
    const correlationInsights = document.getElementById('correlation-insights');
    correlationInsights.innerHTML = '';
    const correlations = analyzeCorrelations(habit, allHabits);
    if (correlations.length > 0) {
        correlations.forEach(corr => {
            const correlationCard = document.createElement('div');
            correlationCard.className = 'correlation-card';
            correlationCard.innerHTML = `
                <p>You are <strong>${corr.likelihoodIncrease}%</strong> more likely to <strong>${corr.habitName}</strong> on days you complete your habit.</p>
            `;
            correlationInsights.appendChild(correlationCard);
        });
    } else {
        correlationInsights.innerHTML = '<p>No significant correlations found.</p>';
    }

    homePage.classList.add('hidden');
    habitDetailPage.classList.remove('hidden');
}

function showHomePage() {
    history.pushState(null, 'Home', '#/');
    habitDetailPage.classList.add('hidden');
    homePage.classList.remove('hidden');
}

// --- EVENT LISTENERS ---
homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    showHomePage();
});

// Handle browser back/forward buttons
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.habitId) {
        showHabitDetail(event.state.habitId);
    } else {
        showHomePage();
    }
});

// --- INITIAL LOAD ---
document.addEventListener('DOMContentLoaded', () => {
    renderHabitList();
    // Check URL for direct link to detail page
    if (window.location.hash.startsWith('#habit/')) {
        const habitId = window.location.hash.split('/')[1];
        showHabitDetail(habitId);
    } else {
        showHomePage();
    }
});
