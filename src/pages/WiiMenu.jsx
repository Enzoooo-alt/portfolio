import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/WiiMenu.css";
import { useBgm } from "../context/BgmContext";

export default function WiiMenu() {
  const GRID_COLUMNS = 3;
  const [time, setTime] = useState(new Date());
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(true);
  const cursorRef = useRef(null);
  const navigate = useNavigate();
  const {
    tracks,
    currentTrack,
    isPlaying,
    volume,
    errorMessage,
    togglePlayback,
    nextTrack,
    setTrackById,
    setVolume
  } = useBgm();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Gestion du curseur Wii
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
      setCursorVisible(true);
    };

    const handleMouseLeave = () => setCursorVisible(false);
    const handleMouseEnter = () => setCursorVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  // Navigation au clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev + 1) % channels.length);
      } else if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => (prev - 1 + channels.length) % channels.length);
      } else if (e.key === "ArrowUp") {
        setSelectedIndex((prev) => (prev - GRID_COLUMNS + channels.length) % channels.length);
      } else if (e.key === "ArrowDown") {
        setSelectedIndex((prev) => (prev + GRID_COLUMNS) % channels.length);
      } else if (e.key === "Enter" && channels[selectedIndex]) {
        handleOpen(channels[selectedIndex].link);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  const channels = [
    { name: "Cuillère", link: "/cuillere", icon: "🍴", color: "#4ECDC4", description: "Assistant IA avec fallback API et mémoire locale", stack: "React + IA" },
    { name: "Pokémon Types", link: "/pokemon-types", icon: "⚡", color: "#FFD166", description: "Analyse stratégique des matchups avec data live", stack: "React + Data API" },
    { name: "Inazuma Draft", link: "/inazuma-draft", icon: "⚽", color: "#2ECC71", description: "Draft 5v5, formations et simulation live", stack: "Game Logic + API" },
    { name: "Cars Cards", link: "/cars-racing", icon: "🏎️", color: "#FF0000", description: "Jeu de cartes Cars: collection + deck + duel", stack: "Game System" },
    { name: "DemonSlayer", link: "/demon-slayer", icon: "🗡️", color: "#EF476F", description: "Encyclopédie animée avec galerie enrichie", stack: "React + Animations" },
    { name: "Yo-kai Medallium", link: "/yokai-medallium", icon: "📿", color: "#22d3ee", description: "Médallium animé connecté à une API MySQL", stack: "React + MySQL API" },
    { name: "App de Planning", link: "/app-de-planning", icon: "📅", color: "#1B9AE0", description: "Projet Laravel intégré depuis le dossier App-de-planning", stack: "Laravel 12 + Inertia Vue" },
    { name: "MaBanque", link: "/mabanque", icon: "🏦", color: "#8E44AD", description: "Projet de cours bancaire (en cours de finalisation)", stack: "Projet scolaire" },
    { name: "À propos", link: "/about", icon: "👤", color: "#FF6B6B", description: "Contexte, parcours et vision produit", stack: "React" }
  ];

  const isExternal = (url) => url.startsWith("http");

  const handleOpen = (link) => {
    if (isExternal(link)) {
      window.open(link, "_blank", "noopener,noreferrer");
    } else {
      const normalizedLink = link.replace(/\/+$/, "");
      navigate(normalizedLink || "/");
    }
  };

  const activeChannel = channels[selectedIndex] || channels[0];

  const ChannelComponent = ({ channel, index, isSelected }) => (
    <div
      className={`wii-channel ${isSelected ? "selected" : ""}`}
      style={{ "--channel-index": index }}
      onMouseEnter={() => setSelectedIndex(index)}
      onClick={() => handleOpen(channel.link)}
      role="button"
      aria-label={`Ouvrir ${channel.name}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleOpen(channel.link);
      }}
    >
      <div className="selection-glow"></div>
      <div className="channel-icon">{channel.icon}</div>
      <div className="channel-label">{channel.name}</div>
    </div>
  );

  const WiiCursor = () => (
    <div
      ref={cursorRef}
      className="wii-cursor"
      style={{
        left: `${cursorPosition.x}px`,
        top: `${cursorPosition.y}px`,
        opacity: cursorVisible ? 1 : 0,
        display: cursorVisible ? "block" : "none",
        pointerEvents: "none"
      }}
    >
      <div className="wii-cursor-dot"></div>
      <div className="wii-cursor-ring"></div>
    </div>
  );

  return (
    <div className="wii-system">
      <WiiCursor />
      <div className="wii-background"></div>

      <div className="wii-header">
        <div className="wii-date">
          {time.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
        </div>
        <div className="wii-clock">
          {time.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>

      <div className="wii-channels-grid">
        {channels.map((channel, index) => (
          <ChannelComponent key={index} channel={channel} index={index} isSelected={index === selectedIndex} />
        ))}
      </div>

      <div className="wii-preview-panel" style={{ "--preview-color": activeChannel?.color || "#0095DD" }}>
        <div className="preview-header">
          <span className="preview-icon">{activeChannel?.icon}</span>
          <div>
            <h3>{activeChannel?.name}</h3>
            <p>{activeChannel?.description}</p>
          </div>
        </div>
        <div className="preview-footer">
          <span className="preview-stack">{activeChannel?.stack}</span>
          <button className="preview-open-btn" onClick={() => handleOpen(activeChannel.link)}>
            Ouvrir maintenant
          </button>
        </div>
      </div>

      <div className="wii-footer">
        <div className="wii-controls">
          <div className="wii-system-buttons wii-music-controls" aria-label="Contrôles musique">
            <button className="wii-system-btn" onClick={togglePlayback}>
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button className="wii-system-btn" onClick={nextTrack}>Suivante</button>
            <select
              className="wii-music-select"
              value={currentTrack.id}
              onChange={(event) => setTrackById(event.target.value)}
              aria-label="Choisir la musique"
            >
              {tracks.map((track) => (
                <option key={track.id} value={track.id}>{track.label}</option>
              ))}
            </select>
            <input
              type="range"
              className="wii-volume"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              aria-label="Volume musique"
            />
          </div>

          <div className="wii-speakers">
            {[0, 1].map((index) => (
              <div key={index} className="speaker" style={{ "--speaker-index": index }}></div>
            ))}
          </div>
          <div className="wii-battery">●●●●</div>
        </div>
      </div>

      <div className="wii-instructions">
        Utilise les flèches ou la souris pour naviguer • Clique pour ouvrir • Lance la musique avec Play
      </div>
      {errorMessage && <div className="wii-audio-note">{errorMessage}</div>}
    </div>
  );
}
