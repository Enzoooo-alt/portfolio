import React, { useState, useEffect } from "react";
import "./MemoryGame.css";

const allPokemons = [
  { name: "Pikachu", image: "https://img.pokemondb.net/artwork/pikachu.jpg", shiny: "https://img.pokemondb.net/sprites/home/shiny/pikachu.png", type: "Électrik" },
  { name: "Bulbizarre", image: "https://img.pokemondb.net/artwork/bulbasaur.jpg", shiny: "https://img.pokemondb.net/sprites/home/shiny/bulbasaur.png", type: "Plante" },
  { name: "Salamèche", image: "https://img.pokemondb.net/artwork/charmander.jpg", shiny: "https://img.pokemondb.net/sprites/home/shiny/charmander.png", type: "Feu" },
  { name: "Carapuce", image: "https://img.pokemondb.net/artwork/squirtle.jpg", shiny: "https://img.pokemondb.net/sprites/home/shiny/squirtle.png", type: "Eau" },
  { name: "Évoli", image: "https://img.pokemondb.net/artwork/eevee.jpg", shiny: "https://img.pokemondb.net/sprites/home/shiny/eevee.png", type: "Normal" },
  { name: "Mewtwo", image: "https://img.pokemondb.net/artwork/mewtwo.jpg", shiny: "https://img.pokemondb.net/sprites/home/shiny/mewtwo.png", type: "Psy" },
  { name: "Dracaufeu", image: "https://img.pokemondb.net/artwork/charizard.jpg", shiny: "https://img.pokemondb.net/sprites/home/shiny/charizard.png", type: "Feu/Vol" },
  { name: "Florizarre", image: "https://img.pokemondb.net/artwork/venusaur.jpg", shiny: "https://img.pokemondb.net/sprites/home/shiny/venusaur.png", type: "Plante/Poison" },
  { name: "Tortank", image: "https://img.pokemondb.net/artwork/blastoise.jpg", shiny: "https://img.pokemondb.net/sprites/home/shiny/blastoise.png", type: "Eau" },
  { name: "Ronflex", image: "https://img.pokemondb.net/artwork/snorlax.jpg", shiny: "https://img.pokemondb.net/sprites/home/shiny/snorlax.png", type: "Normal" },
  { name: "Ectoplasma", image: "https://img.pokemondb.net/artwork/gengar.jpg", shiny: "https://img.pokemondb.net/sprites/home/shiny/gengar.png", type: "Spectre/Poison" },
  { name: "Dracolosse", image: "https://img.pokemondb.net/artwork/dragonite.jpg", shiny: "https://img.pokemondb.net/sprites/home/shiny/dragonite.png", type: "Dragon/Vol" },
];

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [disableAll, setDisableAll] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState("Facile");
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [matchStreak, setMatchStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [highScores, setHighScores] = useState({
    Facile: { moves: null, time: null },
    Moyen: { moves: null, time: null },
    Difficile: { moves: null, time: null }
  });

  // Configuration des niveaux avec progression logique
  const levelConfig = {
    Facile: {
      pairs: 4,       // 8 cartes (4 paires) - grille 4x2
      description: "8 cartes",
      gridClass: "facile"
    },
    Moyen: {
      pairs: 6,       // 12 cartes (6 paires) - grille 4x3
      description: "12 cartes", 
      gridClass: "moyen"
    },
    Difficile: {
      pairs: 8,       // 16 cartes (8 paires) - grille 4x4
      description: "16 cartes",
      gridClass: "difficile"
    },
    Expert: {
      pairs: 10,      // 20 cartes (10 paires) - grille 5x4
      description: "20 cartes",
      gridClass: "expert"
    },
    Maître: {
      pairs: 12,      // 24 cartes (12 paires) - grille 6x4
      description: "24 cartes",
      gridClass: "maitre"
    }
  };

  // Charger les meilleurs scores - CORRIGÉ
  useEffect(() => {
    const loadScores = () => {
      try {
        const savedScores = localStorage.getItem('pokemonMemoryHighScores');
        if (savedScores) {
          const parsed = JSON.parse(savedScores);
          console.log("Scores chargés:", parsed);
          setHighScores({
            Facile: parsed.Facile || { moves: null, time: null },
            Moyen: parsed.Moyen || { moves: null, time: null },
            Difficile: parsed.Difficile || { moves: null, time: null },
            Expert: parsed.Expert || { moves: null, time: null },
            Maître: parsed.Maître || { moves: null, time: null }
          });
        } else {
          console.log("Pas de scores sauvegardés");
        }
      } catch (error) {
        console.error("Erreur chargement scores:", error);
      }
    };
    
    loadScores();
    // Écouter les changements de localStorage (pour les autres onglets)
    window.addEventListener('storage', loadScores);
    return () => window.removeEventListener('storage', loadScores);
  }, []);

  // Timer
  useEffect(() => {
    if (!gameOver && cards.length > 0 && cards.some(card => !card.isMatched)) {
      const id = setInterval(() => setTimer(t => t + 1), 1000);
      setIntervalId(id);
      return () => clearInterval(id);
    } else if (gameOver || (cards.length > 0 && cards.every(card => card.isMatched))) {
      clearInterval(intervalId);
    }
  }, [gameOver, cards]);

  // Sauvegarder les meilleurs scores - CORRIGÉ
  const saveHighScore = (currentLevel, currentMoves, currentTime) => {
    try {
      const currentBest = highScores[currentLevel] || { moves: null, time: null };
      const hasNoRecord = currentBest.moves === null || currentBest.time === null;
      const isNewRecord = hasNoRecord || 
                         currentMoves < currentBest.moves ||
                         (currentMoves === currentBest.moves && currentTime < currentBest.time);

      console.log(`Vérification record ${currentLevel}:`, {
        current: { moves: currentMoves, time: currentTime },
        best: currentBest,
        hasNoRecord,
        isNewRecord
      });

      if (isNewRecord) {
        const newScores = {
          ...highScores,
          [currentLevel]: { 
            moves: currentMoves, 
            time: currentTime,
            date: new Date().toISOString()
          }
        };
        
        setHighScores(newScores);
        localStorage.setItem('pokemonMemoryHighScores', JSON.stringify(newScores));
        console.log("Nouveau record sauvegardé:", newScores[currentLevel]);
        return true;
      }
    } catch (error) {
      console.error("Erreur sauvegarde score:", error);
    }
    return false;
  };

  // Démarrage du jeu
  const startGame = (selectedLevel = level) => {
    const config = levelConfig[selectedLevel];
    
    // Sélectionner aléatoirement le bon nombre de Pokémon
    const shuffledAll = shuffleArray([...allPokemons]);
    const selectedPokemons = shuffledAll.slice(0, config.pairs);

    let newCards = [];
    selectedPokemons.forEach(pokemon => {
      const isShiny1 = Math.random() < 0.05;
      const isShiny2 = Math.random() < 0.05;

      // Créer la paire
      newCards.push({
        ...pokemon,
        id: `${pokemon.name}-1-${Math.random().toString(36).substr(2, 9)}`,
        isFlipped: false,
        isMatched: false,
        isShiny: isShiny1
      });
      
      newCards.push({
        ...pokemon,
        id: `${pokemon.name}-2-${Math.random().toString(36).substr(2, 9)}`,
        isFlipped: false,
        isMatched: false,
        isShiny: isShiny2
      });
    });

    // Mélanger
    newCards = shuffleArray(newCards);

    setCards(newCards);
    setFlippedCards([]);
    setMoves(0);
    setDisableAll(false);
    setGameOver(false);
    setTimer(0);
    setMatchStreak(0);
    setShowCelebration(false);
    setShowOverlay(false);

    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  // Gestion du clic sur une carte
  const flipCard = (clickedCard) => {
    if (disableAll || clickedCard.isFlipped || clickedCard.isMatched || gameOver) return;

    const updatedCards = cards.map(card => 
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    
    setCards(updatedCards);
    
    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [firstCard, secondCard] = newFlippedCards;
      
      setDisableAll(true);
      setMoves(prev => prev + 1);

      if (firstCard.name === secondCard.name) {
        // Paire trouvée
        setTimeout(() => {
          const matchedCards = updatedCards.map(card => 
            card.name === firstCard.name 
              ? { ...card, isMatched: true, isFlipped: true }
              : card
          );
          
          setCards(matchedCards);
          setFlippedCards([]);
          setDisableAll(false);
          
          const newStreak = matchStreak + 1;
          setMatchStreak(newStreak);
          
          if (newStreak >= 3) {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 1500);
          }
          
          // Fin du jeu
          if (matchedCards.every(card => card.isMatched)) {
            const isNewRecord = saveHighScore(level, moves + 1, timer);
            console.log(`Fin du jeu ${level}. Nouveau record ? ${isNewRecord}`);
            setTimeout(() => {
              setGameOver(true);
              setShowOverlay(true);
            }, 500);
          }
        }, 800);
      } else {
        // Pas une paire
        setMatchStreak(0);
        
        setTimeout(() => {
          const revertedCards = updatedCards.map(card => 
            card.id === firstCard.id || card.id === secondCard.id 
              ? { ...card, isFlipped: false }
              : card
          );
          
          setCards(revertedCards);
          setFlippedCards([]);
          setDisableAll(false);
        }, 1000);
      }
    }
  };

  // Formatage du temps
  const formatTime = (t) => {
    const minutes = Math.floor(t / 60).toString().padStart(2, "0");
    const seconds = (t % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // Formatage des scores
  const formatHighScore = (score) => {
    if (!score || score.moves === null || score.time === null) {
      return 'Aucun record';
    }
    return `${score.moves} coups (${formatTime(score.time)})`;
  };

  // Démarrage automatique
  useEffect(() => {
    startGame();
  }, []);

  const config = levelConfig[level];

  return (
    <div className="memory-game-container">
      <h1>🎮 Memory Game Pokémon</h1>

      <div className="game-info">
        <div className="level-select">
          <label>Niveau : </label>
          <select
            value={level}
            onChange={(e) => {
              setLevel(e.target.value);
              startGame(e.target.value);
            }}
          >
            <option value="Facile">Facile - {levelConfig.Facile.description}</option>
            <option value="Moyen">Moyen - {levelConfig.Moyen.description}</option>
            <option value="Difficile">Difficile - {levelConfig.Difficile.description}</option>
            <option value="Expert">Expert - {levelConfig.Expert.description}</option>
            <option value="Maître">Maître - {levelConfig.Maître.description}</option>
          </select>
        </div>

        <div className="stats">
          <div className="moves" style={{ "--stat-delay": "0s" }}>
            <span>Coups :</span>
            <strong>{moves}</strong>
          </div>
          <div className="timer" style={{ "--stat-delay": "1s" }}>
            <span>Temps :</span>
            <strong>{formatTime(timer)}</strong>
          </div>
        </div>
      </div>

      {showCelebration && matchStreak >= 3 && (
        <div className="streak-celebration">
          <span className="streak-text">🔥 SÉRIE DE {matchStreak} MATCHS ! 🔥</span>
        </div>
      )}

      <p className="instructions">Trouve toutes les paires de Pokémon !</p>

      <div className={`cards-grid ${config.gridClass}`}>
        {cards.map((card) => (
          <div
            key={card.id}
            className={`card ${card.isFlipped ? "flipped" : ""} ${card.isMatched ? "matched" : ""}`}
            onClick={() => flipCard(card)}
          >
            <div className="card-inner">
              <div className={`card-front ${card.isShiny ? "shiny" : ""}`}>
                <img
                  src={card.isShiny ? card.shiny : card.image}
                  alt={card.name}
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://img.pokemondb.net/sprites/home/normal/pikachu.png";
                  }}
                />
                <p>{card.name}{card.isShiny && " ✨"}</p>
                <div className="pokemon-type">{card.type}</div>
              </div>
              
              <div className="card-back">
                <span>?</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showOverlay && <div className="overlay"></div>}
      
      {gameOver && (
        <div className="game-over">
          <h2>🎉 FÉLICITATIONS !</h2>
          <p>Tu as trouvé toutes les paires Pokémon !</p>

          <div className="final-stats">
            <p>Coups : <strong>{moves}</strong></p>
            <p>Temps : <strong>{formatTime(timer)}</strong></p>
            <p>Niveau : <strong>{level}</strong></p>
            <p>Meilleur score : <strong>{formatHighScore(highScores[level])}</strong></p>
            {highScores[level] && highScores[level].moves !== null && 
             moves <= highScores[level].moves && timer <= highScores[level].time && (
              <div className="new-record">🏆 NOUVEAU RECORD ! 🏆</div>
            )}
          </div>

          <div className="game-over-actions">
            <button
              className="restart-btn"
              onClick={() => {
                setGameOver(false);
                setShowOverlay(false);
                startGame(level);
              }}
            >
              🔄 REJOUER
            </button>
            <button
              className="level-btn"
              onClick={() => {
                const levels = Object.keys(levelConfig);
                const currentIndex = levels.indexOf(level);
                const nextLevel = levels[(currentIndex + 1) % levels.length];
                setLevel(nextLevel);
                setGameOver(false);
                setShowOverlay(false);
                startGame(nextLevel);
              }}
            >
              📈 NIVEAU SUIVANT
            </button>
          </div>
        </div>
      )}

      {cards.length === 0 && (
        <div className="loading">
          <button
            className="start-btn"
            onClick={() => startGame(level)}
          >
            COMMENCER LE JEU
          </button>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;
