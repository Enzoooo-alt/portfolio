import React, { useState, useEffect, useRef } from 'react';
import '../styles/pages/DemonSlayer.css';

const DemonSlayerEncyclopedia = () => {
  const [activeTab, setActiveTab] = useState('characters');
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filteredBreath, setFilteredBreath] = useState('all');
  const [characterImages, setCharacterImages] = useState({});
  const heroRef = useRef(null);

  const fallbackCharacterImages = {
    tanjiro: 'https://ui-avatars.com/api/?name=Tanjiro+Kamado&background=0f172a&color=ffffff&size=420&format=png',
    nezuko: 'https://ui-avatars.com/api/?name=Nezuko+Kamado&background=0f172a&color=ffffff&size=420&format=png',
    zenitsu: 'https://ui-avatars.com/api/?name=Zenitsu+Agatsuma&background=0f172a&color=ffffff&size=420&format=png',
    inosuke: 'https://ui-avatars.com/api/?name=Inosuke+Hashibira&background=0f172a&color=ffffff&size=420&format=png',
    rengoku: 'https://ui-avatars.com/api/?name=Kyojuro+Rengoku&background=0f172a&color=ffffff&size=420&format=png',
    giyu: 'https://ui-avatars.com/api/?name=Giyu+Tomioka&background=0f172a&color=ffffff&size=420&format=png',
    shinobu: 'https://ui-avatars.com/api/?name=Shinobu+Kocho&background=0f172a&color=ffffff&size=420&format=png',
    mitsuri: 'https://ui-avatars.com/api/?name=Mitsuri+Kanroji&background=0f172a&color=ffffff&size=420&format=png',
    muzan: 'https://ui-avatars.com/api/?name=Muzan+Kibutsuji&background=0f172a&color=ffffff&size=420&format=png',
    kokushibo: 'https://ui-avatars.com/api/?name=Kokushibo&background=0f172a&color=ffffff&size=420&format=png',
    akaza: 'https://ui-avatars.com/api/?name=Akaza&background=0f172a&color=ffffff&size=420&format=png',
    doma: 'https://ui-avatars.com/api/?name=Doma&background=0f172a&color=ffffff&size=420&format=png'
  };

  const imageQueries = {
    tanjiro: 'Tanjiro Kamado',
    nezuko: 'Nezuko Kamado',
    zenitsu: 'Zenitsu Agatsuma',
    inosuke: 'Inosuke Hashibira',
    rengoku: 'Kyojuro Rengoku',
    giyu: 'Giyu Tomioka',
    shinobu: 'Shinobu Kocho',
    mitsuri: 'Mitsuri Kanroji',
    muzan: 'Muzan Kibutsuji',
    kokushibo: 'Kokushibo',
    akaza: 'Akaza',
    doma: 'Doma'
  };

  // Données des statistiques
  const statsData = [
    {
      id: 1,
      number: "24",
      label: "Personnages",
      description: "12 Pourfendeurs, 6 Pilliers, 6 Démons",
      color: "var(--blood-red)"
    },
    {
      id: 2,
      number: "14",
      label: "Techniques de Souffle",
      description: "Styles de combat ancestraux",
      color: "var(--water-blue)"
    },
    {
      id: 3,
      number: "12",
      label: "Lunes Supérieures",
      description: "Démons de rang suprême",
      color: "var(--moon-purple)"
    },
    {
      id: 4,
      number: "156",
      label: "Mouvements Totaux",
      description: "Techniques enregistrées",
      color: "var(--thunder-yellow)"
    }
  ];

  // Données des personnages
  const charactersData = [
    {
      id: 1,
      name: "Tanjiro Kamado",
      role: "Pourfendeur de l'Eau",
      type: "human",
      rank: "A",
      breath: "Souffle de l'Eau",
      moves: 13,
      status: "Actif",
      image: characterImages.tanjiro || fallbackCharacterImages.tanjiro,
      description: "Jeune pourfendeur déterminé à sauver sa sœur transformée en démon.",
      color: "var(--water-blue)"
    },
    {
      id: 2,
      name: "Nezuko Kamado",
      role: "Démon Protecteur",
      type: "demon",
      rank: "S",
      breath: null,
      moves: 8,
      status: "Actif",
      image: characterImages.nezuko || fallbackCharacterImages.nezuko,
      description: "Sœur de Tanjiro, démon qui protège les humains.",
      color: "var(--insect-pink)"
    },
    {
      id: 3,
      name: "Zenitsu Agatsuma",
      role: "Pourfendeur de la Foudre",
      type: "human",
      rank: "B",
      breath: "Souffle de la Foudre",
      moves: 7,
      status: "Actif",
      image: characterImages.zenitsu || fallbackCharacterImages.zenitsu,
      description: "Pourfendeur peureux mais extrêmement rapide.",
      color: "var(--thunder-yellow)"
    },
    {
      id: 4,
      name: "Inosuke Hashibira",
      role: "Pourfendeur de la Bête",
      type: "human",
      rank: "B",
      breath: "Souffle de la Bête",
      moves: 11,
      status: "Actif",
      image: characterImages.inosuke || fallbackCharacterImages.inosuke,
      description: "Combattant sauvage élevé par des sangliers.",
      color: "var(--beast-green)"
    },
    {
      id: 5,
      name: "Kyojuro Rengoku",
      role: "Pillier de la Flamme",
      type: "pillar",
      rank: "S+",
      breath: "Souffle de la Flamme",
      moves: 9,
      status: "Légendaire",
      image: characterImages.rengoku || fallbackCharacterImages.rengoku,
      description: "Pillier passionné au cœur brûlant.",
      color: "var(--flame-orange)"
    },
    {
      id: 6,
      name: "Giyu Tomioka",
      role: "Pillier de l'Eau",
      type: "pillar",
      rank: "S+",
      breath: "Souffle de l'Eau",
      moves: 11,
      status: "Actif",
      image: characterImages.giyu || fallbackCharacterImages.giyu,
      description: "Pillier silencieux mais extrêmement puissant.",
      color: "var(--water-blue)"
    },
    {
      id: 7,
      name: "Shinobu Kocho",
      role: "Pillier de l'Insecte",
      type: "pillar",
      rank: "S",
      breath: "Souffle de l'Insecte",
      moves: 4,
      status: "Actif",
      image: characterImages.shinobu || fallbackCharacterImages.shinobu,
      description: "Pillier rapide utilisant le poison.",
      color: "var(--insect-pink)"
    },
    {
      id: 8,
      name: "Mitsuri Kanroji",
      role: "Pillier de l'Amour",
      type: "pillar",
      rank: "S",
      breath: "Souffle de l'Amour",
      moves: 6,
      status: "Actif",
      image: characterImages.mitsuri || fallbackCharacterImages.mitsuri,
      description: "Pillier au cœur tendre et à la force exceptionnelle.",
      color: "var(--love-coral)"
    },
    {
      id: 9,
      name: "Muzan Kibutsuji",
      role: "Démon Originel",
      type: "demon",
      rank: "SSS",
      breath: null,
      moves: 12,
      status: "Actif",
      image: characterImages.muzan || fallbackCharacterImages.muzan,
      description: "Premier démon, cherche l'immortalité parfaite.",
      color: "var(--blood-red)",
      moon: "Lune Supérieure 0"
    },
    {
      id: 10,
      name: "Kokushibo",
      role: "Lune Supérieure 1",
      type: "demon",
      rank: "SSS",
      breath: "Souffle de la Lune",
      moves: 16,
      status: "Actif",
      image: characterImages.kokushibo || fallbackCharacterImages.kokushibo,
      description: "Lune la plus puissante, ancien pourfendeur.",
      color: "var(--moon-purple)",
      moon: "Lune Supérieure 1"
    },
    {
      id: 11,
      name: "Akaza",
      role: "Lune Supérieure 3",
      type: "demon",
      rank: "SS",
      breath: null,
      moves: 11,
      status: "Actif",
      image: characterImages.akaza || fallbackCharacterImages.akaza,
      description: "Combattant au corps à corps exceptionnel.",
      color: "var(--blood-red)",
      moon: "Lune Supérieure 3"
    },
    {
      id: 12,
      name: "Doma",
      role: "Lune Supérieure 2",
      type: "demon",
      rank: "SS",
      breath: null,
      moves: 8,
      status: "Actif",
      image: characterImages.doma || fallbackCharacterImages.doma,
      description: "Démon manipulateur aux techniques de glace.",
      color: "var(--water-blue)",
      moon: "Lune Supérieure 2"
    }
  ];

  // Données des souffles
  const breathsData = [
    {
      id: 1,
      name: "Souffle de l'Eau",
      icon: "💧",
      forms: 11,
      users: ["Tanjiro", "Giyu", "Sabito"],
      description: "Style fluide adapté à la défense et contre-attaque.",
      color: "var(--water-blue)"
    },
    {
      id: 2,
      name: "Souffle de la Foudre",
      icon: "⚡",
      forms: 7,
      users: ["Zenitsu", "Kaigaku"],
      description: "Vitesse extrême et frappes foudroyantes.",
      color: "var(--thunder-yellow)"
    },
    {
      id: 3,
      name: "Souffle de la Flamme",
      icon: "🔥",
      forms: 9,
      users: ["Kyojuro", "Shinjuro"],
      description: "Puissance brute et attaques brûlantes.",
      color: "var(--flame-orange)"
    },
    {
      id: 4,
      name: "Souffle de la Bête",
      icon: "🐗",
      forms: 11,
      users: ["Inosuke"],
      description: "Style sauvage et instinctif.",
      color: "var(--beast-green)"
    },
    {
      id: 5,
      name: "Souffle de l'Insecte",
      icon: "🦋",
      forms: 4,
      users: ["Shinobu"],
      description: "Rapidité et techniques empoisonnées.",
      color: "var(--insect-pink)"
    },
    {
      id: 6,
      name: "Souffle de l'Amour",
      icon: "❤️",
      forms: 6,
      users: ["Mitsuri"],
      description: "Force exceptionnelle et flexibilité.",
      color: "var(--love-coral)"
    },
    {
      id: 7,
      name: "Souffle de la Lune",
      icon: "🌙",
      forms: 16,
      users: ["Kokushibo"],
      description: "Style démoniaque lunaire dévastateur.",
      color: "var(--moon-purple)"
    }
  ];

  // Filtrage des données
  const filteredCharacters = charactersData.filter(char => {
    const matchesSearch = char.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         char.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (char.breath && char.breath.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filteredBreath === 'all' ||
                       (filteredBreath === 'human' && char.type === 'human') ||
                       (filteredBreath === 'pillar' && char.type === 'pillar') ||
                       (filteredBreath === 'demon' && char.type === 'demon') ||
                       (filteredBreath === 'water' && char.breath === 'Souffle de l\'Eau') ||
                       (filteredBreath === 'fire' && char.breath === 'Souffle de la Flamme') ||
                       (filteredBreath === 'thunder' && char.breath === 'Souffle de la Foudre');
    
    return matchesSearch && matchesType;
  });

  const filteredBreaths = breathsData.filter(breath =>
    breath.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    breath.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    let cancelled = false;

    const fetchCharacterImages = async () => {
      const entries = Object.entries(imageQueries);
      const results = await Promise.all(
        entries.map(async ([key, query]) => {
          try {
            const response = await fetch(`https://api.jikan.moe/v4/characters?q=${encodeURIComponent(query)}&limit=1`);
            if (!response.ok) {
              return [key, fallbackCharacterImages[key]];
            }
            const payload = await response.json();
            const image =
              payload?.data?.[0]?.images?.webp?.image_url ||
              payload?.data?.[0]?.images?.jpg?.image_url ||
              fallbackCharacterImages[key];
            return [key, image];
          } catch {
            return [key, fallbackCharacterImages[key]];
          }
        })
      );

      if (!cancelled) {
        setCharacterImages(Object.fromEntries(results));
      }
    };

    fetchCharacterImages();

    return () => {
      cancelled = true;
    };
  }, []);

  // Effet pour particules animées
  useEffect(() => {
    const createParticles = () => {
      const container = document.querySelector('.animated-bg');
      if (!container) return;

      // Nettoyer les anciennes particules
      container.innerHTML = '';

      // Créer 10 particules
      for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Position aléatoire
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        
        // Taille aléatoire
        const size = 50 + Math.random() * 150;
        
        // Couleur aléatoire
        const colors = [
          'var(--blood-red)',
          'var(--water-blue)',
          'var(--thunder-yellow)',
          'var(--flame-orange)',
          'var(--moon-purple)'
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Animation aléatoire
        const duration = 15 + Math.random() * 15;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
          left: ${left}%;
          top: ${top}%;
          width: ${size}px;
          height: ${size}px;
          background: ${color};
          animation-delay: ${delay}s;
          animation-duration: ${duration}s;
        `;
        
        container.appendChild(particle);
      }
    };

    createParticles();
    
    // Recréer les particules toutes les 30 secondes
    const interval = setInterval(createParticles, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Animation du header
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.stat-card, .character-card, .breath-card');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Rendu des statistiques
  const renderStats = () => (
    <section className="stats-section">
      <div className="stats-grid">
        {statsData.map(stat => (
          <div key={stat.id} className="stat-card water-effect">
            <div className="stat-content">
              <div className="stat-number" style={{ color: stat.color }}>
                {stat.number}
              </div>
              <h3 className="stat-label">{stat.label}</h3>
              <p className="stat-description">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  // Rendu des personnages
  const renderCharacters = () => (
    <div className="characters-grid">
      {filteredCharacters.map(char => (
        <div
          key={char.id}
          className="character-card blood-effect"
          onClick={() => setSelectedCharacter(char)}
          style={{ '--accent-color': char.color }}
        >
          <div className="card-image">
            <img 
              src={char.image} 
              alt={char.name}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div className="image-fallback" style={{ display: 'none' }}>
              <div className="fallback-content">
                <span className="fallback-icon">
                  {char.type === 'demon' ? '👹' : 
                   char.type === 'pillar' ? '⚔️' : '🗡️'}
                </span>
                <span className="fallback-name">{char.name}</span>
              </div>
            </div>
            <div className="type-badge">
              {char.type === 'pillar' ? 'PILLIER' : 
               char.type === 'demon' ? 'DÉMON' : 'POURFENDEUR'}
            </div>
            {char.moon && <div className="rank-badge">{char.moon.split(' ')[2]}</div>}
          </div>
          
          <div className="card-content">
            <h3 className="card-title">{char.name}</h3>
            <p className="card-role">{char.role}</p>
            
            <div className="card-stats">
              <div className="stat-item">
                <span className="stat-label-small">Rang</span>
                <span className="stat-value">{char.rank}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label-small">Mouvements</span>
                <span className="stat-value">{char.moves}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label-small">Statut</span>
                <span className="stat-value">{char.status}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label-small">Type</span>
                <span className="stat-value">
                  {char.type === 'pillar' ? 'Pillier' : 
                   char.type === 'demon' ? 'Démon' : 'Humain'}
                </span>
              </div>
            </div>
            
            <p className="card-description">{char.description}</p>
            
            {char.breath && (
              <div className="breath-tag">
                {char.breath}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  // Rendu des souffles
  const renderBreaths = () => (
    <div className="breaths-grid">
      {breathsData.map(breath => (
        <div
          key={breath.id}
          className="breath-card water-effect"
          style={{ '--accent-color': breath.color }}
        >
          <div className="breath-icon-large">{breath.icon}</div>
          <h3 className="breath-name">{breath.name}</h3>
          <p className="breath-description">{breath.description}</p>
          
          <div className="breath-stats">
            <div className="stat-item">
              <span className="stat-label-small">Formes</span>
              <span className="stat-value">{breath.forms}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label-small">Utilisateurs</span>
              <span className="stat-value">{breath.users.length}</span>
            </div>
          </div>
          
          <div className="breath-users">
            <span className="users-label">Utilisateurs: </span>
            {breath.users.join(', ')}
          </div>
        </div>
      ))}
    </div>
  );

  // Rendu des Lunes Supérieures
  const renderMoons = () => {
    const moons = charactersData.filter(char => char.moon);
    const sortedMoons = [...moons].sort((a, b) => {
      const aNum = parseInt(a.moon.split(' ')[2]);
      const bNum = parseInt(b.moon.split(' ')[2]);
      return aNum - bNum;
    });

    return (
      <div className="moons-hierarchy">
        {sortedMoons.map(moon => (
          <div key={moon.id} className="hierarchy-level">
            <h3 className="level-title">{moon.moon}</h3>
            <div className="moon-cards">
              <div 
                className="moon-card"
                onClick={() => setSelectedCharacter(moon)}
                style={{ '--accent-color': moon.color }}
              >
                <div className="moon-rank">{moon.moon.split(' ')[2]}</div>
                <h4>{moon.name}</h4>
                <p>{moon.role}</p>
                <div className="moon-stats">
                  <span>Rang: {moon.rank}</span>
                  <span>Mouvements: {moon.moves}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Rendu des Pilliers
  const renderPillars = () => {
    const pillars = charactersData.filter(char => char.type === 'pillar');
    
    return (
      <div className="characters-grid">
        {pillars.map(pillar => (
          <div
            key={pillar.id}
            className="character-card blood-effect"
            onClick={() => setSelectedCharacter(pillar)}
            style={{ '--accent-color': pillar.color }}
          >
            <div className="card-image">
              <img src={pillar.image} alt={pillar.name} />
              <div className="type-badge">PILLIER</div>
              <div className="pillar-rank">{pillar.rank}</div>
            </div>
            
            <div className="card-content">
              <h3 className="card-title">{pillar.name}</h3>
              <p className="card-role">{pillar.role}</p>
              
              <div className="pillar-info">
                <div className="info-row">
                  <span>Souffle:</span>
                  <strong>{pillar.breath}</strong>
                </div>
                <div className="info-row">
                  <span>Mouvements:</span>
                  <strong>{pillar.moves}</strong>
                </div>
                <div className="info-row">
                  <span>Statut:</span>
                  <strong>{pillar.status}</strong>
                </div>
              </div>
              
              <p className="card-description">{pillar.description}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="demon-slayer-encyclopedia">
      {/* Background animé */}
      <div className="animated-bg" />
      
      {/* Overlay de personnage */}
      {selectedCharacter && (
        <div className="character-overlay active">
          <div className="overlay-background" onClick={() => setSelectedCharacter(null)} />
          <div className="overlay-content">
            <button className="close-overlay" onClick={() => setSelectedCharacter(null)}>
              ✕
            </button>
            
            <div className="character-detail">
              <div className="detail-image">
                <img src={selectedCharacter.image} alt={selectedCharacter.name} />
                <div className="detail-badges">
                  {selectedCharacter.moon && (
                    <div className="moon-badge-large">{selectedCharacter.moon}</div>
                  )}
                  <div className="type-badge-large">
                    {selectedCharacter.type === 'pillar' ? 'PILLIER' : 
                     selectedCharacter.type === 'demon' ? 'DÉMON' : 'POURFENDEUR'}
                  </div>
                </div>
              </div>
              
              <div className="detail-info">
                <h2>{selectedCharacter.name}</h2>
                <p className="detail-role">{selectedCharacter.role}</p>
                <p className="detail-description">{selectedCharacter.description}</p>
                
                <div className="detail-stats-grid">
                  <div className="detail-stat">
                    <span>Rang</span>
                    <strong>{selectedCharacter.rank}</strong>
                  </div>
                  <div className="detail-stat">
                    <span>Mouvements</span>
                    <strong>{selectedCharacter.moves}</strong>
                  </div>
                  <div className="detail-stat">
                    <span>Statut</span>
                    <strong>{selectedCharacter.status}</strong>
                  </div>
                  <div className="detail-stat">
                    <span>Type</span>
                    <strong>
                      {selectedCharacter.type === 'pillar' ? 'Pillier' : 
                       selectedCharacter.type === 'demon' ? 'Démon' : 'Humain'}
                    </strong>
                  </div>
                </div>
                
                {selectedCharacter.breath && (
                  <div className="detail-breath">
                    <h3>Souffle Maîtrisé</h3>
                    <div className="breath-display">
                      {selectedCharacter.breath}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Héroïque */}
      <section className="hero-header" ref={heroRef}>
        <div className="hero-content">
          <h1 className="hero-title">ENCYCLOPÉDIE DEMON SLAYER</h1>
          <p className="japanese-title">鬼滅の刃 大百科</p>
          <p className="hero-subtitle">
            Base de données complète sur l'univers de Kimetsu no Yaiba
          </p>
          <div className="hero-stats">
            {statsData.map(stat => (
              <div key={stat.id} className="hero-stat">
                <div className="hero-stat-number">{stat.number}</div>
                <div className="hero-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation */}
      <nav className="main-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-icon">🗡️</span>
            <span>DEMON SLAYER DB</span>
          </div>
          
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Rechercher un personnage..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="nav-tabs">
            <button
              className={`nav-tab ${activeTab === 'characters' ? 'active' : ''}`}
              onClick={() => setActiveTab('characters')}
            >
              <span className="tab-icon">👥</span>
              <span className="tab-label">Personnages</span>
            </button>
            
            <button
              className={`nav-tab ${activeTab === 'breaths' ? 'active' : ''}`}
              onClick={() => setActiveTab('breaths')}
            >
              <span className="tab-icon">💨</span>
              <span className="tab-label">Souffles</span>
            </button>
            
            <button
              className={`nav-tab ${activeTab === 'moons' ? 'active' : ''}`}
              onClick={() => setActiveTab('moons')}
            >
              <span className="tab-icon">🌕</span>
              <span className="tab-label">Lunes</span>
            </button>
            
            <button
              className={`nav-tab ${activeTab === 'pillars' ? 'active' : ''}`}
              onClick={() => setActiveTab('pillars')}
            >
              <span className="tab-icon">⚔️</span>
              <span className="tab-label">Pilliers</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="main-content">
        {/* Statistiques */}
        {renderStats()}

        {/* Contenu par onglet */}
        <div className="tab-content">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Chargement des données...</p>
            </div>
          ) : (
            <>
              {activeTab === 'characters' && (
                <>
                  <div className="content-header">
                    <h2>Personnages ({filteredCharacters.length})</h2>
                    <div className="filter-controls">
                      <select
                        className="type-filter"
                        value={filteredBreath}
                        onChange={(e) => setFilteredBreath(e.target.value)}
                      >
                        <option value="all">Tous les types</option>
                        <option value="human">Pourfendeurs</option>
                        <option value="pillar">Pilliers</option>
                        <option value="demon">Démons</option>
                        <option value="water">Souffle de l'Eau</option>
                        <option value="fire">Souffle de la Flamme</option>
                        <option value="thunder">Souffle de la Foudre</option>
                      </select>
                    </div>
                  </div>
                  {renderCharacters()}
                </>
              )}

              {activeTab === 'breaths' && (
                <>
                  <h2>Techniques de Souffle</h2>
                  {renderBreaths()}
                </>
              )}

              {activeTab === 'moons' && (
                <>
                  <h2>Lunes Supérieures</h2>
                  {renderMoons()}
                </>
              )}

              {activeTab === 'pillars' && (
                <>
                  <h2>Les Pilliers</h2>
                  {renderPillars()}
                </>
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Encyclopédie Demon Slayer</h3>
            <p>
              Base de données complète sur l'univers de Kimetsu no Yaiba.<br />
              Tous les droits appartiennent à Koyoharu Gotouge.
            </p>
          </div>
          
          <div className="footer-section">
            <h3>Statistiques</h3>
            <div className="footer-stats">
              {statsData.map(stat => (
                <div key={stat.id} className="footer-stat">
                  <div className="number">{stat.number}</div>
                  <div className="label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2024 Encyclopédie Demon Slayer - Base de données non officielle</p>
        </div>
      </footer>
    </div>
  );
};

export default DemonSlayerEncyclopedia;
