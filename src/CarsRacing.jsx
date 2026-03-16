import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './CarsRacing.css';

const CarsRacing = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const lastTimeRef = useRef(0);
  
  // État du jeu
  const [gameState, setGameState] = useState('menu'); // menu, playing, paused, gameover
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [playerCar, setPlayerCar] = useState({ x: 150, y: 500, speed: 0, maxSpeed: 8, acceleration: 0.2, rotation: 0 });
  const [obstacles, setObstacles] = useState([]);
  const [coins, setCoins] = useState([]);
  const [roadLines, setRoadLines] = useState([]);
  const [boostActive, setBoostActive] = useState(false);
  const [boostCount, setBoostCount] = useState(3);
  const [nitroActive, setNitroActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(1);
  const [comboTimer, setComboTimer] = useState(0);
  const [selectedCar, setSelectedCar] = useState(0);
  const [selectedTrack, setSelectedTrack] = useState(0);
  
  // Références pour les contrôles
  const keys = useRef({});
  const gameTime = useRef(0);
  const obstacleTimer = useRef(0);
  const coinTimer = useRef(0);
  const roadTimer = useRef(0);
  
  // Voitures disponibles
  const cars = [
    { name: "Flash McQueen", color: "#FF0000", speed: 8, acceleration: 0.25, icon: "🏎️" },
    { name: "Drift King", color: "#4169E1", speed: 7.5, acceleration: 0.3, icon: "🚗" },
    { name: "Speed Demon", color: "#FFD700", speed: 9, acceleration: 0.2, icon: "🚓" },
    { name: "Night Rider", color: "#2F4F4F", speed: 7, acceleration: 0.35, icon: "🚙" },
    { name: "Green Lightning", color: "#00FF00", speed: 8.5, acceleration: 0.22, icon: "🚕" },
  ];
  
  // Circuits disponibles
  const tracks = [
    { name: "Route 66", color: "#708090", bgColor: "#87CEEB", obstacleColor: "#8B4513", icon: "🛣️" },
    { name: "Circuit Urbain", color: "#696969", bgColor: "#4682B4", obstacleColor: "#A9A9A9", icon: "🏙️" },
    { name: "Montagne", color: "#556B2F", bgColor: "#32CD32", obstacleColor: "#8B7355", icon: "⛰️" },
    { name: "Désert", color: "#D2B48C", bgColor: "#F0E68C", obstacleColor: "#CD853F", icon: "🏜️" },
    { name: "Arc-en-ciel", color: "#FF69B4", bgColor: "#9370DB", obstacleColor: "#FFD700", icon: "🌈" },
  ];

  // Initialisation du jeu
  useEffect(() => {
    const savedHighScore = localStorage.getItem('carsRacingHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
    
    // Initialiser les lignes de la route
    const initialLines = [];
    for (let i = 0; i < 10; i++) {
      initialLines.push({ x: 150, y: i * 80 });
    }
    setRoadLines(initialLines);
    
    // Gestion des touches clavier
    const handleKeyDown = (e) => {
      keys.current[e.key] = true;
      
      // Toggle pause avec la touche P
      if (e.key === 'p' && gameState === 'playing') {
        setGameState('paused');
      } else if (e.key === 'p' && gameState === 'paused') {
        setGameState('playing');
      }
      
      // Activer boost avec B
      if (e.key === 'b' && gameState === 'playing' && boostCount > 0 && !boostActive) {
        activateBoost();
      }
      
      // Activer nitro avec N
      if (e.key === 'n' && gameState === 'playing' && !nitroActive) {
        activateNitro();
      }
      
      // Retour au menu avec Escape
      if (e.key === 'Escape') {
        if (gameState === 'playing' || gameState === 'paused') {
          setGameState('menu');
        }
      }
    };
    
    const handleKeyUp = (e) => {
      keys.current[e.key] = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameState, boostCount, boostActive]);

  // Boucle principale du jeu
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const gameLoop = (currentTime) => {
      const deltaTime = Math.min((currentTime - lastTimeRef.current) / 16.67, 2.5);
      
      if (deltaTime > 0) {
        updateGame(deltaTime);
        drawGame();
      }
      
      lastTimeRef.current = currentTime;
      requestRef.current = requestAnimationFrame(gameLoop);
    };
    
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameState, obstacles, coins, roadLines]);

  // Timer du jeu
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          gameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameState]);

  // Gestion des combos
  useEffect(() => {
    if (comboTimer <= 0) return;
    
    const timer = setTimeout(() => {
      setComboTimer(prev => prev - 1);
    }, 1000);
    
    if (comboTimer <= 0) {
      setCombo(1);
    }
    
    return () => clearTimeout(timer);
  }, [comboTimer]);

  const updateGame = useCallback((deltaTime) => {
    gameTime.current += deltaTime;
    obstacleTimer.current += deltaTime;
    coinTimer.current += deltaTime;
    roadTimer.current += deltaTime;
    
    // Mettre à jour le joueur
    updatePlayer(deltaTime);
    
    // Générer obstacles
    if (obstacleTimer.current > (100 - level * 5)) {
      generateObstacle();
      obstacleTimer.current = 0;
    }
    
    // Générer pièces
    if (coinTimer.current > 50) {
      generateCoin();
      coinTimer.current = 0;
    }
    
    // Mettre à jour les lignes de la route
    if (roadTimer.current > 5) {
      updateRoadLines();
      roadTimer.current = 0;
    }
    
    // Mettre à jour obstacles
    setObstacles(prev => prev
      .map(obs => ({
        ...obs,
        y: obs.y + (playerCar.speed + level * 0.5) * deltaTime
      }))
      .filter(obs => obs.y < 600)
    );
    
    // Mettre à jour pièces
    setCoins(prev => prev
      .map(coin => ({
        ...coin,
        y: coin.y + (playerCar.speed + level * 0.5) * deltaTime,
        rotation: coin.rotation + 5 * deltaTime
      }))
      .filter(coin => coin.y < 600)
    );
    
    // Vérifier les collisions
    checkCollisions();
    
    // Mettre à jour le score
    setScore(prev => prev + Math.floor(playerCar.speed * combo * deltaTime * 0.1));
  }, [playerCar, level, combo]);

  const updatePlayer = useCallback((deltaTime) => {
    const speedMultiplier = boostActive ? 1.5 : nitroActive ? 2 : 1;
    const maxSpeed = cars[selectedCar].speed * speedMultiplier;
    const acceleration = cars[selectedCar].acceleration * (boostActive ? 1.3 : 1);
    
    let newSpeed = playerCar.speed;
    let newRotation = playerCar.rotation;
    
    // Accélération
    if (keys.current['ArrowUp'] || keys.current['w']) {
      newSpeed = Math.min(newSpeed + acceleration * deltaTime, maxSpeed);
    } else {
      newSpeed = Math.max(newSpeed - acceleration * 0.5 * deltaTime, 0);
    }
    
    // Rotation
    if (keys.current['ArrowLeft'] || keys.current['a']) {
      newRotation = Math.max(newRotation - 4 * deltaTime, -30);
    } else if (keys.current['ArrowRight'] || keys.current['d']) {
      newRotation = Math.min(newRotation + 4 * deltaTime, 30);
    } else {
      newRotation *= 0.9; // Retour au centre
    }
    
    // Déplacement latéral avec limite
    const maxX = 300;
    const minX = 0;
    let newX = playerCar.x + (newRotation * 0.5 * deltaTime);
    
    if (newX > maxX) newX = maxX;
    if (newX < minX) newX = minX;
    
    setPlayerCar(prev => ({
      ...prev,
      x: newX,
      speed: newSpeed,
      rotation: newRotation
    }));
  }, [boostActive, nitroActive, selectedCar]);

  const generateObstacle = useCallback(() => {
    const types = ['cone', 'barrel', 'car', 'truck'];
    const type = types[Math.floor(Math.random() * types.length)];
    const size = type === 'truck' ? 60 : type === 'car' ? 40 : 25;
    
    const newObstacle = {
      x: Math.random() * 250 + 25,
      y: -50,
      type,
      size,
      color: tracks[selectedTrack].obstacleColor,
      id: Date.now() + Math.random()
    };
    
    setObstacles(prev => [...prev, newObstacle]);
  }, [selectedTrack]);

  const generateCoin = useCallback(() => {
    const types = ['gold', 'silver', 'bronze'];
    const type = types[Math.floor(Math.random() * types.length)];
    const value = type === 'gold' ? 50 : type === 'silver' ? 25 : 10;
    
    const newCoin = {
      x: Math.random() * 280 + 10,
      y: -30,
      type,
      value,
      rotation: 0,
      id: Date.now() + Math.random()
    };
    
    setCoins(prev => [...prev, newCoin]);
  }, []);

  const updateRoadLines = useCallback(() => {
    setRoadLines(prev => {
      const newLines = prev.map(line => ({
        ...line,
        y: line.y + playerCar.speed * 2
      })).filter(line => line.y < 600);
      
      if (newLines.length < 10) {
        const lastY = newLines.length > 0 ? newLines[newLines.length - 1].y : 0;
        newLines.push({ x: 150, y: lastY - 80 });
      }
      
      return newLines;
    });
  }, [playerCar.speed]);

  const checkCollisions = useCallback(() => {
    const playerRect = {
      x: playerCar.x - 15,
      y: playerCar.y - 30,
      width: 30,
      height: 60
    };
    
    // Collision avec obstacles
    obstacles.forEach(obs => {
      const obsRect = {
        x: obs.x - obs.size / 2,
        y: obs.y - obs.size / 2,
        width: obs.size,
        height: obs.size
      };
      
      if (checkRectCollision(playerRect, obsRect)) {
        if (boostActive) {
          setScore(prev => prev + 100);
          setObstacles(prev => prev.filter(o => o.id !== obs.id));
        } else {
          setCombo(1);
          setComboTimer(0);
          gameOver();
        }
      }
    });
    
    // Collecte de pièces
    coins.forEach(coin => {
      const coinRect = {
        x: coin.x - 15,
        y: coin.y - 15,
        width: 30,
        height: 30
      };
      
      if (checkRectCollision(playerRect, coinRect)) {
        const value = coin.value * combo;
        setScore(prev => prev + value);
        setCoins(prev => prev.filter(c => c.id !== coin.id));
        
        if (coin.type === 'gold') {
          setComboTimer(10);
          setCombo(prev => Math.min(prev + 0.5, 5));
          setBoostCount(prev => Math.min(prev + 1, 5));
        } else if (coin.type === 'silver') {
          setComboTimer(5);
          setCombo(prev => Math.min(prev + 0.2, 5));
        }
        
        // Effet visuel de collection
        createParticles(coin.x, coin.y, coin.type === 'gold' ? '#FFD700' : '#C0C0C0');
      }
    });
  }, [playerCar, obstacles, coins, boostActive, combo]);

  const checkRectCollision = (rect1, rect2) => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  };

  const createParticles = (x, y, color) => {
    // Effet visuel de particules
    console.log("Particules créées à", x, y, "couleur", color);
  };

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dessiner l'arrière-plan
    const track = tracks[selectedTrack];
    ctx.fillStyle = track.bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dessiner la route
    ctx.fillStyle = track.color;
    ctx.fillRect(50, 0, 200, canvas.height);
    
    // Dessiner les lignes de la route
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.setLineDash([20, 20]);
    
    roadLines.forEach(line => {
      ctx.beginPath();
      ctx.moveTo(line.x, line.y);
      ctx.lineTo(line.x, line.y + 40);
      ctx.stroke();
    });
    
    ctx.setLineDash([]);
    
    // Dessiner les obstacles
    obstacles.forEach(obs => {
      ctx.fillStyle = obs.color;
      if (obs.type === 'cone') {
        ctx.beginPath();
        ctx.moveTo(obs.x, obs.y);
        ctx.lineTo(obs.x - obs.size/2, obs.y + obs.size);
        ctx.lineTo(obs.x + obs.size/2, obs.y + obs.size);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillRect(obs.x - obs.size/2, obs.y - obs.size/2, obs.size, obs.size);
      }
    });
    
    // Dessiner les pièces
    coins.forEach(coin => {
      ctx.save();
      ctx.translate(coin.x, coin.y);
      ctx.rotate(coin.rotation * Math.PI / 180);
      
      ctx.fillStyle = coin.type === 'gold' ? '#FFD700' : 
                      coin.type === 'silver' ? '#C0C0C0' : '#CD7F32';
      
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = coin.type === 'gold' ? '#FFA500' : 
                      coin.type === 'silver' ? '#FFFFFF' : '#A0522D';
      
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    });
    
    // Dessiner la voiture du joueur
    ctx.save();
    ctx.translate(playerCar.x, playerCar.y);
    ctx.rotate(playerCar.rotation * Math.PI / 180);
    
    // Corps de la voiture
    ctx.fillStyle = cars[selectedCar].color;
    ctx.fillRect(-15, -30, 30, 60);
    
    // Fenêtres
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(-10, -20, 20, 15);
    ctx.fillRect(-10, 5, 20, 15);
    
    // Roues
    ctx.fillStyle = '#000000';
    ctx.fillRect(-20, -35, 10, 10);
    ctx.fillRect(10, -35, 10, 10);
    ctx.fillRect(-20, 25, 10, 10);
    ctx.fillRect(10, 25, 10, 10);
    
    // Éffet nitro
    if (nitroActive) {
      ctx.fillStyle = '#00FFFF';
      ctx.beginPath();
      ctx.moveTo(0, 30);
      ctx.lineTo(-10, 60);
      ctx.lineTo(10, 60);
      ctx.closePath();
      ctx.fill();
    }
    
    ctx.restore();
    
    // Dessiner les informations du jeu
    drawHUD(ctx);
  }, [playerCar, obstacles, coins, roadLines, selectedCar, selectedTrack, nitroActive]);

  const drawHUD = (ctx) => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 200, 150);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px Arial';
    ctx.fillText(`Score: ${score}`, 20, 30);
    ctx.fillText(`High Score: ${highScore}`, 20, 50);
    ctx.fillText(`Time: ${timeLeft}s`, 20, 70);
    ctx.fillText(`Level: ${level}`, 20, 90);
    ctx.fillText(`Speed: ${playerCar.speed.toFixed(1)}`, 20, 110);
    ctx.fillText(`Boost: ${boostCount}`, 20, 130);
    ctx.fillText(`Combo: x${combo.toFixed(1)}`, 20, 150);
    
    // Effet de boost
    if (boostActive) {
      ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
      ctx.fillRect(0, 0, 320, 600);
    }
    
    // Effet de nitro
    if (nitroActive) {
      ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
      ctx.fillRect(0, 0, 320, 600);
    }
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(60);
    setLevel(1);
    setCombo(1);
    setBoostCount(3);
    setObstacles([]);
    setCoins([]);
    setBoostActive(false);
    setNitroActive(false);
    
    // Réinitialiser la voiture
    setPlayerCar({
      x: 150,
      y: 500,
      speed: 0,
      maxSpeed: cars[selectedCar].speed,
      acceleration: cars[selectedCar].acceleration,
      rotation: 0
    });
  };

  const gameOver = () => {
    setGameState('gameover');
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('carsRacingHighScore', score.toString());
    }
  };

  const activateBoost = () => {
    if (boostCount > 0) {
      setBoostActive(true);
      setBoostCount(prev => prev - 1);
      setTimeout(() => {
        setBoostActive(false);
      }, 5000); // Boost dure 5 secondes
    }
  };

  const activateNitro = () => {
    setNitroActive(true);
    setTimeout(() => {
      setNitroActive(false);
    }, 3000); // Nitro dure 3 secondes
  };

  const nextLevel = () => {
    setLevel(prev => prev + 1);
    setTimeLeft(prev => prev + 30); // Ajoute 30 secondes
    setScore(prev => prev + 1000); // Bonus de niveau
    setBoostCount(prev => prev + 1); // Gain de boost
  };

  return (
    <div className="cars-racing">
      {/* Bouton retour */}
      <button className="back-button" onClick={() => navigate('/menu')}>
        ← Retour au menu
      </button>

      <div className="game-container">
        {/* Menu principal */}
        {gameState === 'menu' && (
          <div className="menu-screen">
            <div className="menu-header">
              <h1 className="game-title">🏁 CARS RACING ULTIMATE 🏁</h1>
              <p className="game-subtitle">Course à haute vitesse avec boost et nitro !</p>
            </div>

            <div className="menu-content">
              <div className="car-selection">
                <h2>🚗 Choisis ta voiture</h2>
                <div className="cars-grid">
                  {cars.map((car, index) => (
                    <div
                      key={index}
                      className={`car-option ${selectedCar === index ? 'selected' : ''}`}
                      onClick={() => setSelectedCar(index)}
                      style={{ borderColor: car.color }}
                    >
                      <div className="car-icon">{car.icon}</div>
                      <div className="car-name">{car.name}</div>
                      <div className="car-stats">
                        <div>⚡ Vitesse: {car.speed}</div>
                        <div>🚀 Accél: {car.acceleration}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="track-selection">
                <h2>🛣️ Choisis ton circuit</h2>
                <div className="tracks-grid">
                  {tracks.map((track, index) => (
                    <div
                      key={index}
                      className={`track-option ${selectedTrack === index ? 'selected' : ''}`}
                      onClick={() => setSelectedTrack(index)}
                      style={{ backgroundColor: track.bgColor, borderColor: track.color }}
                    >
                      <div className="track-icon">{track.icon}</div>
                      <div className="track-name">{track.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="menu-actions">
                <button className="start-btn" onClick={startGame}>
                  🏁 COMMENCER LA COURSE
                </button>
                <div className="high-score">
                  🏆 Meilleur score: <span>{highScore}</span>
                </div>
              </div>

              <div className="controls-info">
                <h3>🎮 Contrôles</h3>
                <div className="controls-grid">
                  <div>⬆️ / W : Accélérer</div>
                  <div>⬅️ / A : Gauche</div>
                  <div>➡️ / D : Droite</div>
                  <div>B : Boost (x{boostCount})</div>
                  <div>N : Nitro</div>
                  <div>P : Pause</div>
                  <div>Escape : Menu</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Écran de jeu */}
        {gameState === 'playing' && (
          <div className="game-screen">
            <canvas
              ref={canvasRef}
              width={320}
              height={600}
              className="game-canvas"
            />
            <div className="game-controls-overlay">
              <button className="control-btn boost-btn" onClick={activateBoost} disabled={boostCount === 0 || boostActive}>
                ⚡ Boost ({boostCount})
              </button>
              <button className="control-btn nitro-btn" onClick={activateNitro} disabled={nitroActive}>
                🔥 Nitro
              </button>
              <button className="control-btn pause-btn" onClick={() => setGameState('paused')}>
                ⏸️ Pause
              </button>
            </div>
          </div>
        )}

        {/* Écran de pause */}
        {gameState === 'paused' && (
          <div className="pause-screen">
            <h2>⏸️ JEU EN PAUSE</h2>
            <div className="pause-stats">
              <div>Score: {score}</div>
              <div>Temps restant: {timeLeft}s</div>
              <div>Niveau: {level}</div>
              <div>Combo: x{combo.toFixed(1)}</div>
            </div>
            <div className="pause-actions">
              <button className="pause-btn" onClick={() => setGameState('playing')}>
                ▶️ Reprendre
              </button>
              <button className="menu-btn" onClick={() => setGameState('menu')}>
                🏠 Menu
              </button>
            </div>
          </div>
        )}

        {/* Écran de game over */}
        {gameState === 'gameover' && (
          <div className="gameover-screen">
            <h2>💥 GAME OVER</h2>
            <div className="gameover-stats">
              <div className="final-score">Score final: {score}</div>
              <div className="high-score-display">
                Meilleur score: {Math.max(score, highScore)}
              </div>
              <div className="level-reached">Niveau atteint: {level}</div>
              <div className="time-played">Temps joué: {60 - timeLeft}s</div>
            </div>
            <div className="gameover-actions">
              <button className="restart-btn" onClick={startGame}>
                🔄 Rejouer
              </button>
              <button className="menu-btn" onClick={() => setGameState('menu')}>
                🏠 Menu
              </button>
              {level >= 3 && timeLeft > 0 && (
                <button className="next-level-btn" onClick={nextLevel}>
                  ⬆️ Niveau {level + 1}
                </button>
              )}
            </div>
            <div className="achievements">
              <h3>🏆 Récompenses</h3>
              <div className="achievement-list">
                <div className={score >= 1000 ? 'achievement unlocked' : 'achievement'}>
                  {score >= 1000 ? '⭐' : '○'} Score 1000
                </div>
                <div className={score >= 5000 ? 'achievement unlocked' : 'achievement'}>
                  {score >= 5000 ? '⭐⭐' : '○'} Score 5000
                </div>
                <div className={level >= 5 ? 'achievement unlocked' : 'achievement'}>
                  {level >= 5 ? '⭐⭐⭐' : '○'} Niveau 5
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Affichage mobile */}
      <div className="mobile-controls">
        <div className="mobile-buttons">
          <button 
            className="mobile-btn left-btn"
            onTouchStart={() => keys.current['ArrowLeft'] = true}
            onTouchEnd={() => keys.current['ArrowLeft'] = false}
          >
            ◀️
          </button>
          <button 
            className="mobile-btn up-btn"
            onTouchStart={() => keys.current['ArrowUp'] = true}
            onTouchEnd={() => keys.current['ArrowUp'] = false}
          >
            ⬆️
          </button>
          <button 
            className="mobile-btn right-btn"
            onTouchStart={() => keys.current['ArrowRight'] = true}
            onTouchEnd={() => keys.current['ArrowRight'] = false}
          >
            ▶️
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarsRacing;
