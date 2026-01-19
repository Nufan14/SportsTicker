const params = new URLSearchParams(window.location.search);
let leagueId = params.get('league') || 'eng.1';

const logos = {
    'eng.1': 'https://logos-world.net/wp-content/uploads/2020/06/Premier-League-Logo-700x394.png',
    'fra.1': 'https://logos-world.net/wp-content/uploads/2023/09/Ligue-1-Logo.png',
    'ger.1': 'https://logos-world.net/wp-content/uploads/2023/03/Bundesliga-Logo.png',
    'esp.1': 'https://logos-world.net/wp-content/uploads/2023/03/La-Liga-Logo.png',
    'ita.1': 'https://logos-world.net/wp-content/uploads/2023/03/Serie-A-Logo.png'
};

async function fetchSoccer() {
    try {
        const logoImg = document.getElementById('league-logo');
        if (logoImg) logoImg.src = logos[leagueId] || logos['eng.1'];

        const now = new Date();
        const start = new Date(now.getTime() - (4 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0].replace(/-/g, "");
        const end = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0].replace(/-/g, "");

        const API_URL = `https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueId}/scoreboard?dates=${start}-${end}&limit=100`;
        const res = await fetch(API_URL);
        const data = await res.json();
        const events = data.events || [];

        const containers = {
            'in': document.getElementById('liveGamesContainer'),
            'pre': document.getElementById('scheduledGamesContainer'),
            'post': document.getElementById('finishedGamesContainer')
        };
        Object.values(containers).forEach(c => c.innerHTML = '');

        events.forEach(event => {
            const status = event.status.type.state;
            const home = event.competitions[0].competitors[0];
            const away = event.competitions[0].competitors[1];
            
            // Extract Scorers for Finished Games
            let scorersHtml = "";
            if (status === 'post' && event.competitions[0].details) {
                const scorers = event.competitions[0].details
                    .filter(d => d.type.text === "Goal")
                    .map(d => `${d.athlete.displayName} (${d.clock.displayValue})`)
                    .join(", ");
                if (scorers) scorersHtml = `<div class="scorers-list">⚽ ${scorers}</div>`;
            }

            const row = document.createElement('div');
            row.className = `game-row ${status === 'in' ? 'live-row' : ''}`;
            row.innerHTML = `
                <div class="row-main">
                    <div class="row-status">${event.status.type.shortDetail}</div>
                    <div class="team-box home">
                        <span>${home.team.shortDisplayName || home.team.name}</span>
                        <img src="${home.team.logo}" width="22" onerror="this.style.opacity='0'">
                    </div>
                    <div class="row-score">${status === 'pre' ? 'vs' : home.score + ' - ' + away.score}</div>
                    <div class="team-box away">
                        <img src="${away.team.logo}" width="22" onerror="this.style.opacity='0'">
                        <span>${away.team.shortDisplayName || away.team.name}</span>
                    </div>
                </div>
                ${scorersHtml}
            `;

            if (containers[status]) {
                // Limit recent results to 10 and upcoming to 12
                if (status === 'post' && containers.post.children.length < 10) containers.post.appendChild(row);
                else if (status === 'pre' && containers.pre.children.length < 12) containers.pre.appendChild(row);
                else if (status === 'in') containers.in.appendChild(row);
            }
        });
    } catch (e) { console.error(e); }
}
fetchSoccer();
setInterval(fetchSoccer, 60000);
