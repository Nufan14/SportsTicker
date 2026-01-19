// Function to get today's date in YYYYMMDD format for the API
function getTodayString() {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}${m}${d}`;
}

const API_URL = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${getTodayString()}`;

async function fetchNBAScores() {
    try {
        console.log("Fetching NBA for URL:", API_URL);
        const response = await fetch(API_URL);
        const data = await response.json();
        const events = data.events || [];

        const liveContainer = document.getElementById('liveGamesContainer');
        const scheduledContainer = document.getElementById('scheduledGamesContainer');
        const finishedContainer = document.getElementById('finishedGamesContainer');

        liveContainer.innerHTML = '';
        scheduledContainer.innerHTML = '';
        finishedContainer.innerHTML = '';

        if (events.length === 0) {
            scheduledContainer.innerHTML = `<p class="no-games">🏀 No NBA games found for ${getTodayString()}.</p>`;
            return;
        }

        events.forEach(event => {
            const status = event.status.type.state;
            const gameCard = document.createElement('div');
            gameCard.className = 'game-card';

            const homeTeam = event.competitions[0].competitors[0];
            const awayTeam = event.competitions[0].competitors[1];

            gameCard.innerHTML = `
                <div class="team">
                    <img src="${homeTeam.team.logo}" width="30" onerror="this.style.opacity='0'">
                    <span>${homeTeam.team.displayName}</span>
                    <span class="score">${homeTeam.score}</span>
                </div>
                <div class="team">
                    <img src="${awayTeam.team.logo}" width="30" onerror="this.style.opacity='0'">
                    <span>${awayTeam.team.displayName}</span>
                    <span class="score">${awayTeam.score}</span>
                </div>
                <div class="game-status">${event.status.type.detail}</div>
            `;

            if (status === 'in') liveContainer.appendChild(gameCard);
            else if (status === 'pre') scheduledContainer.appendChild(gameCard);
            else if (status === 'post') finishedContainer.appendChild(gameCard);
        });

        // Placeholder text if sections are empty
        if (!liveContainer.innerHTML) liveContainer.innerHTML = '<p class="no-games">No live games</p>';
        if (!scheduledContainer.innerHTML) scheduledContainer.innerHTML = '<p class="no-games">No more scheduled today</p>';
        if (!finishedContainer.innerHTML) finishedContainer.innerHTML = '<p class="no-games">No results yet</p>';

    } catch (error) {
        console.error("NBA API Error:", error);
    }
}

fetchNBAScores();
setInterval(fetchNBAScores, 60000);
