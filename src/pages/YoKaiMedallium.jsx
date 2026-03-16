import React, { useEffect, useMemo, useState } from 'react';
import '../styles/pages/YoKaiMedallium.css';

const API_BASE = import.meta.env.VITE_YOKAI_API_URL || 'http://localhost:4010/api/yokai';

export default function YoKaiMedallium() {
  const [yokaiList, setYokaiList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [tribe, setTribe] = useState('');
  const [tribes, setTribes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadYoKai = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: '1', pageSize: '120' });
      if (search) params.set('search', search);
      if (tribe) params.set('tribe', tribe);

      const [listRes, tribesRes] = await Promise.all([
        fetch(`${API_BASE}?${params.toString()}`),
        fetch(`${API_BASE}/tribes`)
      ]);

      if (!listRes.ok) {
        throw new Error(`API ${listRes.status}`);
      }

      const listData = await listRes.json();
      const tribesData = tribesRes.ok ? await tribesRes.json() : [];

      setYokaiList(listData.data || []);
      setTribes(tribesData || []);
      setSelected((previous) => previous || listData.data?.[0] || null);
    } catch (fetchError) {
      setError('Impossible de charger le médallium depuis l’API MySQL.');
      console.error(fetchError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(loadYoKai, 220);
    return () => clearTimeout(timeout);
  }, [search, tribe]);

  const completionPercent = useMemo(() => {
    const totalSlots = 800;
    return Math.min(100, Math.round((yokaiList.length / totalSlots) * 100));
  }, [yokaiList.length]);

  return (
    <div className="yokai-medallium-page">
      <header className="medallium-header">
        <h1>📿 Yo-kai Medallium Live</h1>
        <p>Base MySQL + import wiki: visualise tous les Yo-kai avec leurs médailles et descriptions.</p>
      </header>

      <section className="medallium-controls">
        <input
          type="text"
          placeholder="Rechercher un Yo-kai..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select value={tribe} onChange={(event) => setTribe(event.target.value)}>
          <option value="">Toutes les tribus</option>
          {tribes.map((entry) => (
            <option key={entry.tribe} value={entry.tribe}>{entry.tribe} ({entry.count})</option>
          ))}
        </select>
        <button onClick={loadYoKai}>Rafraîchir</button>
      </section>

      <section className="medallium-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${completionPercent}%` }}></div>
        </div>
        <span>{yokaiList.length} Yo-kai chargés · {completionPercent}% du médallium estimé</span>
      </section>

      {error && <div className="medallium-error">{error}</div>}

      <div className="medallium-layout">
        <div className="medallium-wheel">
          {loading ? (
            <div className="wheel-placeholder">Chargement du médallium...</div>
          ) : (
            yokaiList.map((yokai, index) => (
              <button
                key={yokai.id}
                className={`medal-slot ${selected?.id === yokai.id ? 'active' : ''}`}
                style={{ '--slot-index': index }}
                onClick={() => setSelected(yokai)}
              >
                <img src={yokai.medalImageUrl || yokai.imageUrl} alt={yokai.name} loading="lazy" />
                <span>{yokai.name}</span>
              </button>
            ))
          )}
        </div>

        <aside className="yokai-detail-card">
          {selected ? (
            <>
              <h2>{selected.name}</h2>
              <p className="meta">Tribu: {selected.tribe || 'N/A'} · Rang: {selected.rankCode || 'N/A'}</p>
              <div className="images">
                <img src={selected.imageUrl} alt={selected.name} />
                <img src={selected.medalImageUrl || selected.imageUrl} alt={`Médaille ${selected.name}`} />
              </div>
              <p>{selected.descriptionText || 'Description indisponible.'}</p>
              {selected.wikiUrl && (
                <a href={selected.wikiUrl} target="_blank" rel="noreferrer">Voir la source wiki</a>
              )}
            </>
          ) : (
            <p>Sélectionne une médaille pour voir les détails.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
