const API_URL = "https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard";

async function fetchNHLScores() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const events = data.events || [];

        const liveContainer = document.getElementById('liveGamesContainer');
        const scheduledContainer = document.getElementById('scheduledGamesContainer');
        const finishedContainer = document.getElementById('finishedGamesContainer');

        // Clear existing content
        liveContainer.innerHTML = '';
        scheduledContainer.innerHTML = '';
        finishedContainer.innerHTML = '';

        if (events.length === 0) {
            scheduledContainer.innerHTML = '<p class="no-games">No NHL games scheduled for today.</p>';
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
                    <img src="${homeTeam.team.logo}" alt="${homeTeam.team.abbreviation}" width="30">
                    <span>${homeTeam.team.displayName}</span>
                    <span class="score">${homeTeam.score}</span>
                </div>
                <div class="team">
                    <img src="${awayTeam.team.logo}" alt="${awayTeam.team.abbreviation}" width="30">
                    <span>${awayTeam.team.displayName}</span>
                    <span class="score">${awayTeam.score}</span>
                </div>
                <div class="game-status">${event.status.type.detail}</div>
            `;

            if (status === 'in') {
                liveContainer.appendChild(gameCard);
            } else if (status === 'pre') {
                scheduledContainer.appendChild(gameCard);
            } else if (status === 'post') {
                finishedContainer.appendChild(gameCard);
            }
        });

        // Add "No games" messages if specific sections are empty
        if (liveContainer.innerHTML === '') {
            liveContainer.innerHTML = '<p class="no-games">No live games at the moment</p>';
        }
        if (scheduledContainer.innerHTML === '') {
            scheduledContainer.innerHTML = '<p class="no-games">No more games scheduled today</p>';
        }
        if (finishedContainer.innerHTML === '') {
            finishedContainer.innerHTML = '<p class="no-games">No finished games yet</p>';
        }

    } catch (error) {
        console.error("Error fetching NHL scores:", error);
    }
}

fetchNHLScores();
setInterval(fetchNHLScores, 60000); // Refresh every minute
