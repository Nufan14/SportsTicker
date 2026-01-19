const params = new URLSearchParams(window.location.search);
let leagueId = params.get('league') || 'eng.1';

async function fetchSoccer() {
    try {
        // Date range: 4 days ago to 7 days ahead
        const now = new Date();
        const start = new Date(now.getTime() - (4 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0].replace(/-/g, "");
        const end = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0].replace(/-/g, "");
        
        const API_URL = `https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueId}/scoreboard?dates=${start}-${end}&limit=100`;
        const res = await fetch(API_URL);
        const data = await res.json();

        // Connect to the HTML boxes
        const liveArea = document.getElementById('live-area');
        const resultsArea = document.getElementById('results-area');
        const upcomingArea = document.getElementById('upcoming-area');

        // Reset the boxes
        liveArea.innerHTML = "";
        resultsArea.innerHTML = "";
        upcomingArea.innerHTML = "";

        data.events.forEach(event => {
            const status = event.status.type.state;
            const comp = event.competitions[0];
            const home = comp.competitors[0];
            const away = comp.competitors[1];

            // Goal Scorer Formatting
            let scorers = "";
            if (status === 'post' && comp.details) {
                const goals = comp.details
                    .filter(d => d.type.text === "Goal")
                    .map(g => g.athlete.displayName)
                    .join(", ");
                if (goals) scorers = `<div class="goal-scorers">⚽ ${goals}</div>`;
            }

            const card = `
                <div class="game-card">
                    <div class="row-main">
                        <div class="status-text">${event.status.type.shortDetail}</div>
                        <div class="team-box home">${home.team.shortDisplayName || home.team.name} <img src="${home.team.logo}" width="20"></div>
                        <div class="score-box">${status === 'pre' ? 'VS' : home.score + '-' + away.score}</div>
                        <div class="team-box away"><img src="${away.team.logo}" width="20"> ${away.team.shortDisplayName || away.team.name}</div>
                    </div>
                    ${scorers}
                </div>`;

            if (status === 'in') {
                liveArea.innerHTML += card;
            } else if (status === 'post') {
                if (resultsArea.children.length < 10) resultsArea.innerHTML += card;
            } else if (status === 'pre') {
                if (upcomingArea.children.length < 10) upcomingArea.innerHTML += card;
            }
        });

        // Hide Live Header if no games are live
        document.getElementById('live-header').style.display = liveArea.innerHTML ? 'block' : 'none';

    } catch (e) {
        console.error("Soccer Error:", e);
    }
}

fetchSoccer();
setInterval(fetchSoccer, 60000);
