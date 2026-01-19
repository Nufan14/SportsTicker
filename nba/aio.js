const API_URL = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard";

async function fetchNBAScores() {
    try {
        console.log("Fetching NBA Scores...");
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // Handle cases where events might be missing or empty
        const events = data.events || [];

        const liveContainer = document.getElementById('liveGamesContainer');
        const scheduledContainer = document.getElementById('scheduledGamesContainer');
        const finishedContainer = document.getElementById('finishedGamesContainer');

        liveContainer.innerHTML = '';
        scheduledContainer.innerHTML = '';
        finishedContainer.innerHTML = '';

        if (events.length === 0) {
            scheduledContainer.innerHTML = '<p class="no-games">🏀 No NBA games found in current API window. <br>Checking for upcoming night games...</p>';
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
                    <img src="${homeTeam.team.logo || ''}" alt="" width="30" onerror="this.style.display='none'">
                    <span>${homeTeam.team.displayName}</span>
                    <span class="score">${homeTeam.score}</span>
                </div>
                <div class="team">
                    <img src="${awayTeam.team.logo || ''}" alt="" width="30" onerror="this.style.display='none'">
                    <span>${awayTeam.team.displayName}</span>
                    <span class="score">${awayTeam.score}</span>
                </div>
                <div class="game-status">${event.status.type.detail}</div>
            `;

            if (status === 'in') liveContainer.appendChild(gameCard);
            else if (status === 'pre') scheduledContainer.appendChild(gameCard);
            else if (status === 'post') finishedContainer.appendChild(gameCard);
        });

        // Fill empty sections with clean placeholders
        if (liveContainer.children.length === 0) liveContainer.innerHTML = '<p class="no-games">No games live</p>';
        if (scheduledContainer.children.length === 0) scheduledContainer.innerHTML = '<p class="no-games">No more scheduled</p>';
        if (finishedContainer.children.length === 0) finishedContainer.innerHTML = '<p class="no-games">No results yet</p>';

    } catch (error) {
        console.error("NBA API Error:", error);
        document.getElementById('scheduledGamesContainer').innerHTML = '<p class="no-games">⚠️ Error loading NBA data.</p>';
    }
}

fetchNBAScores();
setInterval(fetchNBAScores, 60000);
