const params = new URLSearchParams(window.location.search);
const leagueId = params.get('league') || 'eng.1';

async function fetchSoccer() {
    try {
        const now = new Date();
        // Look back 7 days and forward 14 days
        const start = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0].replace(/-/g, "");
        const end = new Date(now.getTime() + (14 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0].replace(/-/g, "");
        
        const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueId}/scoreboard?dates=${start}-${end}&limit=100`);
        const data = await res.json();

        const liveList = document.getElementById('live-list');
        const resList = document.getElementById('res-list');
        const upList = document.getElementById('up-list');
        const liveBox = document.getElementById('live-box');

        if (!liveList || !resList || !upList) return;

        liveList.innerHTML = "";
        resList.innerHTML = "";
        upList.innerHTML = "";

        data.events.forEach(event => {
            const status = event.status.type.state;
            const comp = event.competitions[0];
            const home = comp.competitors[0];
            const away = comp.competitors[1];

            // Safely get scorers
            let scorersHtml = "";
            if (status === 'post' && comp.details) {
                const goals = comp.details
                    .filter(d => d.type && d.type.text === "Goal")
                    .map(g => g.athlete ? g.athlete.displayName : "")
                    .filter(name => name !== "")
                    .join(", ");
                if (goals) scorersHtml = `<div class="goals">⚽ ${goals}</div>`;
            }

            const card = `
                <div class="card">
                    <div class="row">
                        <div class="stat">${event.status.type.shortDetail}</div>
                        <div class="team home">${home.team.shortDisplayName || home.team.name} <img src="${home.team.logo}" width="18"></div>
                        <div class="score">${status === 'pre' ? 'VS' : home.score + '-' + away.score}</div>
                        <div class="team away"><img src="${away.team.logo}" width="18"> ${away.team.shortDisplayName || away.team.name}</div>
                    </div>
                    ${scorersHtml}
                </div>`;

            if (status === 'in') {
                liveList.innerHTML += card;
            } else if (status === 'post') {
                if (resList.children.length < 12) resList.innerHTML += card;
            } else if (status === 'pre') {
                if (upList.children.length < 12) upList.innerHTML += card;
            }
        });

        // Show/Hide live section
        if (liveBox) {
            liveBox.style.display = liveList.innerHTML === "" ? "none" : "block";
        }

    } catch (e) {
        console.error("Fetch Error:", e);
    }
}

fetchSoccer();
setInterval(fetchSoccer, 60000);
