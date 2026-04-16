import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/LegacyProjects.css";

const highlights = [
  "Gestion des adhérents, entraîneurs, entraînements et séances",
  "Stack Laravel 12 + Inertia Vue + Vite",
  "Modules fonctionnels: calendrier, actualités, documents, messagerie",
  "Sécurité par rôles: président, responsable planning, entraîneur, membre"
];

const PLANNING_APP_CANDIDATES = ["http://127.0.0.1:8000", "http://localhost:8000"];

async function isPlanningAppReachable(baseUrl) {
  const probes = ["/up", "/login", "/"];

  for (const probePath of probes) {
    try {
      await fetch(`${baseUrl}${probePath}`, {
        method: "GET",
        mode: "no-cors",
        cache: "no-store"
      });
      return true;
    } catch {
      // Continue probing other endpoints/hosts.
    }
  }

  return false;
}

export default function AppDePlanning() {
  const navigate = useNavigate();
  const [connectionState, setConnectionState] = useState("checking");
  const [planningUrl, setPlanningUrl] = useState(PLANNING_APP_CANDIDATES[0]);

  const checkPlanningAvailability = useCallback(async () => {
    setConnectionState("checking");

    for (const candidate of PLANNING_APP_CANDIDATES) {
      const isReachable = await isPlanningAppReachable(candidate);
      if (isReachable) {
        setPlanningUrl(candidate);
        setConnectionState("online");
        return;
      }
    }

    setConnectionState("offline");
  }, []);

  useEffect(() => {
    checkPlanningAvailability();
    const refreshInterval = window.setInterval(checkPlanningAvailability, 20000);

    return () => window.clearInterval(refreshInterval);
  }, [checkPlanningAvailability]);

  const statusLabel =
    connectionState === "online"
      ? "Instance locale détectée"
      : connectionState === "checking"
        ? "Vérification en cours"
        : "Instance locale non détectée";

  const projectFacts = [
    "Dossier détecté: App-de-planning/",
    "Backend: Laravel 12 (PHP 8.2)",
    "Frontend: Inertia.js + Vue 3 + Vite",
    "Authentification: Breeze",
    "Tables métier: adhérents, entraîneurs, entraînements, séances, paiements, présences"
  ];

  const models = [
    "Actualite",
    "Adherent",
    "Commentaire",
    "Conversation",
    "Document",
    "Entrainement",
    "Entraineur",
    "Message",
    "Paiement",
    "Presence",
    "Role",
    "Seance",
    "User"
  ];

  const resources = ["entraineurs", "adherents", "entrainements", "seances"];
  const modules = ["calendrier", "actualites", "notifications", "documents", "messages", "paiements", "presences"];

  return (
    <div className="legacy-project-page">
      <div className="legacy-ambient legacy-ambient-a" aria-hidden="true"></div>
      <div className="legacy-ambient legacy-ambient-b" aria-hidden="true"></div>

      <div className="legacy-project-card">
        <button className="legacy-back" onClick={() => navigate("/menu")}>Retour menu</button>

        <header className="legacy-header">
          <p className="legacy-kicker">Projet BTS SIO SLAM · Dossier local intégré</p>
          <h1>App de Planning</h1>
          <p>
            Le dossier App-de-planning présent dans le workspace est maintenant branché au portfolio. Cette page
            présente les informations techniques réelles du dossier et donne un accès direct à l'instance locale.
          </p>
          <div className="legacy-status-row">
            <span className={`legacy-status-pill ${connectionState}`}>{statusLabel}</span>
            <p>
              URL surveillée: <strong>{planningUrl}</strong>
            </p>
          </div>
        </header>

        <section className="legacy-grid">
          <article>
            <h2>Objectif</h2>
            <p>
              Centraliser la gestion du planning et des acteurs (adhérents, entraîneurs, séances) avec une
              architecture Laravel claire et une interface modernisée via Inertia/Vue.
            </p>
          </article>

          <article>
            <h2>Points forts</h2>
            <ul>
              {highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article>
            <h2>Implémentation dans le portfolio</h2>
            <ul>
              <li>Route interne dédiée: /app-de-planning</li>
              <li>Carte projet disponible depuis le menu Wii</li>
              <li>Projet mis en avant dans la section portfolio</li>
              <li>Dossier source local: App-de-planning</li>
              <li>Aucune dépendance GitHub pour la démo</li>
            </ul>
          </article>

          <article>
            <h2>Fiche du dossier App-de-planning</h2>
            <ul>
              {projectFacts.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article>
            <h2>Accès direct</h2>
            <div className="legacy-actions">
              <button type="button" onClick={checkPlanningAvailability}>Tester la connexion</button>
              <button
                type="button"
                disabled={connectionState !== "online"}
                onClick={() => window.open(planningUrl, "_blank", "noopener,noreferrer")}
              >
                Ouvrir l'application locale
              </button>
              <button type="button" onClick={() => navigate("/")}>Retour portfolio</button>
            </div>
          </article>

          <article className="legacy-grid-wide">
            <h2>Aperçu connecté</h2>
            {connectionState === "online" ? (
              <iframe
                title="Aperçu App de Planning"
                className="legacy-preview-frame"
                src={planningUrl}
                loading="lazy"
              ></iframe>
            ) : (
              <div className="legacy-preview-empty">
                <p>Démarre l'application Laravel pour afficher l'aperçu en direct.</p>
                <p>
                  Le démarrage automatique est actif via le script dev principal du portfolio.
                </p>
                <p>
                  Si besoin manuel: <strong>cd App-de-planning && php artisan serve --port=8000</strong>
                </p>
              </div>
            )}
          </article>

          <article>
            <h2>Modèles</h2>
            <ul>
              {models.map((modelName) => (
                <li key={modelName}>{modelName}</li>
              ))}
            </ul>
          </article>

          <article>
            <h2>Ressources Laravel</h2>
            <ul>
              {resources.map((resource) => (
                <li key={resource}>{resource}</li>
              ))}
            </ul>
          </article>

          <article>
            <h2>Modules détectés</h2>
            <ul>
              {modules.map((moduleName) => (
                <li key={moduleName}>{moduleName}</li>
              ))}
            </ul>
          </article>

          <article>
            <h2>Navigation rapide</h2>
            <p>
              Utilise le menu Wii pour basculer entre les projets, puis cette page pour ouvrir App-de-planning en live
              pendant ta démonstration orale BTS SIO.
            </p>
          </article>

          <article>
            <h2>Retour</h2>
            <div className="legacy-actions">
              <button type="button" onClick={() => navigate("/menu")}>Retour menu</button>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
