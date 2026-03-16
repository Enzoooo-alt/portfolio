import React, { useState } from "react";
import "./ReactCourse.css";

const ReactCourse = () => {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [userCode, setUserCode] = useState("");
  const [output, setOutput] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);

  const lessons = [
    {
      title: "🎯 Introduction à React",
      content: `## Qu'est-ce que React ?
React est une bibliothèque JavaScript créée par Facebook pour construire des interfaces utilisateur interactives.

### 🧩 Les Composants
Imagine que tu construis une maison avec des LEGO. Chaque pièce LEGO est comme un **composant React** :
- **Réutilisable** : Tu peux utiliser la même pièce plusieurs fois
- **Indépendant** : Chaque pièce a sa propre fonction
- **Assemblable** : Tu combines les pièces pour créer quelque chose de plus grand

### 📝 Le JSX
Le JSX ressemble à du HTML, mais c'est en réalité du JavaScript :
\`\`\`jsx
// Ceci est du JSX :
<div>
  <h1>Bonjour !</h1>
  <p>Bienvenue dans React</p>
</div>
\`\`\`

**Astuce :** Pense au JSX comme à un mélange entre HTML et JavaScript qui te permet de décrire à quoi doit ressembler ton interface.`,
      exercise: {
        title: "👶 Ton Premier Composant",
        description: `**Objectif :** Crée ton tout premier composant React qui affiche un message de bienvenue.

### 🎯 Ta Mission :
1. Complète la fonction \`MonComposant\`
2. Fais en sorte qu'elle retourne du JSX
3. Affiche le texte "Bonjour React !" dans une balise <h1>
4. Affiche "Mon premier composant" dans une balise <p>

### 💡 Comment faire ?
- Utilise la syntaxe JSX (ça ressemble à du HTML)
- N'oublie pas les parenthèses autour du JSX
- Chaque composant doit retourner (return) du JSX`,
        template: `function MonComposant() {
  // Ton code ici !
  // Retourne du JSX avec :
  // - Un <h1> contenant "Bonjour React !"
  // - Un <p> contenant "Mon premier composant"
  return (
    <div>
      {/* Écris ton code ici */}
    </div>
  );
}`,
        test: (code) => {
          return code.includes("Bonjour React !") && 
                 code.includes("Mon premier composant") &&
                 code.includes("<h1>") && 
                 code.includes("<p>");
        },
        hint: "N'oublie pas : <h1>Bonjour React !</h1> et <p>Mon premier composant</p>"
      }
    },
    {
      title: "⚡ Les Props - Données Dynamiques",
      content: `## 📦 Qu'est-ce qu'une Prop ?
Les **props** (propriétés) sont comme des paramètres que tu passes à tes composants.

### 🎁 Analogie du Cadeau
Imagine que ton composant est une boîte cadeau :
- **La boîte** = ton composant
- **Le cadeau à l'intérieur** = les props
- **L'emballage** = le JSX qui affiche les props

### 📋 Exemple Concret
\`\`\`jsx
// Le composant "Bonjour" reçoit une prop "nom"
function Bonjour({ nom }) {
  return <h1>Bonjour {nom} !</h1>;
}

// On utilise le composant avec différentes props
<Bonjour nom="Marie" />    // Affiche "Bonjour Marie !"
<Bonjour nom="Pierre" />   // Affiche "Bonjour Pierre !"
<Bonjour nom="React" />    // Affiche "Bonjour React !"
\`\`\`

**Les props rendent tes composants réutilisables et dynamiques !**`,
      exercise: {
        title: "📝 Crée un Message Personnalisé",
        description: `**Objectif :** Crée un composant qui affiche un message personnalisé en utilisant les props.

### 🎯 Ta Mission :
1. Crée un composant \`MessagePersonnalise\`
2. Il doit recevoir une prop appelée \`message\`
3. Affiche cette prop dans ton JSX

### 💡 Comment utiliser les props ?
\`\`\`jsx
// 1. Déclare que ton composant reçoit des props
function MonComposant({ maProp }) {
  // 2. Utilise la prop dans ton JSX
  return <div>{maProp}</div>;
}
\`\`\`

### 🚨 Attention !
- Les props sont en lecture seule (tu ne peux pas les modifier)
- Utilise les accolades {} pour afficher les variables dans le JSX`,
        template: `function MessagePersonnalise({ message }) {
  // Ton code ici !
  // Utilise la prop "message" reçue en paramètre
  return (
    <div>
      {/* Affiche le message reçu en prop */}
      {/* Indice : utilise {message} */}
    </div>
  );
}`,
        test: (code) => {
          return code.includes("{message}") && 
                 (code.includes("props.message") || code.includes("{message}"));
        },
        hint: "Dans ton JSX, utilise {message} pour afficher la valeur de la prop"
      }
    },
    {
      title: "🔄 Le State - Données qui Changent",
      content: `## 🎢 Le State (État)
Le **state** représente les données qui peuvent changer dans ton composant.

### 🎯 Analogie du Compteur
Imagine un compteur de score dans un jeu :
- **La valeur actuelle** = le state
- **Le bouton "+1"** = la fonction qui modifie le state
- **L'affichage qui se met à jour** = le re-rendu du composant

### 🪝 Le Hook useState
\`\`\`jsx
import { useState } from 'react';

function Compteur() {
  // Déclare ton state :
  const [valeur, setValeur] = useState(0);
  //     ↑          ↑           ↑
  //   state   setter fonction  valeur initiale
  
  return (
    <div>
      <p>Valeur: {valeur}</p>
      <button onClick={() => setValeur(valeur + 1)}>
        +1
      </button>
    </div>
  );
}
\`\`\`

**Quand tu modifies le state avec setValeur, le composant se met automatiquement à jour !**`,
      exercise: {
        title: "🔢 Crée un Compteur Interactif",
        description: `**Objectif :** Crée un compteur qu'on peut incrémenter en cliquant sur un bouton.

### 🎯 Ta Mission :
1. Importe \`useState\` depuis React
2. Déclare un state \`count\` avec une valeur initiale de 0
3. Affiche la valeur du compteur
4. Ajoute un bouton qui incrémente le compteur de 1

### 💡 Structure à suivre :
\`\`\`jsx
const [count, setCount] = useState(0);

<button onClick={() => setCount(count + 1)}>
  Clique-moi !
</button>
\`\`\`

### 🚨 Points importants :
- N'oublie pas d'importer useState
- Utilise onClick pour gérer le clic
- setCount modifie la valeur de count`,
        template: `import { useState } from 'react';

function Compteur() {
  // Déclare ton state ici
  // const [count, setCount] = useState(0);
  
  return (
    <div>
      {/* Affiche la valeur du compteur */}
      <p>Compteur: {/* Affiche count ici */}</p>
      
      {/* Bouton pour incrémenter */}
      <button onClick={/* Met à jour le count ici */}>
        Incrémenter
      </button>
    </div>
  );
}`,
        test: (code) => {
          return code.includes("useState") &&
                 code.includes("setCount") &&
                 code.includes("onClick") &&
                 code.includes("{count}");
        },
        hint: "N'oublie pas : const [count, setCount] = useState(0); et onClick={() => setCount(count + 1)}"
      }
    },
    {
      title: "🎨 Gestion des Événements",
      content: `## 🖱️ Les Événements en React
Les événements te permettent de réagir aux actions de l'utilisateur.

### 📋 Événements Courants
- **onClick** : quand on clique
- **onChange** : quand la valeur d'un champ change
- **onSubmit** : quand un formulaire est soumis
- **onKeyPress** : quand une touche est pressée

### 🎯 Exemple : Champ de Texte
\`\`\`jsx
function ChampTexte() {
  const [texte, setTexte] = useState('');
  
  // Cette fonction est appelée à chaque frappe
  const gererChangement = (evenement) => {
    setTexte(evenement.target.value);
  };
  
  return (
    <div>
      <input
        type="text"
        value={texte}
        onChange={gererChangement}
        placeholder="Tape quelque chose..."
      />
      <p>Tu as tapé: {texte}</p>
    </div>
  );
}
\`\`\`

**evenement.target.value** contient la valeur actuelle du champ !`,
      exercise: {
        title: "⌨️ Champ de Texte en Temps Réel",
        description: `**Objectif :** Crée un champ de texte qui affiche sa valeur en temps réel.

### 🎯 Ta Mission :
1. Crée un state pour stocker la valeur du champ
2. Crée une fonction qui met à jour le state quand le texte change
3. Lie la fonction à l'événement \`onChange\` de l'input
4. Affiche la valeur actuelle en dessous

### 💡 Comment capturer la valeur ?
\`\`\`jsx
const handleChange = (e) => {
  setValeur(e.target.value); // e.target.value = texte tapé
};
\`\`\`

### 🔗 Comment lier l'événement ?
\`\`\`jsx
<input
  value={valeur}
  onChange={handleChange}
/>
\`\`\`

**Le composant se met à jour à chaque frappe !**`,
        template: `function ChampTexte() {
  const [valeur, setValeur] = useState('');
  
  // Crée une fonction pour gérer le changement
  const handleChange = (e) => {
    // Met à jour le state avec la nouvelle valeur
    // Indice : utilise e.target.value
  };
  
  return (
    <div>
      <input
        type="text"
        value={valeur} // La valeur actuelle
        onChange={handleChange} // Appelée à chaque changement
        placeholder="Tape quelque chose..."
      />
      <p>Vous avez tapé: {/* Affiche la valeur ici */}</p>
    </div>
  );
}`,
        test: (code) => {
          return code.includes("onChange") &&
                 code.includes("e.target.value") &&
                 code.includes("value={") &&
                 code.includes("{valeur}");
        },
        hint: "handleChange doit contenir setValeur(e.target.value) et l'input doit avoir value={valeur} et onChange={handleChange}"
      }
    },
    {
      title: "🔄 Rendering Conditionnel",
      content: `## ❓ Afficher du Contenu Conditionnellement
Parfois, tu veux afficher différents éléments selon certaines conditions.

### 🎯 Méthodes Principales
\`\`\`jsx
// 1. Opérateur ternaire : condition ? siVrai : siFaux
{estConnecte ? <p>Bienvenue</p> : <p>Connecte-toi</p>}

// 2. Opérateur && : condition && élément
{estAdmin && <button>Panel Admin</button>}

// 3. Variables avec if/else
let message;
if (estConnecte) {
  message = <p>Bienvenue</p>;
} else {
  message = <p>Connecte-toi</p>;
}
\`\`\`

### 🎮 Exemple : Toggle de Connexion
\`\`\`jsx
function MessageConnexion() {
  const [estConnecte, setEstConnecte] = useState(false);
  
  return (
    <div>
      <button onClick={() => setEstConnecte(!estConnecte)}>
        {estConnecte ? 'Déconnexion' : 'Connexion'}
      </button>
      
      {estConnecte ? (
        <p>✅ Bienvenue ! Vous êtes connecté.</p>
      ) : (
        <p>🔒 Veuillez vous connecter.</p>
      )}
    </div>
  );
}
\`\`\`

**Le ! devant estConnecte inverse sa valeur (true devient false, false devient true)**`,
      exercise: {
        title: "🔐 Système de Connexion Simple",
        description: `**Objectif :** Crée un composant qui affiche différents messages selon l'état de connexion.

### 🎯 Ta Mission :
1. Crée un state \`estConnecte\` qui commence à \`false\`
2. Crée un bouton qui inverse l'état de connexion
3. Utilise un **opérateur ternaire** pour afficher :
   - "Bienvenue ! Vous êtes connecté." si estConnecte est true
   - "Veuillez vous connecter." si estConnecte est false
4. Le texte du bouton doit aussi changer

### 💡 Opérateur Ternaire
\`\`\`jsx
{condition ? afficherSiVrai : afficherSiFaux}
\`\`\`

### 🔄 Inverser un booléen
\`\`\`jsx
setEstConnecte(!estConnecte); // Inverse la valeur
\`\`\`

**Astuce :** Tu peux utiliser le même opérateur ternaire pour le texte du bouton !`,
        template: `function MessageConnexion() {
  const [estConnecte, setEstConnecte] = useState(false);
  
  return (
    <div>
      {/* Bouton qui inverse l'état */}
      <button onClick={() => setEstConnecte(!estConnecte)}>
        {/* Change le texte selon l'état */}
        {estConnecte ? 'Se déconnecter' : 'Se connecter'}
      </button>
      
      {/* Affiche un message différent selon l'état */}
      {estConnecte ? (
        <p>/* Message quand connecté */</p>
      ) : (
        <p>/* Message quand déconnecté */</p>
      )}
    </div>
  );
}`,
        test: (code) => {
          return code.includes("?") && 
                 code.includes(":") && 
                 code.includes("estConnecte") &&
                 code.includes("!estConnecte");
        },
        hint: "Utilise : {estConnecte ? <p>Bienvenue ! Vous êtes connecté.</p> : <p>Veuillez vous connecter.</p>}"
      }
    }
  ];

  const runCode = () => {
    try {
      const currentExercise = lessons[currentLesson].exercise;
      if (currentExercise.test(userCode)) {
        setOutput("✅ Bravo ! Ton code est correct ! 🎉\nTu as bien compris le concept !");
        setIsCorrect(true);
      } else {
        setOutput(`❌ Presque ! Voici quelques conseils :\n\n💡 ${currentExercise.hint}\n\n📚 N'hésite pas à revoir les explications ci-dessus.`);
        setIsCorrect(false);
      }
    } catch (error) {
      setOutput(`❌ Erreur dans ton code : ${error.message}\n\n🔧 Vérifie la syntaxe et les fautes de frappe.`);
      setIsCorrect(false);
    }
  };

  const resetCode = () => {
    setUserCode(lessons[currentLesson].exercise.template);
    setOutput("");
    setIsCorrect(null);
  };

  const nextLesson = () => {
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
      setUserCode(lessons[currentLesson + 1].exercise.template);
      setOutput("");
      setIsCorrect(null);
    }
  };

  const prevLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
      setUserCode(lessons[currentLesson - 1].exercise.template);
      setOutput("");
      setIsCorrect(null);
    }
  };

  // Formatage du contenu avec support markdown basique
  const formatContent = (content) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('## ')) {
        return <h3 key={index} style={{color: '#2c3e50', margin: '1.5rem 0 1rem 0'}}>{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('### ')) {
        return <h4 key={index} style={{color: '#34495e', margin: '1.2rem 0 0.8rem 0'}}>{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('- **')) {
        return <li key={index} style={{marginBottom: '0.5rem'}}><strong>{line.replace('- **', '').replace('**', '')}</strong></li>;
      }
      if (line.startsWith('- ')) {
        return <li key={index} style={{marginBottom: '0.5rem'}}>{line.replace('- ', '')}</li>;
      }
      if (line.startsWith('```jsx')) {
        return null; // On gère les blocs de code séparément
      }
      if (line.trim() === '```') {
        return null;
      }
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={index}>
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i}>{part}</strong> : part
            )}
          </p>
        );
      }
      return <p key={index}>{line}</p>;
    });
  };

  return (
    <div className="react-course-container">
      <header className="course-header">
        <h1>🚀 Cours Interactif React</h1>
        <p>Apprends React en pratiquant avec des exercices guidés ! 👨‍💻</p>
      </header>

      <div className="course-content">
        <div className="lesson-sidebar">
          <h3>📚 Parcours d'Apprentissage</h3>
          <div className="lesson-list">
            {lessons.map((lesson, index) => (
              <button
                key={index}
                className={`lesson-item ${currentLesson === index ? 'active' : ''}`}
                onClick={() => {
                  setCurrentLesson(index);
                  setUserCode(lesson.exercise.template);
                  setOutput("");
                  setIsCorrect(null);
                }}
              >
                <span className="lesson-number">{index + 1}</span>
                {lesson.title}
              </button>
            ))}
          </div>
        </div>

        <div className="lesson-main">
          <div className="lesson-card">
            <h2>{lessons[currentLesson].title}</h2>
            <div className="lesson-content">
              {formatContent(lessons[currentLesson].content)}
            </div>

            <div className="exercise-section">
              <h3>💻 {lessons[currentLesson].exercise.title}</h3>
              <div className="exercise-description">
                {formatContent(lessons[currentLesson].exercise.description)}
              </div>

              <div className="code-editor">
                <div className="editor-header">
                  <span>Éditeur de code - Zone de pratique</span>
                  <button onClick={resetCode} className="reset-btn">
                    🔄 Recommencer
                  </button>
                </div>
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="code-input"
                  placeholder="Écris ton code React ici..."
                  spellCheck="false"
                />
              </div>

              <div className="editor-controls">
                <button onClick={runCode} className="run-btn">
                  ▶️ Tester mon code
                </button>
                {output && (
                  <div className={`output ${isCorrect ? 'success' : 'error'}`}>
                    {output.split('\n').map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="navigation-buttons">
              <button
                onClick={prevLesson}
                disabled={currentLesson === 0}
                className="nav-btn prev"
              >
                ← Leçon précédente
              </button>
              <button
                onClick={nextLesson}
                disabled={currentLesson === lessons.length - 1}
                className="nav-btn next"
              >
                Leçon suivante →
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="progress-indicator">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentLesson + 1) / lessons.length) * 100}%` }}
          ></div>
        </div>
        <span>Progression: {currentLesson + 1}/{lessons.length} leçons</span>
      </div>
    </div>
  );
};

export default ReactCourse;
