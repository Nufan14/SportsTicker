const params = new URLSearchParams(window.location.search);
const leagueId = params.get('league') || 'eng.1';

async function fetchSoccer() {
    try {
        const now = new Date();
        // Look back 7 days and forward 14 days
        const start = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0].replace(/-/g, "");
        const end = new Date(now.getTime() + (14 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0].replace(/-/g, "");

        const API_URL = `https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueId}/scoreboard?dates=${start}-${end}&limit=100`;
        const res = await fetch(API_URL);
        const data = await res.json();

        const liveList = document.getElementById('live-area');
        const resList = document.getElementById('results-area');
        const upList = document.getElementById('upcoming-area');
        const liveSection = document.getElementById('live-section');

        liveList.innerHTML = ''; resList.innerHTML = ''; upList.innerHTML = '';

        data.events.forEach(event => {
            const status = event.status.type.state;
            const comp = event.competitions[0];
            const home = comp.competitors[0];
            const away = comp.competitors[1];
            
            let scorersHtml = "";
            if (status === 'post' && comp.details) {
                const goals = comp.details
                    .filter(d => d.type.text === "Goal")
                    .map(g => g.athlete.displayName)
                    .join(", ");
                if (goals) scorersHtml = `<div class="scorers-box">⚽ ${goals}</div>`;
            }

            const card = `
                <div class="game-row">
                    <div class="row-main">
                        <div class="row-status">${event.status.type.shortDetail}</div>
                        <div class="team-box home"><span>${home.team.shortDisplayName || home.team.name}</span><img src="${home.team.logo}" width="20"></div>
                        <div class="row-score">${status === 'pre' ? 'VS' : home.score + '-' + away.score}</div>
                        <div class="team-box away"><img src="${away.team.logo}" width="20"><span>${away.team.shortDisplayName || away.team.name}</span></div>
                    </div>
                    ${scorersHtml}
                </div>`;

            if (status === 'in') {
                liveList.innerHTML += card;
            } else if (status === 'post' && resList.children.length < 10) {
                resList.innerHTML += card;
            } else if (status === 'pre' && upList.children.length < 10) {
                upList.innerHTML += card;
            }
        });

        // Toggle visibility of the live section
        liveSection.style.display = liveList.innerHTML ? 'block' : 'none';

    } catch (e) {
        console.error("Fetch Error:", e);
    }
}

fetchSoccer();
setInterval(fetchSoccer, 60000);
