import React from 'react';
import { useLocation } from 'react-router-dom';
import { useBgm } from '../context/BgmContext';
import '../styles/components/GlobalBgmDock.css';

export default function GlobalBgmDock() {
  const location = useLocation();
  const { currentTrack, isPlaying, togglePlayback, nextTrack } = useBgm();

  const hiddenPaths = new Set(['/menu', '/']);
  if (hiddenPaths.has(location.pathname)) return null;

  return (
    <div className="global-bgm-dock" aria-label="Contrôle musique de fond">
      <div className="global-bgm-track">🎵 {currentTrack.label}</div>
      <div className="global-bgm-actions">
        <button onClick={togglePlayback}>{isPlaying ? 'Pause' : 'Play'}</button>
        <button onClick={nextTrack}>Suivante</button>
      </div>
    </div>
  );
}
