import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

const Courses = () => {
  const [courses, setCourses] = useState([
    { id: 1, name: 'Mathématiques', teacher: 'Dr. Michel Durand', class: 'Terminale A', schedule: 'Lundi 9h-11h' },
    { id: 2, name: 'Français', teacher: 'Mme. Catherine Moreau', class: 'Première B', schedule: 'Mardi 14h-16h' },
    { id: 3, name: 'Physique Chimie', teacher: 'Prof. Robert Petit', class: 'Terminale C', schedule: 'Mercredi 10h-12h' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      <div className="page-header">
        <h1>Gestion des Cours</h1>
        <button className="btn btn-primary">
          <Plus size={16} />
          Ajouter un cours
        </button>
      </div>

      <div className="data-table">
        <div className="table-header">
          <h2>Liste des Cours</h2>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#7f8c8d' }} />
            <input
              type="text"
              placeholder="Rechercher un cours..."
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
              <th>Matière</th>
              <th>Enseignant</th>
              <th>Classe</th>
              <th>Horaire</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.name}</td>
                <td>{course.teacher}</td>
                <td>{course.class}</td>
                <td>{course.schedule}</td>
                <td>
                  <button className="btn btn-primary btn-sm" style={{ marginRight: '5px' }}>
                    <Edit size={14} />
                  </button>
                  <button className="btn btn-danger btn-sm">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Courses;
