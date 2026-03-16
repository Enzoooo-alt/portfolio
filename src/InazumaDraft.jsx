import React, { useState, useEffect } from 'react';
import './InazumaDraft.css';

const InazumaDraftGame = () => {
  const [gameState, setGameState] = useState('lobby');
  const [player1Team, setPlayer1Team] = useState([]);
  const [player2Team, setPlayer2Team] = useState([]);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [currentTurn, setCurrentTurn] = useState('player1');
  const [timer, setTimer] = useState(30);
  const [round, setRound] = useState(1);
  const [message, setMessage] = useState('');

  // Joueurs d'Inazuma Eleven
  const playersData = [
    { id: 1, name: 'Mark Evans', position: 'Gardien', team: 'Raimon', power: 85, element: '💧' },
    { id: 2, name: 'Axel Blaze', position: 'Attaquant', team: 'Raimon', power: 95, element: '🔥' },
    { id: 3, name: 'Jude Sharp', position: 'Milieu', team: 'Raimon', power: 88, element: '💨' },
    { id: 4, name: 'Shawn Frost', position: 'Attaquant', team: 'Raimon', power: 90, element: '❄️' },
    { id: 5, name: 'Nathan Swift', position: 'Défenseur', team: 'Raimon', power: 83, element: '🌿' },
    { id: 6, name: 'Kevin Dragonfly', position: 'Milieu', team: 'Raimon', power: 87, element: '⚡' },
    { id: 7, name: 'Xavier Foster', position: 'Gardien', team: 'Zeus', power: 92, element: '⚡' },
    { id: 8, name: 'Arion Sherwind', position: 'Attaquant', team: 'Resistance Japan', power: 94, element: '💨' },
    { id: 9, name: 'Riccardo Di Rigo', position: 'Milieu', team: 'Orpheus', power: 89, element: '🔥' },
    { id: 10, name: 'Gabriel Garcia', position: 'Défenseur', team: 'Little Giants', power: 84, element: '🌿' }
  ];

  // Techniques
  const techniques = [
    { id: 1, name: 'God Hand', type: 'Gardien', power: 95 },
    { id: 2, name: 'Fire Tornado', type: 'Attaquant', power: 98 },
    { id: 3, name: 'Dragon Tornado', type: 'Attaquant', power: 96 },
    { id: 4, name: 'Lightning Accel', type: 'Milieu', power: 90 },
    { id: 5, name: 'Ice Arrow', type: 'Attaquant', power: 92 },
    { id: 6, name: 'The Wall', type: 'Défenseur', power: 88 },
    { id: 7, name: 'Kaiser Phoenix', type: 'Attaquant', power: 100 }
  ];

  // Initialiser le jeu
  useEffect(() => {
    if (gameState === 'drafting') {
      resetDraftPool();
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            nextTurn();
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameState]);

  const resetDraftPool = () => {
    const draftedIds = [...player1Team, ...player2Team].map(p => p.id);
    const newPool = playersData
      .filter(p => !draftedIds.includes(p.id))
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
    setAvailablePlayers(newPool);
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
    if (currentTurn === 'player1' && player1Team.length < 5) {
      setPlayer1Team(prev => [...prev, player]);
      setMessage(`⚽ ${player.name} rejoint l'équipe du Joueur 1!`);
    } else if (currentTurn === 'player2' && player2Team.length < 5) {
      setPlayer2Team(prev => [...prev, player]);
      setMessage(`⚽ ${player.name} rejoint l'équipe du Joueur 2!`);
    }
    
    setAvailablePlayers(prev => prev.filter(p => p.id !== player.id));
    setTimeout(() => {
      nextTurn();
      setMessage('');
    }, 1500);
  };

  const startGame = () => {
    setGameState('drafting');
    setPlayer1Team([]);
    setPlayer2Team([]);
    setRound(1);
    setCurrentTurn('player1');
    setTimer(30);
  };

  const calculateTeamPower = (team) => {
    return team.reduce((total, player) => total + player.power, 0);
  };

  const resetGame = () => {
    setGameState('lobby');
    setPlayer1Team([]);
    setPlayer2Team([]);
    setAvailablePlayers([]);
    setMessage('');
  };

  const renderPlayerCard = (player, isDrafted = false) => (
    <div 
      key={player.id}
      className={`player-card ${isDrafted ? 'drafted' : 'available'}`}
      onClick={() => !isDrafted && draftPlayer(player)}
    >
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
      {!isDrafted && (
        <div className="draft-action">Cliquer pour drafter</div>
      )}
    </div>
  );

  return (
    <div className="inazuma-container">
      <div className="inazuma-header">
        <h1 className="game-title">
          <span className="soccer-ball">⚽</span>
          INAZUMA ELEVEN DRAFT 1v1
          <span className="soccer-ball">⚽</span>
        </h1>
        <p className="game-subtitle">Draft ton équipe et affronte ton adversaire !</p>
      </div>

      {/* Message d'alerte */}
      {message && (
        <div className="alert-message">
          {message}
        </div>
      )}

      {/* Lobby */}
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
              
              <div className="vs-circle">
                VS
              </div>
              
              <div className="team-preview team-red">
                <h3>Joueur 2</h3>
                <div className="team-count">{player2Team.length}/5 joueurs</div>
                <div className="team-power">Puissance: {calculateTeamPower(player2Team)}</div>
              </div>
            </div>
            
            <div className="lobby-controls">
              <button className="btn-start" onClick={startGame}>
                COMMENCER LE DRAFT
              </button>
              <button className="btn-reset" onClick={resetGame}>
                RÉINITIALISER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Draft */}
      {gameState === 'drafting' && (
        <div className="draft-screen">
          <div className="draft-header">
            <div className="round-info">Manche {round}/5</div>
            <div className="timer">⏱️ {timer}s</div>
            <div className="turn-info">
              Tour: <strong>{currentTurn === 'player1' ? 'Joueur 1' : 'Joueur 2'}</strong>
            </div>
          </div>

          <div className="draft-arena">
            {/* Joueur 1 */}
            <div className="team-section team-blue">
              <h3>Joueur 1 ({player1Team.length}/5)</h3>
              <div className="team-players">
                {player1Team.map((player, index) => (
                  <div key={index} className="team-player">
                    {player.element} {player.name}
                  </div>
                ))}
              </div>
              <div className="team-total">
                Total: {calculateTeamPower(player1Team)}
              </div>
            </div>

            {/* Pool de draft */}
            <div className="draft-pool">
              <h3>Joueurs disponibles</h3>
              <div className="available-players">
                {availablePlayers.map(player => renderPlayerCard(player))}
              </div>
              <div className="pool-info">
                {availablePlayers.length} joueur(s) restant(s)
              </div>
            </div>

            {/* Joueur 2 */}
            <div className="team-section team-red">
              <h3>Joueur 2 ({player2Team.length}/5)</h3>
              <div className="team-players">
                {player2Team.map((player, index) => (
                  <div key={index} className="team-player">
                    {player.element} {player.name}
                  </div>
                ))}
              </div>
              <div className="team-total">
                Total: {calculateTeamPower(player2Team)}
              </div>
            </div>
          </div>

          <div className="draft-controls">
            <button className="btn-skip" onClick={nextTurn}>
              PASSER LE TOUR
            </button>
            <button 
              className="btn-end-draft" 
              onClick={() => setGameState('match')}
              disabled={player1Team.length < 5 || player2Team.length < 5}
            >
              TERMINER LE DRAFT
            </button>
          </div>
        </div>
      )}

      {/* Match */}
      {gameState === 'match' && (
        <div className="match-screen">
          <h2>⚔️ MATCH FINAL ⚔️</h2>
          
          <div className="match-arena">
            <div className="match-team team-blue">
              <h3>Joueur 1</h3>
              <div className="match-power">{calculateTeamPower(player1Team)}</div>
              <div className="match-players">
                {player1Team.map((player, index) => (
                  <div key={index} className="match-player">
                    <span className="player-emoji">{player.element}</span>
                    <span className="player-name">{player.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="match-center">
              <div className="score-display">
                {Math.floor(calculateTeamPower(player1Team) / 10)} - {Math.floor(calculateTeamPower(player2Team) / 10)}
              </div>
              <div className="vs-label">VS</div>
            </div>

            <div className="match-team team-red">
              <h3>Joueur 2</h3>
              <div className="match-power">{calculateTeamPower(player2Team)}</div>
              <div className="match-players">
                {player2Team.map((player, index) => (
                  <div key={index} className="match-player">
                    <span className="player-emoji">{player.element}</span>
                    <span className="player-name">{player.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="match-result">
            {calculateTeamPower(player1Team) > calculateTeamPower(player2Team) ? (
              <>
                <div className="winner-badge">🏆</div>
                <h3 className="winner">JOUEUR 1 GAGNE !</h3>
                <p>Avec {calculateTeamPower(player1Team) - calculateTeamPower(player2Team)} points de plus !</p>
              </>
            ) : calculateTeamPower(player2Team) > calculateTeamPower(player1Team) ? (
              <>
                <div className="winner-badge">🏆</div>
                <h3 className="winner">JOUEUR 2 GAGNE !</h3>
                <p>Avec {calculateTeamPower(player2Team) - calculateTeamPower(player1Team)} points de plus !</p>
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
              {techniques.slice(0, 3).map(tech => (
                <div key={tech.id} className="technique">
                  <span className="tech-name">{tech.name}</span>
                  <span className="tech-power">{tech.power}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="match-controls">
            <button className="btn-rematch" onClick={startGame}>
              REVANCHE
            </button>
            <button className="btn-lobby" onClick={resetGame}>
              NOUVEAU MATCH
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="inazuma-footer">
        <div className="instructions">
          <p><strong>Comment jouer :</strong></p>
          <p>1. Chaque joueur draft 5 joueurs à tour de rôle</p>
          <p>2. L'équipe avec la plus haute puissance gagne</p>
          <p>3. 30 secondes par tour</p>
        </div>
      </div>
    </div>
  );
};

export default InazumaDraftGame;
