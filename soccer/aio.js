const params = new URLSearchParams(window.location.search);
let leagueId = params.get('league') || 'eng.1';

// Direct Logo Fix
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

        // DYNAMIC DATES: Automatically looks back 3 days and forward 3 days
        const now = new Date();
        const start = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0].replace(/-/g, "");
        const end = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0].replace(/-/g, "");

        const API_URL = `https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueId}/scoreboard?dates=${start}-${end}&limit=50`;
        const res = await fetch(API_URL);
        const data = await res.json();
        const events = data.events || [];

        const live = document.getElementById('liveGamesContainer');
        const sched = document.getElementById('scheduledGamesContainer');
        const fin = document.getElementById('finishedGamesContainer');

        live.innerHTML = ''; sched.innerHTML = ''; fin.innerHTML = '';

        events.forEach(event => {
            const status = event.status.type.state;
            const home = event.competitions[0].competitors[0];
            const away = event.competitions[0].competitors[1];
            
            const row = document.createElement('div');
            row.className = 'game-row';
            row.innerHTML = `
                <div class="row-status">${event.status.type.shortDetail}</div>
                <div class="team-box home"><span>${home.team.shortDisplayName || home.team.name}</span><img src="${home.team.logo}" width="20"></div>
                <div class="row-score">${home.score} - ${away.score}</div>
                <div class="team-box away"><img src="${away.team.logo}" width="20"><span>${away.team.shortDisplayName || away.team.name}</span></div>
            `;

            if (status === 'in') live.appendChild(row);
            // Limit the columns to 8 items each to prevent cropping
            else if (status === 'pre' && sched.children.length < 8) sched.appendChild(row);
            else if (status === 'post' && fin.children.length < 8) fin.appendChild(row);
        });
    } catch (e) { console.error(e); }
}

fetchSoccer();
setInterval(fetchSoccer, 60000);
