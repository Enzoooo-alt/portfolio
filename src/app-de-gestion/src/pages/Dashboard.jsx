import React from 'react';
import './Dashboard.css';
import { Users, UserCheck, BookOpen, Award } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { icon: Users, label: 'Étudiants', value: '1,245', color: '#3498db' },
    { icon: UserCheck, label: 'Enseignants', value: '48', color: '#27ae60' },
    { icon: BookOpen, label: 'Cours', value: '32', color: '#e74c3c' },
    { icon: Award, label: 'Moyenne Générale', value: '14.2/20', color: '#f39c12' },
  ];

  const recentActivities = [
    { id: 1, action: 'Nouvel étudiant inscrit', name: 'Marie Dupont', time: 'Il y a 5 min' },
    { id: 2, action: 'Note ajoutée', name: 'Mathématiques - Jean Martin', time: 'Il y a 15 min' },
    { id: 3, action: 'Absence signalée', name: 'Pierre Lambert', time: 'Il y a 1 heure' },
    { id: 4, action: 'Nouveau cours créé', name: 'Physique Chimie', time: 'Il y a 2 heures' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Tableau de Bord</h1>
        <div>Bienvenue, Administrateur</div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
              <Icon size={24} color={stat.color} />
              <h3>{stat.label}</h3>
              <div className="number">{stat.value}</div>
            </div>
          );
        })}
      </div>

      <div className="data-table">
        <div className="table-header">
          <h2>Activités Récentes</h2>
        </div>
        <div style={{ padding: '20px' }}>
          {recentActivities.map((activity) => (
            <div key={activity.id} style={{ 
              padding: '15px', 
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <strong>{activity.action}</strong>
                <div style={{ color: '#7f8c8d', fontSize: '14px' }}>{activity.name}</div>
              </div>
              <span style={{ color: '#95a5a6', fontSize: '12px' }}>{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
