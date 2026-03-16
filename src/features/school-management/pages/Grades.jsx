import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';

const Grades = () => {
  const [grades, setGrades] = useState([
    { id: 1, student: 'Jean Martin', course: 'Mathématiques', grade: 16, date: '2024-01-15' },
    { id: 2, student: 'Marie Dupont', course: 'Français', grade: 14, date: '2024-01-16' },
    { id: 3, student: 'Pierre Lambert', course: 'Physique', grade: 12, date: '2024-01-17' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      <div className="page-header">
        <h1>Gestion des Notes</h1>
        <button className="btn btn-primary">
          <Plus size={16} />
          Ajouter une note
        </button>
      </div>

      <div className="data-table">
        <div className="table-header">
          <h2>Notes des Étudiants</h2>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#7f8c8d' }} />
            <input
              type="text"
              placeholder="Rechercher une note..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '8px 8px 8px 35px', border: '1px solid #ddd', borderRadius: '5px', width: '250px' }}
            />
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Étudiant</th>
              <th>Matière</th>
              <th>Note</th>
              <th>Date</th>
              <th>Appréciation</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade) => (
              <tr key={grade.id}>
                <td>{grade.id}</td>
                <td>{grade.student}</td>
                <td>{grade.course}</td>
                <td>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: grade.grade >= 16 ? '#27ae60' : grade.grade >= 12 ? '#f39c12' : '#e74c3c',
                    color: 'white'
                  }}>
                    {grade.grade}/20
                  </span>
                </td>
                <td>{grade.date}</td>
                <td>
                  {grade.grade >= 16 ? 'Excellent' : grade.grade >= 12 ? 'Bien' : 'À améliorer'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Grades;
