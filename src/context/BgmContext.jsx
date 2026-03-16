import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

const BGM_STORAGE_KEY = 'portfolio_bgm_state_v1';

const BGM_TRACKS = [
  { id: 'mario-galaxy', label: 'Mario Galaxy - Gusty Garden', src: '/audio/mario-galaxy-gusty-garden.mp3', theme: 'Mario' },
  { id: 'mario-64', label: 'Mario 64 - Bob-omb Battlefield', src: '/audio/mario-64-bob-omb.mp3', theme: 'Mario' },
  { id: 'wii-sports', label: 'Wii Sports - Title', src: '/audio/wii-sports-title.mp3', theme: 'Wii' },
  { id: 'tomodachi', label: 'Tomodachi Life - Theme', src: '/audio/tomodachi-life-theme.mp3', theme: 'Nintendo Life' },
  { id: 'inazuma', label: 'Inazuma Eleven - Match Theme', src: '/audio/inazuma-eleven-match.mp3', theme: 'Inazuma' },
  { id: 'yokai-watch', label: 'Yo-kai Watch - Main Theme', src: '/audio/yokai-watch-main-theme.mp3', theme: 'Yo-kai Watch' }
];

const BgmContext = createContext(null);

const readStoredState = () => {
  try {
    const raw = localStorage.getItem(BGM_STORAGE_KEY);
    if (!raw) return { index: 0, volume: 0.45, playing: false };
    const parsed = JSON.parse(raw);
    return {
      index: Number.isInteger(parsed.index) ? parsed.index : 0,
      volume: typeof parsed.volume === 'number' ? parsed.volume : 0.45,
      playing: Boolean(parsed.playing)
    };
  } catch {
    return { index: 0, volume: 0.45, playing: false };
  }
};

export function BgmProvider({ children }) {
  const audioRef = useRef(null);
  const initial = useMemo(() => readStoredState(), []);
  const [currentIndex, setCurrentIndex] = useState(Math.max(0, Math.min(BGM_TRACKS.length - 1, initial.index)));
  const [volume, setVolume] = useState(Math.max(0, Math.min(1, initial.volume)));
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const currentTrack = BGM_TRACKS[currentIndex] || BGM_TRACKS[0];

  useEffect(() => {
    const audio = new Audio();
    audio.loop = false;
    audio.preload = 'none';
    audio.volume = volume;
    audioRef.current = audio;

    const handleEnded = () => {
      setCurrentIndex((prev) => (prev + 1) % BGM_TRACKS.length);
    };

    const handleError = () => {
      setErrorMessage('Piste introuvable. Ajoute le fichier audio correspondant dans public/audio.');
      setIsPlaying(false);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    setAudioReady(true);

    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!audioReady || !audioRef.current) return;
    audioRef.current.src = currentTrack.src;
    audioRef.current.load();
    setErrorMessage('');

    if (isPlaying) {
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [audioReady, currentTrack, isPlaying]);

  useEffect(() => {
    localStorage.setItem(
      BGM_STORAGE_KEY,
      JSON.stringify({ index: currentIndex, volume, playing: isPlaying })
    );
  }, [currentIndex, volume, isPlaying]);

  const play = async () => {
    if (!audioRef.current) return;
    try {
      await audioRef.current.play();
      setIsPlaying(true);
      setErrorMessage('');
    } catch {
      setIsPlaying(false);
      setErrorMessage('Lecture bloquée: clique une fois sur Play pour autoriser l’audio.');
    }
  };

  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const nextTrack = () => {
    setCurrentIndex((prev) => (prev + 1) % BGM_TRACKS.length);
  };

  const previousTrack = () => {
    setCurrentIndex((prev) => (prev - 1 + BGM_TRACKS.length) % BGM_TRACKS.length);
  };

  const setTrackById = (trackId) => {
    const index = BGM_TRACKS.findIndex((entry) => entry.id === trackId);
    if (index >= 0) {
      setCurrentIndex(index);
    }
  };

  const value = {
    tracks: BGM_TRACKS,
    currentTrack,
    isPlaying,
    volume,
    errorMessage,
    play,
    pause,
    togglePlayback,
    nextTrack,
    previousTrack,
    setTrackById,
    setVolume
  };

  return <BgmContext.Provider value={value}>{children}</BgmContext.Provider>;
}

export const useBgm = () => {
  const context = useContext(BgmContext);
  if (!context) {
    throw new Error('useBgm must be used within a BgmProvider');
  }
  return context;
};
