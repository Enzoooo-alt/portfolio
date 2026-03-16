import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/WiiMenu.css";

export default function WiiMenu() {
  const [time, setTime] = useState(new Date());
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(true);
  const cursorRef = useRef(null);
  const navigate = useNavigate();

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
        setSelectedIndex((prev) => (prev - 3 + channels.length) % channels.length);
      } else if (e.key === "ArrowDown") {
        setSelectedIndex((prev) => (prev + 3) % channels.length);
      } else if (e.key === "Enter" && channels[selectedIndex]) {
        handleOpen(channels[selectedIndex].link);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  const channels = [
    { name: "Mon Blog", link: "https://enzobourgin.fr/MonBlog", icon: "📝", color: "#0095DD" },
    { name: "À propos", link: "/about", icon: "👤", color: "#FF6B6B" },
    { name: "Cuillère", link: "/cuillere", icon: "🍴", color: "#4ECDC4" },
    { name: "Pokémon Types", link: "/pokemon-types", icon: "⚡", color: "#FFD166" },
    { name: "Memory Game", link: "/memory-game", icon: "🎮", color: "#06D6A0" },
    { name: "App de Planning", link: "/app-de-planning/", icon: "📅", color: "#118AB2" },
    { name: "ReactCourse", link: "/react-course", icon: "⚛️", color: "#61DAFB" },
    { name: "DemonSlayer", link: "/demon-slayer", icon: "🗡️", color: "#EF476F" },
    { name: "Inazuma Draft", link: "/inazuma-draft", icon: "⚽", color: "#2ECC71" },
    { name: "MaBanque", link: "/mabanque", icon: "🏦", color: "#8E44AD" },
    { name: "Image to Link", link: "/image-to-link", icon: "🖼️", color: "#8B5CF6" },
    { name: "Cars Racing", link: "/cars-racing", icon: "🏎️", color: "#FF0000" }
  ];

  const isExternal = (url) => url.startsWith("http");

  const handleOpen = (link) => {
    if (isExternal(link)) {
      window.open(link, "_blank");
    } else {
      // 🎯 On laisse Apache gérer /mabanque et /app-de-planning
      if (link === "/mabanque" || link === "/app-de-planning") {
        window.location.href = link;
      } else {
        navigate(link);
      }
    }
  };

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

      <div className="wii-footer">
        <div className="wii-controls">
          <div className="wii-speakers">
            {[0, 1].map((index) => (
              <div key={index} className="speaker" style={{ "--speaker-index": index }}></div>
            ))}
          </div>
          <div className="wii-battery">●●●●</div>
        </div>
      </div>

      <div className="wii-instructions">
        Utilise les flèches ou la souris pour naviguer • Clique pour ouvrir
      </div>
    </div>
  );
}
