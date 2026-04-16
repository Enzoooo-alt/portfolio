import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/LegacyProjects.css";

const capabilities = [
  "Gestion des comptes clients et operations",
  "Historique des transactions",
  "Gestion des beneficiaires",
  "Espace administration et supervision"
];

export default function MaBanqueProject() {
  const navigate = useNavigate();

  return (
    <div className="legacy-project-page">
      <div className="legacy-ambient legacy-ambient-a" aria-hidden="true"></div>
      <div className="legacy-ambient legacy-ambient-c" aria-hidden="true"></div>

      <div className="legacy-project-card">
        <button className="legacy-back" onClick={() => navigate("/menu")}>Retour menu</button>

        <header className="legacy-header">
          <p className="legacy-kicker">Projet BTS SIO SLAM</p>
          <h1>MaBanque</h1>
          <p>
            Projet de formation bancaire conserve et restructure dans le portfolio comme etude de cas sur la gestion
            metier, la fiabilite des donnees et la securisation des usages.
          </p>
        </header>

        <section className="legacy-grid">
          <article>
            <h2>Vision</h2>
            <p>
              Simuler un environnement bancaire avec des processus concrets: consultation, virements, gestion des
              droits et controle administratif.
            </p>
          </article>

          <article>
            <h2>Fonctionnalites</h2>
            <ul>
              {capabilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article>
            <h2>Apports techniques</h2>
            <p>
              Structuration de donnees transactionnelles, separation des espaces utilisateur/admin et reflexes de
              securite applicative.
            </p>
          </article>

          <article>
            <h2>Navigation</h2>
            <div className="legacy-actions">
              <button type="button" onClick={() => navigate("/")}>Retour portfolio</button>
              <button type="button" onClick={() => navigate("/menu")}>Retour projets</button>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
