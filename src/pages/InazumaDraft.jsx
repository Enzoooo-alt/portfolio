import React, { useEffect, useMemo, useState } from 'react';
import '../styles/pages/InazumaDraft.css';
import { fetchInazumaPlayers, INAZUMA_TACTICS, simulateInazumaMatch } from '../services/inazumaApi';

const FORMATIONS = {
  balanced: {
    label: '1-2-1-1',
    slots: { Gardien: 1, Défenseur: 2, Milieu: 1, Attaquant: 1 }
  },
  offensive: {
    label: '1-1-1-2',
    slots: { Gardien: 1, Défenseur: 1, Milieu: 1, Attaquant: 2 }
  },
  defensive: {
    label: '1-2-2-0',
    slots: { Gardien: 1, Défenseur: 2, Milieu: 2, Attaquant: 0 }
  }
};

const BASE_LIVE_MATCH = {
  minute: 0,
  scoreA: 0,
  scoreB: 0,
  eventIndex: 0,
  commentary: 'Coup d’envoi imminent…',
  ballSide: 'N',
  playing: false
};

const InazumaDraftGame = () => {
  const [gameState, setGameState] = useState('lobby');
  const [player1Team, setPlayer1Team] = useState([]);
  const [player2Team, setPlayer2Team] = useState([]);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [currentTurn, setCurrentTurn] = useState('player1');
  const [timer, setTimer] = useState(30);
  const [round, setRound] = useState(1);
  const [message, setMessage] = useState('');
  const [playersData, setPlayersData] = useState([]);
  const [playersLoading, setPlayersLoading] = useState(true);
  const [playersError, setPlayersError] = useState('');
  const [matchSimulation, setMatchSimulation] = useState(null);
  const [player1Formation, setPlayer1Formation] = useState('balanced');
  const [player2Formation, setPlayer2Formation] = useState('balanced');
  const [player1Tactic, setPlayer1Tactic] = useState('balanced');
  const [player2Tactic, setPlayer2Tactic] = useState('balanced');
  const [liveMatch, setLiveMatch] = useState(BASE_LIVE_MATCH);

  const getFormationSlots = (formationKey) => FORMATIONS[formationKey]?.slots || FORMATIONS.balanced.slots;

  const teamPositionCounts = (team) =>
    team.reduce((accumulator, player) => {
      accumulator[player.position] = (accumulator[player.position] || 0) + 1;
      return accumulator;
    }, {});

  const canDraftPlayerWithFormation = (team, formationKey, player) => {
    if (team.length >= 5) {
      return false;
    }
    const limits = getFormationSlots(formationKey);
    const counts = teamPositionCounts(team);
    const currentCount = counts[player.position] || 0;
    const maxCount = limits[player.position] ?? 0;
    return currentCount < maxCount;
  };

  const hasGoalkeeper = (team) => team.some((player) => player.position === 'Gardien');

  const getTeamMarkers = (team, formationKey, side) => {
    const limits = getFormationSlots(formationKey);
    const grouped = {
      Gardien: team.filter((player) => player.position === 'Gardien'),
      Défenseur: team.filter((player) => player.position === 'Défenseur'),
      Milieu: team.filter((player) => player.position === 'Milieu'),
      Attaquant: team.filter((player) => player.position === 'Attaquant')
    };

    const xMapLeft = { Gardien: 11, Défenseur: 27, Milieu: 43, Attaquant: 60 };
    const xMapRight = { Gardien: 89, Défenseur: 73, Milieu: 57, Attaquant: 40 };
    const xMap = side === 'left' ? xMapLeft : xMapRight;

    const markers = [];

    Object.keys(limits).forEach((role) => {
      const count = Math.max(1, limits[role]);
      const rolePlayers = grouped[role] || [];

      for (let index = 0; index < count; index += 1) {
        const player = rolePlayers[index];
        const y = 20 + ((index + 1) * (60 / (count + 1)));
        markers.push({
          role,
          x: xMap[role],
          y,
          player
        });
      }
    });

    return markers;
  };

  useEffect(() => {
    let cancelled = false;

    const loadPlayers = async () => {
      setPlayersLoading(true);
      setPlayersError('');
      try {
        const loadedPlayers = await fetchInazumaPlayers();
        if (!cancelled) {
          setPlayersData(loadedPlayers);
        }
      } catch (error) {
        if (!cancelled) {
          setPlayersError('Impossible de charger les joueurs Inazuma.');
        }
        console.error(error);
      } finally {
        if (!cancelled) {
          setPlayersLoading(false);
        }
      }
    };

    loadPlayers();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (gameState !== 'drafting' || playersData.length === 0) return;

    const interval = setInterval(() => {
      setTimer((previous) => {
        if (previous <= 1) {
          nextTurn();
          return 30;
        }
        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, playersData]);

  useEffect(() => {
    if (gameState === 'match' && player1Team.length > 0 && player2Team.length > 0 && !matchSimulation) {
      runMatchSimulation();
    }
  }, [gameState, player1Team, player2Team, matchSimulation]);

  useEffect(() => {
    if (gameState !== 'match' || !matchSimulation) return;

    setLiveMatch({
      ...BASE_LIVE_MATCH,
      commentary: 'Coup d’envoi ! Le match commence.',
      playing: true
    });

    const interval = setInterval(() => {
      setLiveMatch((previous) => {
        if (!previous.playing) {
          return previous;
        }

        const nextMinute = Math.min(previous.minute + 2, 90);
        let nextState = { ...previous, minute: nextMinute };

        while (
          nextState.eventIndex < matchSimulation.duels.length &&
          matchSimulation.duels[nextState.eventIndex].minute <= nextMinute
        ) {
          const currentEvent = matchSimulation.duels[nextState.eventIndex];
          if (currentEvent.side === 'A') {
            nextState.scoreA += 1;
          } else if (currentEvent.side === 'B') {
            nextState.scoreB += 1;
          }

          nextState.ballSide = currentEvent.side;
          nextState.commentary = currentEvent.text;
          nextState.eventIndex += 1;
        }

        if (nextMinute >= 90) {
          nextState = {
            ...nextState,
            playing: false,
            commentary: 'Fin du match !'
          };
        }

        return nextState;
      });
    }, 700);

    return () => clearInterval(interval);
  }, [gameState, matchSimulation]);

  const resetDraftPool = () => {
    const draftedIds = [...player1Team, ...player2Team].map((player) => player.id);
    const newPool = playersData
      .filter((player) => !draftedIds.includes(player.id))
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);
    setAvailablePlayers(newPool);
  };

  const runMatchSimulation = () => {
    const simulationResult = simulateInazumaMatch(player1Team, player2Team, {
      tacticA: player1Tactic,
      tacticB: player2Tactic
    });
    setMatchSimulation(simulationResult);
  };

  const nextTurn = () => {
    if (currentTurn === 'player1') {
      setCurrentTurn('player2');
    } else {
      setCurrentTurn('player1');
      const newRound = round + 1;
      setRound(newRound);
      if (newRound > 5) {
        setGameState('match');
      } else {
        resetDraftPool();
      }
    }
    setTimer(30);
  };

  const draftPlayer = (player) => {
    const activeTeam = currentTurn === 'player1' ? player1Team : player2Team;
    const activeFormation = currentTurn === 'player1' ? player1Formation : player2Formation;

    if (!canDraftPlayerWithFormation(activeTeam, activeFormation, player)) {
      setMessage(`⛔ Composition ${FORMATIONS[activeFormation].label}: ${player.position} non autorisé ici.`);
      setTimeout(() => setMessage(''), 1700);
      return;
    }

    if (currentTurn === 'player1' && player1Team.length < 5) {
      setPlayer1Team((previous) => [...previous, player]);
      setMessage(`⚽ ${player.name} rejoint l'équipe du Joueur 1 !`);
    } else if (currentTurn === 'player2' && player2Team.length < 5) {
      setPlayer2Team((previous) => [...previous, player]);
      setMessage(`⚽ ${player.name} rejoint l'équipe du Joueur 2 !`);
    }

    setAvailablePlayers((previous) => previous.filter((entry) => entry.id !== player.id));
    setTimeout(() => {
      nextTurn();
      setMessage('');
    }, 900);
  };

  const startGame = () => {
    if (playersData.length === 0) {
      return;
    }

    setGameState('drafting');
    setPlayer1Team([]);
    setPlayer2Team([]);
    setRound(1);
    setCurrentTurn('player1');
    setTimer(30);
    setMatchSimulation(null);
    setLiveMatch(BASE_LIVE_MATCH);
    setAvailablePlayers(playersData.sort(() => Math.random() - 0.5).slice(0, 6));
  };

  const calculateTeamPower = (team) => team.reduce((total, player) => total + player.power, 0);

  const resetGame = () => {
    setGameState('lobby');
    setPlayer1Team([]);
    setPlayer2Team([]);
    setAvailablePlayers([]);
    setMessage('');
    setMatchSimulation(null);
    setLiveMatch(BASE_LIVE_MATCH);
  };

  const activeDraftPool = useMemo(
    () =>
      availablePlayers.filter((player) => {
        if (currentTurn === 'player1') {
          return canDraftPlayerWithFormation(player1Team, player1Formation, player);
        }
        return canDraftPlayerWithFormation(player2Team, player2Formation, player);
      }),
    [availablePlayers, currentTurn, player1Team, player2Team, player1Formation, player2Formation]
  );

  const renderPlayerCard = (player, isDrafted = false) => (
    <div
      key={player.id}
      className={`player-card ${isDrafted ? 'drafted' : 'available'}`}
      onClick={() => !isDrafted && draftPlayer(player)}
    >
      <div className="player-avatar">
        <img src={player.image} alt={player.name} loading="lazy" />
      </div>
      <div className="player-header">
        <span className="player-element">{player.element}</span>
        <span className="player-name">{player.name}</span>
      </div>
      <div className="player-info">
        <span className="player-position">{player.position}</span>
        <span className="player-team">{player.team}</span>
      </div>
      <div className="player-power">
        Puissance: <strong>{player.power}</strong>
      </div>
      <div className="player-power">Tir {player.shoot} • Bloc {player.block} • Vitesse {player.speed}</div>
      <div className="player-power">Technique: <strong>{player.technique}</strong></div>
      {!isDrafted && <div className="draft-action">Cliquer pour drafter</div>}
    </div>
  );

  const displayedScore = `${liveMatch.scoreA} - ${liveMatch.scoreB}`;
  const tacticalDelta = useMemo(() => {
    const left = INAZUMA_TACTICS[player1Tactic] || INAZUMA_TACTICS.balanced;
    const right = INAZUMA_TACTICS[player2Tactic] || INAZUMA_TACTICS.balanced;
    const leftScore = left.attack + left.defense + left.tempo;
    const rightScore = right.attack + right.defense + right.tempo;
    return (leftScore - rightScore).toFixed(2);
  }, [player1Tactic, player2Tactic]);

  return (
    <div className="inazuma-container">
      <div className="inazuma-header">
        <h1 className="game-title">
          <span className="soccer-ball">⚽</span>
          INAZUMA ELEVEN DRAFT 1v1
          <span className="soccer-ball">⚽</span>
        </h1>
        <p className="game-subtitle">Compose ton 5v5, impose ta tactique et gagne en direct.</p>
        {playersLoading && <p className="api-state">Chargement des joueurs via API…</p>}
        {playersError && <p className="api-state error">{playersError}</p>}
      </div>

      {message && <div className="alert-message">{message}</div>}

      {gameState === 'lobby' && (
        <div className="lobby-screen">
          <div className="lobby-content">
            <h2>Prêt pour le match ?</h2>

            <div className="teams-overview">
              <div className="team-preview team-blue">
                <h3>Joueur 1</h3>
                <div className="team-count">{player1Team.length}/5 joueurs</div>
                <div className="team-power">Puissance: {calculateTeamPower(player1Team)}</div>
              </div>

              <div className="vs-circle">VS</div>

              <div className="team-preview team-red">
                <h3>Joueur 2</h3>
                <div className="team-count">{player2Team.length}/5 joueurs</div>
                <div className="team-power">Puissance: {calculateTeamPower(player2Team)}</div>
              </div>
            </div>

            <div className="formations-config">
              <div className="formation-card team-blue">
                <h4>Composition Joueur 1</h4>
                <select value={player1Formation} onChange={(event) => setPlayer1Formation(event.target.value)}>
                  {Object.entries(FORMATIONS).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
                <p>Minimum 1 gardien obligatoire.</p>
                <label className="tactic-label" htmlFor="tactic-j1">Plan tactique</label>
                <select id="tactic-j1" value={player1Tactic} onChange={(event) => setPlayer1Tactic(event.target.value)}>
                  {Object.entries(INAZUMA_TACTICS).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>
              <div className="formation-card team-red">
                <h4>Composition Joueur 2</h4>
                <select value={player2Formation} onChange={(event) => setPlayer2Formation(event.target.value)}>
                  {Object.entries(FORMATIONS).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
                <p>Minimum 1 gardien obligatoire.</p>
                <label className="tactic-label" htmlFor="tactic-j2">Plan tactique</label>
                <select id="tactic-j2" value={player2Tactic} onChange={(event) => setPlayer2Tactic(event.target.value)}>
                  {Object.entries(INAZUMA_TACTICS).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="tactical-insight">
              <strong>Lecture tactique :</strong>{' '}
              {tacticalDelta > 0
                ? `léger avantage Joueur 1 (+${tacticalDelta})`
                : tacticalDelta < 0
                  ? `léger avantage Joueur 2 (${tacticalDelta})`
                  : 'équilibre parfait entre les deux plans de jeu'}
            </div>

            <div className="lobby-controls">
              <button className="btn-start" onClick={startGame} disabled={playersLoading || playersData.length === 0}>
                COMMENCER LE DRAFT
              </button>
              <button className="btn-reset" onClick={resetGame}>RÉINITIALISER</button>
            </div>
          </div>
        </div>
      )}

      {gameState === 'drafting' && (
        <div className="draft-screen">
          <div className="draft-header">
            <div className="round-info">Manche {round}/5</div>
            <div className="timer">⏱️ {timer}s</div>
            <div className="turn-info">Tour: <strong>{currentTurn === 'player1' ? 'Joueur 1' : 'Joueur 2'}</strong></div>
          </div>

          <div className="draft-arena">
            <div className="team-section team-blue">
              <h3>Joueur 1 ({player1Team.length}/5)</h3>
              <p className="team-formula">Formation: {FORMATIONS[player1Formation].label}</p>
              <div className="team-players">
                {player1Team.map((player) => (
                  <div key={player.id} className="team-player">{player.element} {player.name}</div>
                ))}
              </div>
              <div className="team-total">Total: {calculateTeamPower(player1Team)}</div>
            </div>

            <div className="draft-pool">
              <h3>Joueurs disponibles</h3>
              <div className="available-players">
                {activeDraftPool.map((player) => renderPlayerCard(player))}
              </div>
              <div className="pool-info">{activeDraftPool.length} joueur(s) compatible(s) pour ce tour</div>
            </div>

            <div className="team-section team-red">
              <h3>Joueur 2 ({player2Team.length}/5)</h3>
              <p className="team-formula">Formation: {FORMATIONS[player2Formation].label}</p>
              <div className="team-players">
                {player2Team.map((player) => (
                  <div key={player.id} className="team-player">{player.element} {player.name}</div>
                ))}
              </div>
              <div className="team-total">Total: {calculateTeamPower(player2Team)}</div>
            </div>
          </div>

          <div className="draft-controls">
            <button className="btn-skip" onClick={nextTurn}>PASSER LE TOUR</button>
            <button
              className="btn-end-draft"
              onClick={() => setGameState('match')}
              disabled={
                player1Team.length < 5 ||
                player2Team.length < 5 ||
                !hasGoalkeeper(player1Team) ||
                !hasGoalkeeper(player2Team)
              }
            >
              TERMINER LE DRAFT
            </button>
          </div>
        </div>
      )}

      {gameState === 'match' && (
        <div className="match-screen">
          <h2>⚔️ MATCH FINAL ⚔️</h2>

          <div className="match-arena">
            <div className="match-team team-blue">
              <h3>Joueur 1</h3>
              <div className="match-power">{calculateTeamPower(player1Team)}</div>
              <div className="match-tactic">Tactique: {INAZUMA_TACTICS[player1Tactic]?.label}</div>
              <div className="match-players">
                {player1Team.map((player) => (
                  <div key={player.id} className="match-player">
                    <span className="player-emoji">{player.element}</span>
                    <span className="player-name">{player.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="match-center">
              <div className="score-display">{displayedScore}</div>
              <div className="vs-label">VS</div>
            </div>

            <div className="match-team team-red">
              <h3>Joueur 2</h3>
              <div className="match-power">{calculateTeamPower(player2Team)}</div>
              <div className="match-tactic">Tactique: {INAZUMA_TACTICS[player2Tactic]?.label}</div>
              <div className="match-players">
                {player2Team.map((player) => (
                  <div key={player.id} className="match-player">
                    <span className="player-emoji">{player.element}</span>
                    <span className="player-name">{player.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="live-pitch-wrap">
            <h4>Mini terrain — match en direct</h4>
            <div className="live-pitch">
              <div className="pitch-center-line"></div>
              <div className="pitch-center-circle"></div>

              {getTeamMarkers(player1Team, player1Formation, 'left').map((marker, index) => (
                <div
                  key={`left-${index}`}
                  className="pitch-player team-a"
                  style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                  title={marker.player ? marker.player.name : marker.role}
                >
                  {marker.player
                    ? marker.player.name
                        .split(' ')
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2)
                    : marker.role[0]}
                </div>
              ))}

              {getTeamMarkers(player2Team, player2Formation, 'right').map((marker, index) => (
                <div
                  key={`right-${index}`}
                  className="pitch-player team-b"
                  style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                  title={marker.player ? marker.player.name : marker.role}
                >
                  {marker.player
                    ? marker.player.name
                        .split(' ')
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2)
                    : marker.role[0]}
                </div>
              ))}

              <div
                className={`pitch-ball ${liveMatch.ballSide === 'A' ? 'a' : liveMatch.ballSide === 'B' ? 'b' : ''}`}
                style={{ top: `${48 + ((liveMatch.minute % 6) - 3) * 2}%` }}
              >
                ⚽
              </div>
            </div>
            <div className="live-match-meta">
              <span>{liveMatch.minute}'</span>
              <span>{liveMatch.commentary}</span>
            </div>
          </div>

          <div className="match-result">
            {liveMatch.scoreA > liveMatch.scoreB ? (
              <>
                <div className="winner-badge">🏆</div>
                <h3 className="winner">JOUEUR 1 GAGNE !</h3>
                <p>Victoire {liveMatch.scoreA} - {liveMatch.scoreB}</p>
              </>
            ) : liveMatch.scoreB > liveMatch.scoreA ? (
              <>
                <div className="winner-badge">🏆</div>
                <h3 className="winner">JOUEUR 2 GAGNE !</h3>
                <p>Victoire {liveMatch.scoreB} - {liveMatch.scoreA}</p>
              </>
            ) : (
              <>
                <div className="draw-badge">🤝</div>
                <h3 className="draw">MATCH NUL !</h3>
                <p>Égalité parfaite !</p>
              </>
            )}
          </div>

          <div className="match-techniques">
            <h4>Techniques utilisées :</h4>
            <div className="techniques-list">
              {[...player1Team, ...player2Team].slice(0, 4).map((player) => (
                <div key={`${player.id}-${player.technique}`} className="technique">
                  <span className="tech-name">{player.technique}</span>
                  <span className="tech-power">{player.power}</span>
                </div>
              ))}
            </div>
          </div>

          {matchSimulation && (
            <div className="match-techniques">
              <h4>Simulation 1v1 (timeline)</h4>
              <div className="duels-timeline">
                {matchSimulation.duels.map((duel, index) => (
                  <div key={`${duel.minute}-${index}`} className="duel-item">
                    <strong>{duel.minute}'</strong> {duel.text}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="match-controls">
            <button className="btn-skip" onClick={runMatchSimulation}>RESIMULER 1v1</button>
            <button className="btn-rematch" onClick={startGame}>REVANCHE</button>
            <button className="btn-lobby" onClick={resetGame}>NOUVEAU MATCH</button>
          </div>
        </div>
      )}

      <div className="inazuma-footer">
        <div className="instructions">
          <p><strong>Comment jouer :</strong></p>
          <p>1. Chaque joueur draft 5 joueurs avec composition imposée</p>
          <p>2. Minimum 1 gardien par équipe (5v5)</p>
          <p>3. Le mini terrain montre les actions en direct</p>
        </div>
      </div>
    </div>
  );
};

export default InazumaDraftGame;
