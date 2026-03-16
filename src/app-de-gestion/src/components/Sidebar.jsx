import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="school-management-wrapper">
      {/* Header */}
      <div className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none' }}
          >
            ☰
          </button>
          <Link to="/" className="back-button">
            ← Retour au Menu Wii
          </Link>
        </div>
        <h1>🏫 App de Gestion Scolaire</h1>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <h2>Navigation</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/app-de-gestion/dashboard" className="nav-item">📊 Tableau de Bord</Link>
          <Link to="/app-de-gestion/students" className="nav-item">👨‍🎓 Étudiants</Link>
          <Link to="/app-de-gestion/teachers" className="nav-item">👩‍🏫 Enseignants</Link>
          <Link to="/app-de-gestion/courses" className="nav-item">📚 Cours</Link>
          <Link to="/app-de-gestion/grades" className="nav-item">📝 Notes</Link>
          <Link to="/app-de-gestion/attendance" className="nav-item">📅 Présences</Link>
        </nav>
      </div>

      {/* Overlay mobile */}
      {mobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            top: '70px',
            left: '0',
            right: '0',
            bottom: '0',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 9999
          }}
        />
      )}

      {/* Contenu */}
      <div className="main-content">
        {/* Ici votre app de gestion scolaire */}
        <div className="page-container">
          {/* Le contenu de Dashboard, Students, etc. ira ici */}
        </div>
      </div>
    </div>
  );
}
