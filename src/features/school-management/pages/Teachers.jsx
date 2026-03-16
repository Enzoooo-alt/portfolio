import React, { useMemo, useState } from 'react';
import './Teachers.css';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

const Teachers = () => {
  const [teachers, setTeachers] = useState([
    { id: 1, name: 'Dr. Michel Durand', email: 'm.durand@ecole.fr', subject: 'Mathématiques', phone: '01 23 45 67 89' },
    { id: 2, name: 'Mme. Catherine Moreau', email: 'c.moreau@ecole.fr', subject: 'Français', phone: '01 34 56 78 90' },
    { id: 3, name: 'Prof. Robert Petit', email: 'r.petit@ecole.fr', subject: 'Physique', phone: '01 45 67 89 01' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

  const availableSubjects = useMemo(
    () => Array.from(new Set(teachers.map((teacher) => teacher.subject))).sort(),
    [teachers]
  );

  const filteredTeachers = useMemo(
    () => teachers.filter((teacher) => {
      const matchesSearch =
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSubject = subjectFilter === 'all' || teacher.subject === subjectFilter;
      return matchesSearch && matchesSubject;
    }),
    [teachers, searchTerm, subjectFilter]
  );

  const sortedTeachers = useMemo(() => {
    const sorted = [...filteredTeachers].sort((first, second) => {
      const firstValue = String(first[sortConfig.key] ?? '').toLowerCase();
      const secondValue = String(second[sortConfig.key] ?? '').toLowerCase();

      if (firstValue < secondValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (firstValue > secondValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  }, [filteredTeachers, sortConfig]);

  const requestSort = (key) => {
    setSortConfig((previous) => {
      const nextDirection = previous.key === key && previous.direction === 'asc' ? 'desc' : 'asc';
      return { key, direction: nextDirection };
    });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return '↕';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const handleDelete = (teacherId) => {
    setTeachers((previous) => previous.filter((teacher) => teacher.id !== teacherId));
  };

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
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
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
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              style={{ padding: '8px 10px', border: '1px solid #ddd', borderRadius: '5px' }}
            >
              <option value="all">Toutes les matières</option>
              {availableSubjects.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
              {sortedTeachers.length} résultat(s)
            </span>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th><button type="button" className="sort-header-btn" onClick={() => requestSort('id')}>ID {getSortIndicator('id')}</button></th>
              <th><button type="button" className="sort-header-btn" onClick={() => requestSort('name')}>Nom {getSortIndicator('name')}</button></th>
              <th><button type="button" className="sort-header-btn" onClick={() => requestSort('email')}>Email {getSortIndicator('email')}</button></th>
              <th><button type="button" className="sort-header-btn" onClick={() => requestSort('subject')}>Matière {getSortIndicator('subject')}</button></th>
              <th>Téléphone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTeachers.map((teacher) => (
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
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(teacher.id)}>
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
