const params = new URLSearchParams(window.location.search);
let leagueId = params.get('league') || 'eng.1';

async function fetchSoccer() {
    try {
        // Automatically look back 4 days and forward 7 days
        const now = new Date();
        const start = new Date(now.getTime() - (4 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0].replace(/-/g, "");
        const end = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0].replace(/-/g, "");
        const API_URL = `https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueId}/scoreboard?dates=${start}-${end}&limit=100`;

        const res = await fetch(API_URL);
        const data = await res.json();
        
        const containers = {
            'in': document.getElementById('liveGamesContainer'),
            'pre': document.getElementById('scheduledGamesContainer'),
            'post': document.getElementById('finishedGamesContainer')
        };
        Object.values(containers).forEach(c => c.innerHTML = '');

        data.events.forEach(event => {
            const status = event.status.type.state;
            const home = event.competitions[0].competitors[0];
            const away = event.competitions[0].competitors[1];
            
            // GOAL SCORERS LOGIC
            let scorersHtml = "";
            if (status === 'post' && event.competitions[0].details) {
                const goals = event.competitions[0].details
                    .filter(d => d.type.text === "Goal")
                    .map(d => `${d.athlete.displayName} (${d.clock.displayValue})`)
                    .join(", ");
                if (goals) scorersHtml = `<div class="scorer-footer">⚽ ${goals}</div>`;
            }

            const card = document.createElement('div');
            card.className = 'game-card';
            card.innerHTML = `
                <div class="row-content">
                    <div class="status-tag">${event.status.type.shortDetail}</div>
                    <div class="team-unit home">
                        <span class="team-label">${home.team.shortDisplayName || home.team.name}</span>
                        <img src="${home.team.logo}" width="22">
                    </div>
                    <div class="score-display">${status === 'pre' ? 'VS' : home.score + ' - ' + away.score}</div>
                    <div class="team-unit away">
                        <img src="${away.team.logo}" width="22">
                        <span class="team-label">${away.team.shortDisplayName || away.team.name}</span>
                    </div>
                </div>
                ${scorersHtml}
            `;

            if (containers[status]) {
                if (status === 'post' && containers.post.children.length < 10) containers.post.appendChild(card);
                else if (status === 'pre' && containers.pre.children.length < 12) containers.pre.appendChild(card);
                else if (status === 'in') containers.in.appendChild(card);
            }
        });
    } catch (e) { console.error(e); }
}
fetchSoccer();
setInterval(fetchSoccer, 60000);
