const params = new URLSearchParams(window.location.search);
let leagueId = (params.get('league') || 'eng.1').split('&')[0];

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
        const start = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0].replace(/-/g, "");
        const end = new Date(now.getTime() + (14 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0].replace(/-/g, "");

        const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueId}/scoreboard?dates=${start}-${end}&limit=100`);
        const data = await res.json();

        const live = document.getElementById('liveGamesContainer');
        const sched = document.getElementById('scheduledGamesContainer');
        const fin = document.getElementById('finishedGamesContainer');
        const liveWrapper = document.getElementById('live-section-wrapper');

        live.innerHTML = ''; sched.innerHTML = ''; fin.innerHTML = '';

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
                        <div class="row-score">${status === 'pre' ? 'VS' : home.score + ' - ' + away.score}</div>
                        <div class="team-box away"><img src="${away.team.logo}" width="20"><span>${away.team.shortDisplayName || away.team.name}</span></div>
                    </div>
                    ${scorersHtml}
                </div>`;

            if (status === 'in') live.innerHTML += card;
            else if (status === 'post' && fin.children.length < 10) fin.innerHTML += card;
            else if (status === 'pre' && sched.children.length < 10) sched.innerHTML += card;
        });

        liveWrapper.style.display = live.innerHTML ? 'block' : 'none';

    } catch (e) { console.error(e); }
}

fetchSoccer();
setInterval(fetchSoccer, 60000);
