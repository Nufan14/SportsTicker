// This version is "Cache-Buster Proof"
const params = new URLSearchParams(window.location.search);
// .get('league') will ONLY take 'eng.1', ignoring the '&t=...' timestamp
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
        // Updated to your 7-day past and 14-day future window
        const start = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0].replace(/-/g, "");
        const end = new Date(now.getTime() + (14 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0].replace(/-/g, "");

        const API_URL = `https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueId}/scoreboard?dates=${start}-${end}&limit=100`;
        const res = await fetch(API_URL);
        const data = await res.json();
        const events = data.events || [];

        const live = document.getElementById('liveGamesContainer');
        const sched = document.getElementById('scheduledGamesContainer');
        const fin = document.getElementById('finishedGamesContainer');

        if (live) live.innerHTML = ''; 
        if (sched) sched.innerHTML = ''; 
        if (fin) fin.innerHTML = '';

        events.forEach(event => {
            const status = event.status.type.state;
            const comp = event.competitions[0];
            const home = comp.competitors[0];
            const away = comp.competitors[1];
            
            // Added Goal Scorers as requested
            let scorersHtml = "";
            if (status === 'post' && comp.details) {
                const goals = comp.details
                    .filter(d => d.type.text === "Goal")
                    .map(g => g.athlete.displayName)
                    .join(", ");
                if (goals) scorersHtml = `<div style="font-size: 0.7rem; color: #777; padding: 4px 15px; background: #fafafa; border-top: 1px solid #eee;">⚽ ${goals}</div>`;
            }
            
            const row = document.createElement('div');
            row.style.background = "white";
            row.style.marginBottom = "6px";
            row.style.borderRadius = "6px";
            row.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
            row.style.overflow = "hidden";

            row.innerHTML = `
                <div class="game-row" style="margin-bottom: 0; box-shadow: none; border-radius: 0; display: flex; align-items: center; justify-content: space-between; padding: 8px 15px;">
                    <div class="row-status" style="width: 45px; font-size: 0.75rem; color: #cc0000; font-weight: bold;">${event.status.type.shortDetail}</div>
                    <div class="team-box home" style="display: flex; align-items: center; gap: 8px; flex: 1; justify-content: flex-end; text-align: right;"><span>${home.team.shortDisplayName || home.team.name}</span><img src="${home.team.logo}" width="20"></div>
                    <div class="row-score" style="font-weight: 800; background: #eee; padding: 2px 8px; border-radius: 4px; margin: 0 10px; min-width: 40px; text-align: center;">${status === 'pre' ? 'VS' : home.score + ' - ' + away.score}</div>
                    <div class="team-box away" style="display: flex; align-items: center; gap: 8px; flex: 1; justify-content: flex-start; text-align: left;"><img src="${away.team.logo}" width="20"><span>${away.team.shortDisplayName || away.team.name}</span></div>
                </div>
                ${scorersHtml}
            `;

            if (status === 'in' && live) live.appendChild(row);
            else if (status === 'pre' && sched && sched.children.length < 10) sched.appendChild(row);
            else if (status === 'post' && fin && fin.children.length < 10) fin.appendChild(row);
        });

        const liveSection = document.getElementById('live-section');
        if (liveSection) liveSection.style.display = (live && live.innerHTML) ? 'block' : 'none';

    } catch (e) { console.error("Fetch Error:", e); }
}

fetchSoccer();
setInterval(fetchSoccer, 60000);
