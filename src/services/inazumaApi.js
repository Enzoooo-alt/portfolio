const INAZUMA_PLAYERS_BASE = [
  { id: 1, name: 'Mark Evans', searchName: 'Endou Mamoru', position: 'Gardien', team: 'Raimon', power: 85, element: '💧', technique: 'God Hand' },
  { id: 2, name: 'Axel Blaze', searchName: 'Gouenji Shuuya', position: 'Attaquant', team: 'Raimon', power: 95, element: '🔥', technique: 'Fire Tornado' },
  { id: 3, name: 'Jude Sharp', searchName: 'Kidou Yuuto', position: 'Milieu', team: 'Raimon', power: 88, element: '💨', technique: 'Killer Slide' },
  { id: 4, name: 'Shawn Frost', searchName: 'Fubuki Shirou', position: 'Attaquant', team: 'Raimon', power: 90, element: '❄️', technique: 'Eternal Blizzard' },
  { id: 5, name: 'Nathan Swift', searchName: 'Kazemaru Ichirouta', position: 'Défenseur', team: 'Raimon', power: 83, element: '🌿', technique: 'Spinning Cut' },
  { id: 6, name: 'Kevin Dragonfly', searchName: 'Someoka Ryuugo', position: 'Attaquant', team: 'Raimon', power: 87, element: '⚡', technique: 'Dragon Crash' },
  { id: 7, name: 'Xavier Foster', searchName: 'Hiroto Kiyama', position: 'Milieu', team: 'Aliea', power: 92, element: '⚡', technique: 'Meteor Blade' },
  { id: 8, name: 'Arion Sherwind', searchName: 'Matsukaze Tenma', position: 'Attaquant', team: 'Raimon GO', power: 94, element: '💨', technique: 'Sonic Shot' },
  { id: 9, name: 'Riccardo Di Rigo', searchName: 'Shindou Takuto', position: 'Milieu', team: 'Raimon GO', power: 89, element: '🔥', technique: 'Fortissimo' },
  { id: 10, name: 'Gabriel Garcia', searchName: 'Shinsuke Nishizono', position: 'Gardien', team: 'Raimon GO', power: 84, element: '🌿', technique: 'Bouncer Rabbit' },
  { id: 11, name: 'Byron Love', searchName: 'Aphrodi', position: 'Attaquant', team: 'Zeus', power: 91, element: '✨', technique: 'God Knows' },
  { id: 12, name: 'Caleb Stonewall', searchName: 'Fudou Akio', position: 'Milieu', team: 'Teikoku', power: 86, element: '🪨', technique: 'Illusion Ball' }
];

const CACHE_KEY = 'inazumaPlayersCache_v2';
const CACHE_TTL_MS = 1000 * 60 * 60 * 24;
let cachedPlayers = null;

const buildFallbackImage = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0a192f&color=ffffff&size=420&format=png`;

const toPngUrl = (sourceUrl) => {
  if (!sourceUrl) return null;
  const stripped = sourceUrl.replace(/^https?:\/\//, '');
  return `https://images.weserv.nl/?url=${encodeURIComponent(stripped)}&output=png&w=420&h=600&fit=cover`;
};

const fetchCharacterImage = async (query) => {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/characters?q=${encodeURIComponent(query)}&limit=1`);
    if (!response.ok) {
      return null;
    }
    const payload = await response.json();
    const source =
      payload?.data?.[0]?.images?.webp?.image_url ||
      payload?.data?.[0]?.images?.jpg?.image_url ||
      null;
    return toPngUrl(source);
  } catch {
    return null;
  }
};

const getPositionMultiplier = (position) => {
  if (position === 'Attaquant') return 1.15;
  if (position === 'Milieu') return 1.05;
  if (position === 'Gardien') return 0.95;
  return 1;
};

export const INAZUMA_TACTICS = {
  balanced: { label: 'Équilibrée', attack: 1, defense: 1, tempo: 1, variance: 1 },
  pressing: { label: 'Pressing haut', attack: 1.08, defense: 1.05, tempo: 1.15, variance: 1.08 },
  counter: { label: 'Contre rapide', attack: 1.15, defense: 0.96, tempo: 0.92, variance: 1.12 },
  possession: { label: 'Contrôle', attack: 1.02, defense: 1.08, tempo: 0.9, variance: 0.92 },
  allout: { label: 'All-in', attack: 1.22, defense: 0.9, tempo: 1.2, variance: 1.18 }
};

export const fetchInazumaPlayers = async () => {
  if (cachedPlayers) {
    return cachedPlayers;
  }

  try {
    const cacheRaw = localStorage.getItem(CACHE_KEY);
    if (cacheRaw) {
      const parsed = JSON.parse(cacheRaw);
      const isFresh = parsed?.updatedAt && Date.now() - parsed.updatedAt < CACHE_TTL_MS;
      if (isFresh && Array.isArray(parsed.players) && parsed.players.length > 0) {
        cachedPlayers = parsed.players;
        return cachedPlayers;
      }
    }
  } catch {
    // ignore cache errors
  }

  const enrichedPlayers = [];
  for (const player of INAZUMA_PLAYERS_BASE) {
    const image = await fetchCharacterImage(player.searchName);
    enrichedPlayers.push({
      ...player,
      image: image || buildFallbackImage(player.name),
      stamina: 70 + Math.floor(Math.random() * 25),
      shoot: Math.min(99, player.power + Math.floor(Math.random() * 8)),
      block: Math.min(99, player.power - 5 + Math.floor(Math.random() * 10)),
      speed: Math.min(99, player.power - 8 + Math.floor(Math.random() * 12))
    });

    await new Promise((resolve) => setTimeout(resolve, 180));
  }

  cachedPlayers = enrichedPlayers;
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        updatedAt: Date.now(),
        players: enrichedPlayers
      })
    );
  } catch {
    // ignore storage errors
  }

  return enrichedPlayers;
};

export const simulateInazumaDuel = (playerA, playerB) => {
  const attackA = Math.floor(playerA.shoot * getPositionMultiplier(playerA.position) + Math.random() * 18);
  const attackB = Math.floor(playerB.block + Math.random() * 15);

  const scoreA = attackA > attackB + 8 ? 1 : 0;
  const scoreB = attackB > attackA + 14 ? 1 : 0;

  const winner = scoreA > scoreB ? 'player1' : scoreB > scoreA ? 'player2' : 'draw';

  const commentary = winner === 'draw'
    ? `${playerA.name} et ${playerB.name} se neutralisent dans un duel tactique.`
    : winner === 'player1'
      ? `${playerA.name} déclenche ${playerA.technique} et prend l'avantage.`
      : `${playerB.name} lit l'action et casse l'attaque avec ${playerB.technique}.`;

  return {
    winner,
    scoreA,
    scoreB,
    commentary
  };
};

export const simulateInazumaMatch = (teamA, teamB, options = {}) => {
  const tacticA = INAZUMA_TACTICS[options.tacticA] || INAZUMA_TACTICS.balanced;
  const tacticB = INAZUMA_TACTICS[options.tacticB] || INAZUMA_TACTICS.balanced;

  const avgStat = (team, key) => team.reduce((sum, player) => sum + (player[key] || player.power || 0), 0) / Math.max(team.length, 1);
  const teamRatingA = avgStat(teamA, 'power') * 0.55 + avgStat(teamA, 'shoot') * 0.25 + avgStat(teamA, 'speed') * 0.2;
  const teamRatingB = avgStat(teamB, 'power') * 0.55 + avgStat(teamB, 'shoot') * 0.25 + avgStat(teamB, 'speed') * 0.2;

  const keeperA = teamA.find((player) => player.position === 'Gardien');
  const keeperB = teamB.find((player) => player.position === 'Gardien');

  const events = [];
  let goalsA = 0;
  let goalsB = 0;
  let momentumA = 0;
  let momentumB = 0;

  const tempoFactor = (tacticA.tempo + tacticB.tempo) / 2;
  const minuteStep = tempoFactor > 1.1 ? 5 : tempoFactor < 0.95 ? 7 : 6;

  for (let minute = minuteStep; minute <= 90; minute += minuteStep) {
    const attackerA = teamA[Math.floor(Math.random() * teamA.length)];
    const defenderB = teamB[Math.floor(Math.random() * teamB.length)];

    const attackA =
      attackerA.shoot * getPositionMultiplier(attackerA.position) * tacticA.attack +
      teamRatingA * 0.12 +
      momentumA * 1.5 +
      Math.random() * (20 * tacticA.variance);
    const defenseB =
      defenderB.block * tacticB.defense +
      (keeperB?.block || 70) * 0.35 +
      teamRatingB * 0.08 +
      Math.random() * (14 * tacticB.variance);

    if (attackA - defenseB > 17) {
      goalsA += 1;
      momentumA = Math.min(4, momentumA + 1.2);
      momentumB = Math.max(-2, momentumB - 0.8);
      events.push({
        minute,
        side: 'A',
        text: `${attackerA.name} conclut (${tacticA.label}) avec ${attackerA.technique} !`
      });
      continue;
    }

    const attackerB = teamB[Math.floor(Math.random() * teamB.length)];
    const defenderA = teamA[Math.floor(Math.random() * teamA.length)];
    const attackB =
      attackerB.shoot * getPositionMultiplier(attackerB.position) * tacticB.attack +
      teamRatingB * 0.12 +
      momentumB * 1.5 +
      Math.random() * (20 * tacticB.variance);
    const defenseA =
      defenderA.block * tacticA.defense +
      (keeperA?.block || 70) * 0.35 +
      teamRatingA * 0.08 +
      Math.random() * (14 * tacticA.variance);

    if (attackB - defenseA > 17) {
      goalsB += 1;
      momentumB = Math.min(4, momentumB + 1.2);
      momentumA = Math.max(-2, momentumA - 0.8);
      events.push({
        minute,
        side: 'B',
        text: `${attackerB.name} punit en transition (${tacticB.label}) via ${attackerB.technique} !`
      });
    } else {
      momentumA = Math.max(-2, momentumA - 0.2);
      momentumB = Math.max(-2, momentumB - 0.2);
      events.push({
        minute,
        side: 'N',
        text: `Bloc contre bloc: ${tacticA.label} vs ${tacticB.label}, aucune faille trouvée.`
      });
    }
  }

  return {
    team1Goals: goalsA,
    team2Goals: goalsB,
    duels: events
  };
};
