import React, { useState, useEffect } from "react";
import "./PokemonTypes.css";

// Couleurs pour le thème
const typeColors = {
  Feu: "#F08030",
  Eau: "#6890F0",
  Plante: "#78C850",
  Électrik: "#F8D030",
  Glace: "#98D8D8",
  Sol: "#E0C068",
  Vol: "#A890F0",
  Combat: "#C03028",
  Psy: "#F85888",
  Ténèbres: "#705848",
  Fée: "#EE99AC",
  Roche: "#B8A038",
  Insecte: "#A8B820",
  Acier: "#B8B8D0",
  Spectre: "#705898",
  Poison: "#A040A0",
  Dragon: "#7038F8",
  Normal: "#A8A878",
};

// Table des forces/faiblesses et meilleurs Pokémon stratégiques
const typeData = {
  Feu: {
    superEffective: ["Plante", "Insecte", "Glace", "Acier"],
    notEffective: ["Feu", "Eau", "Roche", "Dragon"],
    noEffect: [],
    bestPokemon: ["Dracaufeu", "Salamèche", "Caninos"],
    images: [
      "https://img.pokemondb.net/sprites/home/normal/charizard.png",
      "https://img.pokemondb.net/sprites/home/normal/charmander.png",
      "https://img.pokemondb.net/sprites/home/normal/growlithe.png"
    ],
    description: "Le type Feu brûle tout sur son passage avec une puissance dévastatrice."
  },
  Eau: {
    superEffective: ["Feu", "Sol", "Roche"],
    notEffective: ["Eau", "Plante", "Dragon"],
    noEffect: [],
    bestPokemon: ["Tortank", "Carapuce", "Lokhlass"],
    images: [
      "https://img.pokemondb.net/sprites/home/normal/blastoise.png",
      "https://img.pokemondb.net/sprites/home/normal/squirtle.png",
      "https://img.pokemondb.net/sprites/home/normal/lapras.png"
    ],
    description: "Le type Eau maîtrise les océans et les rivières avec fluidité et force."
  },
  Plante: {
    superEffective: ["Eau", "Sol", "Roche"],
    notEffective: ["Feu", "Plante", "Poison", "Vol", "Insecte", "Dragon", "Acier"],
    noEffect: [],
    bestPokemon: ["Florizarre", "Bulbizarre", "Tropius"],
    images: [
      "https://img.pokemondb.net/sprites/home/normal/venusaur.png",
      "https://img.pokemondb.net/sprites/home/normal/bulbasaur.png",
      "https://img.pokemondb.net/sprites/home/normal/tropius.png"
    ],
    description: "Le type Plante puise sa force dans la nature et la croissance."
  },
  Électrik: {
    superEffective: ["Eau", "Vol"],
    notEffective: ["Électrik", "Plante", "Dragon"],
    noEffect: ["Sol"],
    bestPokemon: ["Pikachu", "Électhor", "Zekrom"],
    images: [
      "https://img.pokemondb.net/sprites/home/normal/pikachu.png",
      "https://img.pokemondb.net/sprites/home/normal/zapdos.png",
      "https://img.pokemondb.net/sprites/home/normal/zekrom.png"
    ],
    description: "Le type Électrik déchaîne la foudre avec une vitesse fulgurante."
  },
  Glace: {
    superEffective: ["Plante", "Vol", "Sol", "Dragon"],
    notEffective: ["Feu", "Eau", "Glace", "Acier"],
    noEffect: [],
    bestPokemon: ["Artikodin", "Givrali", "Mammochon"],
    images: [
      "https://img.pokemondb.net/sprites/home/normal/articuno.png",
      "https://img.pokemondb.net/sprites/home/normal/glalie.png",
      "https://img.pokemondb.net/sprites/home/normal/mamoswine.png"
    ],
    description: "Le type Glace gèle ses adversaires avec un froid glacial."
  },
  Sol: {
    superEffective: ["Feu", "Électrik", "Poison", "Roche", "Acier"],
    notEffective: ["Plante", "Insecte"],
    noEffect: ["Vol"],
    bestPokemon: ["Groudon", "Marcacrin", "Phanpy"],
    images: [
      "https://img.pokemondb.net/sprites/home/normal/groudon.png",
      "https://img.pokemondb.net/sprites/home/normal/sandslash.png",
      "https://img.pokemondb.net/sprites/home/normal/phanpy.png"
    ],
    description: "Le type Sol contrôle la terre avec puissance et stabilité."
  },
  Vol: {
    superEffective: ["Plante", "Combat", "Insecte"],
    notEffective: ["Électrik", "Roche", "Acier"],
    noEffect: [],
    bestPokemon: ["Roucarnage", "Électhor", "Dragonite"],
    images: [
      "https://img.pokemondb.net/sprites/home/normal/pidgeot.png",
      "https://img.pokemondb.net/sprites/home/normal/zapdos.png",
      "https://img.pokemondb.net/sprites/home/normal/dragonite.png"
    ],
    description: "Le type Vol domine les cieux avec agilité et grâce."
  },
  Combat: {
    superEffective: ["Normal", "Roche", "Glace", "Ténèbres", "Acier"],
    notEffective: ["Poison", "Vol", "Psy", "Insecte", "Fée"],
    noEffect: [],
    bestPokemon: ["Mackogneur", "Lucario", "Scarhino"],
    images: [
      "https://img.pokemondb.net/sprites/home/normal/machamp.png",
      "https://img.pokemondb.net/sprites/home/normal/lucario.png",
      "https://img.pokemondb.net/sprites/home/normal/heracross.png"
    ],
    description: "Le type Combat utilise la force physique et la technique martiale."
  },
  Psy: {
    superEffective: ["Combat", "Poison"],
    notEffective: ["Psy", "Acier"],
    noEffect: ["Ténèbres"],
    bestPokemon: ["Mewtwo", "Alakazam", "Mew"],
    images: [
      "https://img.pokemondb.net/sprites/home/normal/mewtwo.png",
      "https://img.pokemondb.net/sprites/home/normal/alakazam.png",
      "https://img.pokemondb.net/sprites/home/normal/mew.png"
    ],
    description: "Le type Psy utilise des pouvoirs mentaux et psychiques."
  },
  Ténèbres: {
    superEffective: ["Psy", "Spectre"],
    notEffective: ["Combat", "Ténèbres", "Fée"],
    noEffect: [],
    bestPokemon: ["Tyranocif", "Darkrai", "Absol"],
    images: [
      "https://img.pokemondb.net/sprites/home/normal/tyranitar.png",
      "https://img.pokemondb.net/sprites/home/normal/darkrai.png",
      "https://img.pokemondb.net/sprites/home/normal/absol.png"
    ],
    description: "Le type Ténèbres utilise l'ombre et la tromperie."
  },
  Fée: {
    superEffective: ["Combat", "Dragon", "Ténèbres"],
    notEffective: ["Feu", "Poison", "Acier"],
    noEffect: [],
    bestPokemon: ["Gardevoir", "Mélofée", "Xerneas"],
    images: [
      "https://img.pokemondb.net/sprites/home/normal/gardevoir.png",
      "https://img.pokemondb.net/sprites/home/normal/clefairy.png",
      "https://img.pokemondb.net/sprites/home/normal/xerneas.png"
    ],
    description: "Le type Fée utilise la magie et l'énergie mystique."
  },
  Roche: {
    superEffective: ["Feu", "Glace", "Vol", "Insecte"],
    notEffective: ["Combat", "Sol", "Acier"],
    noEffect: [],
    bestPokemon: ["Onix", "Tyranocif", "Racaillou"],
    images: [
      "https://img.pokemondb.net/sprites/home/normal/onix.png",
      "https://img.pokemondb.net/sprites/home/normal/tyranitar.png",
      "https://img.pokemondb.net/sprites/home/normal/geodude.png"
    ],
    description: "Le type Roche est solide comme la pierre et résistant."
  },
  Insecte: {
    superEffective: ["Plante", "Psy", "Ténèbres"],
    notEffective: ["Feu", "Combat", "Poison", "Vol", "Spectre", "Acier", "Fée"],
    noEffect: [],
    bestPokemon: ["Scarhino", "Cizayox", "Papilusion"],
    images: [
      "https://img.pokemondb.net/sprites/home/normal/heracross.png",
      "https://img.pokemondb.net/sprites/home/normal/scizor.png",
      "https://img.pokemondb.net/sprites/home/normal/butterfree.png"
    ],
    description: "Le type Insecte utilise la vitesse et la technique."
  },
  Acier: {
    superEffective: ["Glace", "Roche", "Fée"],
    notEffective: ["Feu", "Eau", "Électrik", "Acier"],
    noEffect: [],
    bestPokemon: ["Métalosse", "Ptera", "Fermite"],
    images: [
      "https://img.pokemondb.net/sprites/home/normal/metagross.png",
      "https://img.pokemondb.net/sprites/home/normal/skarmory.png",
      "https://img.pokemondb.net/sprites/home/normal/forretress.png"
    ],
    description: "Le type Acier est extrêmement résistant et durable."
  },
  Spectre: {
    superEffective: ["Psy", "Spectre"],
    notEffective: ["Ténèbres"],
    noEffect: ["Normal"],
    bestPokemon: ["Gengar", "Spectrum", "Mimiqui"],
    images: [
      "https://img.pokemondb.net/sprites/home/normal/gengar.png",
      "https://img.pokemondb.net/sprites/home/normal/banette.png",
      "https://img.pokemondb.net/sprites/home/normal/mimikyu.png"
    ],
    description: "Le type Spectre traverse les dimensions et les obstacles."
  },
  Poison: {
    superEffective: ["Plante", "Fée"],
    notEffective: ["Poison", "Roche", "Sol", "Spectre"],
    noEffect: [],
    bestPokemon: ["Abo", "Muk", "Nidoking"],
    images: [
      "https://img.pokemondb.net/sprites/home/normal/arbok.png",
      "https://img.pokemondb.net/sprites/home/normal/muk.png",
      "https://img.pokemondb.net/sprites/home/normal/nidoking.png"
    ],
    description: "Le type Poison utilise des toxines et des venins."
  },
  Dragon: {
    superEffective: ["Dragon"],
    notEffective: ["Acier"],
    noEffect: ["Fée"],
    bestPokemon: ["Dracolosse", "Draco", "Garchomp"],
    images: [
      "https://img.pokemondb.net/sprites/home/normal/dragonite.png",
      "https://img.pokemondb.net/sprites/home/normal/dragonair.png",
      "https://img.pokemondb.net/sprites/home/normal/garchomp.png"
    ],
    description: "Le type Dragon est légendaire et extrêmement puissant."
  },
  Normal: {
    superEffective: [],
    notEffective: ["Roche", "Acier"],
    noEffect: ["Spectre"],
    bestPokemon: ["Ronflex", "Évoli", "Rondoudou"],
    images: [
      "https://img.pokemondb.net/sprites/home/normal/snorlax.png",
      "https://img.pokemondb.net/sprites/home/normal/eevee.png",
      "https://img.pokemondb.net/sprites/home/normal/jigglypuff.png"
    ],
    description: "Le type Normal est équilibré et polyvalent."
  }
};

// Liste des types disponibles
const types = Object.keys(typeColors);

const PokemonTypes = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [backgroundStyle, setBackgroundStyle] = useState({
    background: "linear-gradient(135deg, #e9f3ff 0%, #f9fbff 100%)"
  });

  const handleSelect = (type) => {
    setSelectedType(type);
    if (type) {
      const color = typeColors[type];
      setBackgroundStyle({
        background: `linear-gradient(135deg, ${color}90, #f9fbff)`,
        transition: "background 0.8s ease-in-out"
      });
      
      // Mettre à jour la variable CSS pour l'animation de shine
      document.documentElement.style.setProperty('--current-color-start', color);
      document.documentElement.style.setProperty('--current-color-end', color + 'CC');
    } else {
      setBackgroundStyle({
        background: "linear-gradient(135deg, #e9f3ff 0%, #f9fbff 100%)"
      });
    }
  };

  // Ajouter la description au rendu
  const TypeSection = ({ title, typesList, icon }) => (
    <div className="type-section">
      <p>{icon} <strong>{title}</strong></p>
      <div className="badges">
        {typesList.length > 0 ? (
          typesList.map((t) => (
            <span
              key={t}
              className="type-badge"
              style={{ backgroundColor: typeColors[t] }}
            >
              {t}
            </span>
          ))
        ) : (
          <span className="no-effect">Aucun</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="pokemon-types-container fade-in" style={backgroundStyle}>
      <h1>🔥 Table des Types Pokémon</h1>
      <p>Sélectionne un type pour voir ses forces, faiblesses et les meilleurs Pokémon.</p>

      <div className="types-grid">
        {types.map((t) => (
          <button
            key={t}
            className={`type-btn ${selectedType === t ? "selected" : ""}`}
            onClick={() => handleSelect(t)}
            style={{
              backgroundColor: typeColors[t]
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {selectedType && (
        <div className="type-info slide-up">
          <h2 style={{ color: typeColors[selectedType] }}>{selectedType}</h2>
          
          <div className="type-description">
            <p>{typeData[selectedType].description}</p>
          </div>

          <div className="pokemon-images">
            {typeData[selectedType].images.map((image, index) => (
              <div key={index} className="pokemon-card">
                <img src={image} alt={typeData[selectedType].bestPokemon[index]} />
                <span>{typeData[selectedType].bestPokemon[index]}</span>
              </div>
            ))}
          </div>

          <TypeSection 
            title="Super efficace contre :" 
            typesList={typeData[selectedType].superEffective}
            icon="⚔️"
          />

          <TypeSection 
            title="Résiste à :" 
            typesList={typeData[selectedType].notEffective}
            icon="🛡️"
          />

          {typeData[selectedType].noEffect.length > 0 && (
            <TypeSection 
              title="Ne fait aucun dégât à :" 
              typesList={typeData[selectedType].noEffect}
              icon="💀"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PokemonTypes;
