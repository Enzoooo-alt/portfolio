import React, { useState } from 'react';
import './Teachers.css';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

const Teachers = () => {
  const [teachers, setTeachers] = useState([
    { id: 1, name: 'Dr. Michel Durand', email: 'm.durand@ecole.fr', subject: 'Mathématiques', phone: '01 23 45 67 89' },
    { id: 2, name: 'Mme. Catherine Moreau', email: 'c.moreau@ecole.fr', subject: 'Français', phone: '01 34 56 78 90' },
    { id: 3, name: 'Prof. Robert Petit', email: 'r.petit@ecole.fr', subject: 'Physique', phone: '01 45 67 89 01' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      <div className="page-header">
        <h1>Gestion des Enseignants</h1>
        <button className="btn btn-primary">
          <Plus size={16} />
          Ajouter un enseignant
        </button>
      </div>

      <div className="data-table">
        <div className="table-header">
          <h2>Liste des Enseignants</h2>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#7f8c8d' }} />
            <input
              type="text"
              placeholder="Rechercher un enseignant..."
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
              <th>Nom</th>
              <th>Email</th>
              <th>Matière</th>
              <th>Téléphone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td>{teacher.id}</td>
                <td>{teacher.name}</td>
                <td>{teacher.email}</td>
                <td>{teacher.subject}</td>
                <td>{teacher.phone}</td>
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

export default Teachers;
