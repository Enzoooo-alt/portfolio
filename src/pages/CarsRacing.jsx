import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/CarsRacing.css';

const STORAGE_KEY = 'carsCardCollection_v1';

const CARD_POOL = [
  { id: 'mcqueen', name: 'Flash McQueen', rarity: 'Légendaire', attack: 95, defense: 78, speed: 99, skill: 'Turbo final' },
  { id: 'francesco', name: 'Francesco Bernoulli', rarity: 'Épique', attack: 92, defense: 72, speed: 97, skill: 'Vitesse parfaite' },
  { id: 'storm', name: 'Jackson Storm', rarity: 'Épique', attack: 94, defense: 74, speed: 98, skill: 'Data Drive' },
  { id: 'doc', name: 'Doc Hudson', rarity: 'Légendaire', attack: 90, defense: 92, speed: 84, skill: 'Expérience de piste' },
  { id: 'sally', name: 'Sally Carrera', rarity: 'Rare', attack: 72, defense: 80, speed: 76, skill: 'Support stratégique' },
  { id: 'mater', name: 'Martin', rarity: 'Rare', attack: 68, defense: 86, speed: 60, skill: 'Blocage imprévisible' },
  { id: 'ramone', name: 'Ramone', rarity: 'Rare', attack: 70, defense: 74, speed: 72, skill: 'Style Nitro' },
  { id: 'luigi', name: 'Luigi', rarity: 'Commune', attack: 55, defense: 62, speed: 58, skill: 'Pit-stop rapide' },
  { id: 'guido', name: 'Guido', rarity: 'Commune', attack: 52, defense: 61, speed: 65, skill: 'Changement éclair' },
  { id: 'fillmore', name: 'Fillmore', rarity: 'Commune', attack: 57, defense: 68, speed: 54, skill: 'Carburant zen' },
  { id: 'king', name: 'The King', rarity: 'Épique', attack: 88, defense: 87, speed: 82, skill: 'Ligne royale' },
  { id: 'chick', name: 'Chick Hicks', rarity: 'Rare', attack: 81, defense: 66, speed: 74, skill: 'Contact agressif' }
];

const RARITY_MULTIPLIER = {
  Commune: 1,
  Rare: 1.08,
  Épique: 1.17,
  Légendaire: 1.28
};

const BoosterWeights = [
  { rarity: 'Commune', weight: 58 },
  { rarity: 'Rare', weight: 27 },
  { rarity: 'Épique', weight: 11 },
  { rarity: 'Légendaire', weight: 4 }
];

const initialState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { collection: {}, credits: 250, packsOpened: 0, wins: 0, losses: 0 };
    return JSON.parse(raw);
  } catch {
    return { collection: {}, credits: 250, packsOpened: 0, wins: 0, losses: 0 };
  }
};

const getCardPower = (card) => {
  const base = card.attack * 0.45 + card.defense * 0.25 + card.speed * 0.3;
  return Math.round(base * (RARITY_MULTIPLIER[card.rarity] || 1));
};

const randomByWeight = (weights) => {
  const total = weights.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const entry of weights) {
    roll -= entry.weight;
    if (roll <= 0) return entry.rarity;
  }
  return weights[weights.length - 1].rarity;
};

const openBooster = () => {
  const pulled = [];
  for (let i = 0; i < 5; i += 1) {
    const rarity = i === 4 ? randomByWeight(BoosterWeights.filter((entry) => entry.rarity !== 'Commune')) : randomByWeight(BoosterWeights);
    const pool = CARD_POOL.filter((card) => card.rarity === rarity);
    pulled.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  return pulled;
};

const pickBestDeck = (collection, size = 5) => {
  const owned = CARD_POOL.filter((card) => (collection[card.id] || 0) > 0);
  return owned.sort((a, b) => getCardPower(b) - getCardPower(a)).slice(0, size);
};

export default function CarsRacing() {
  const navigate = useNavigate();
  const [state, setState] = useState(initialState);
  const [lastOpened, setLastOpened] = useState([]);
  const [battleLog, setBattleLog] = useState([]);

  const collectionCount = useMemo(
    () => Object.values(state.collection).reduce((sum, qty) => sum + qty, 0),
    [state.collection]
  );

  const uniqueOwned = useMemo(
    () => Object.keys(state.collection).filter((key) => state.collection[key] > 0).length,
    [state.collection]
  );

  const playerDeck = useMemo(() => pickBestDeck(state.collection), [state.collection]);

  const saveState = (next) => {
    setState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handleOpenPack = () => {
    if (state.credits < 100) return;

    const cards = openBooster();
    const nextCollection = { ...state.collection };
    cards.forEach((card) => {
      nextCollection[card.id] = (nextCollection[card.id] || 0) + 1;
    });

    saveState({
      ...state,
      credits: state.credits - 100,
      packsOpened: state.packsOpened + 1,
      collection: nextCollection
    });
    setLastOpened(cards);
  };

  const simulateBattle = () => {
    if (playerDeck.length < 5) {
      setBattleLog(['Il faut un deck de 5 cartes minimum. Ouvre plus de boosters.']);
      return;
    }

    const aiDeck = [...CARD_POOL]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
      .sort((a, b) => getCardPower(b) - getCardPower(a));

    let playerRounds = 0;
    let aiRounds = 0;
    const log = [];

    for (let i = 0; i < 5; i += 1) {
      const playerCard = playerDeck[i];
      const aiCard = aiDeck[i];
      const playerScore = getCardPower(playerCard) + Math.floor(Math.random() * 12);
      const aiScore = getCardPower(aiCard) + Math.floor(Math.random() * 12);

      if (playerScore >= aiScore) {
        playerRounds += 1;
        log.push(`Round ${i + 1}: ${playerCard.name} domine ${aiCard.name} (${playerScore} vs ${aiScore})`);
      } else {
        aiRounds += 1;
        log.push(`Round ${i + 1}: ${aiCard.name} contre parfaitement ${playerCard.name} (${aiScore} vs ${playerScore})`);
      }
    }

    const isWin = playerRounds >= aiRounds;
    const reward = isWin ? 120 : 45;

    saveState({
      ...state,
      credits: state.credits + reward,
      wins: state.wins + (isWin ? 1 : 0),
      losses: state.losses + (isWin ? 0 : 1)
    });

    setBattleLog([
      ...log,
      isWin
        ? `Victoire ${playerRounds}-${aiRounds}. Récompense: +${reward} crédits.`
        : `Défaite ${playerRounds}-${aiRounds}. Compensation: +${reward} crédits.`
    ]);
  };

  const resetProgress = () => {
    const blank = { collection: {}, credits: 250, packsOpened: 0, wins: 0, losses: 0 };
    saveState(blank);
    setLastOpened([]);
    setBattleLog([]);
  };

  return (
    <div className="cars-racing cards-mode">
      <button className="back-button" onClick={() => navigate('/menu')}>
        ← Retour au menu
      </button>

      <div className="cards-header">
        <h1>🏁 Cars Card Collection</h1>
        <p>Collectionne, construit ton deck et affronte l’IA en 5 rounds.</p>
      </div>

      <div className="cards-stats-grid">
        <div className="stat-card"><strong>Crédits</strong><span>{state.credits}</span></div>
        <div className="stat-card"><strong>Packs ouverts</strong><span>{state.packsOpened}</span></div>
        <div className="stat-card"><strong>Cartes possédées</strong><span>{collectionCount}</span></div>
        <div className="stat-card"><strong>Collection unique</strong><span>{uniqueOwned}/{CARD_POOL.length}</span></div>
        <div className="stat-card"><strong>Victoires</strong><span>{state.wins}</span></div>
        <div className="stat-card"><strong>Défaites</strong><span>{state.losses}</span></div>
      </div>

      <div className="cards-actions">
        <button className="start-btn" onClick={handleOpenPack} disabled={state.credits < 100}>
          Ouvrir booster (100 crédits)
        </button>
        <button className="control-btn nitro-btn" onClick={simulateBattle}>
          Lancer un duel IA
        </button>
        <button className="control-btn pause-btn" onClick={resetProgress}>
          Reset progression
        </button>
      </div>

      <section className="cards-section">
        <h2>Dernier booster</h2>
        <div className="cards-grid">
          {lastOpened.length === 0 ? (
            <p className="empty-state">Aucun booster ouvert pour le moment.</p>
          ) : (
            lastOpened.map((card, idx) => (
              <article className={`collect-card rarity-${card.rarity.toLowerCase()}`} key={`${card.id}-${idx}`}>
                <h3>{card.name}</h3>
                <p>{card.rarity}</p>
                <p>⚔️ {card.attack} · 🛡️ {card.defense} · 💨 {card.speed}</p>
                <p className="card-skill">{card.skill}</p>
                <p className="card-power">Puissance: {getCardPower(card)}</p>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="cards-section">
        <h2>Ton deck automatique (Top 5)</h2>
        <div className="cards-grid">
          {playerDeck.length === 0 ? (
            <p className="empty-state">Ouvre des boosters pour construire ton deck.</p>
          ) : (
            playerDeck.map((card) => (
              <article className={`collect-card rarity-${card.rarity.toLowerCase()}`} key={`deck-${card.id}`}>
                <h3>{card.name}</h3>
                <p>Copies: {state.collection[card.id] || 0}</p>
                <p>{card.rarity}</p>
                <p className="card-power">Puissance: {getCardPower(card)}</p>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="cards-section">
        <h2>Journal de duel</h2>
        <div className="battle-log">
          {battleLog.length === 0 ? (
            <p className="empty-state">Aucun duel lancé.</p>
          ) : (
            battleLog.map((line, idx) => <p key={`log-${idx}`}>{line}</p>)
          )}
        </div>
      </section>
    </div>
  );
}
