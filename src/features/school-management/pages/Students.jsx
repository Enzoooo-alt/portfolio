import React, { useMemo, useState } from 'react';
import './Students.css';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

const Students = () => {
  const [students, setStudents] = useState([
    { id: 1, name: 'Jean Martin', email: 'jean.martin@email.com', class: 'Terminale A', phone: '01 23 45 67 89' },
    { id: 2, name: 'Marie Dupont', email: 'marie.dupont@email.com', class: 'Première B', phone: '01 34 56 78 90' },
    { id: 3, name: 'Pierre Lambert', email: 'pierre.lambert@email.com', class: 'Terminale C', phone: '01 45 67 89 01' },
    { id: 4, name: 'Sophie Bernard', email: 'sophie.bernard@email.com', class: 'Seconde A', phone: '01 56 78 90 12' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    class: '',
    phone: ''
  });

  const availableClasses = useMemo(
    () => Array.from(new Set(students.map((student) => student.class))).sort(),
    [students]
  );

  const filteredStudents = useMemo(
    () => students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.class.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesClass = classFilter === 'all' || student.class === classFilter;
      return matchesSearch && matchesClass;
    }),
    [students, searchTerm, classFilter]
  );

  const sortedStudents = useMemo(() => {
    const sorted = [...filteredStudents].sort((first, second) => {
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
  }, [filteredStudents, sortConfig]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newStudent = {
      id: students.length + 1,
      ...formData
    };
    setStudents([...students, newStudent]);
    setShowModal(false);
    setFormData({ name: '', email: '', class: '', phone: '' });
  };

  const handleDelete = (id) => {
    setStudents(students.filter(student => student.id !== id));
  };

  return (
    <div>
      <div className="page-header">
        <h1>Gestion des Étudiants</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} />
          Ajouter un étudiant
        </button>
      </div>

      <div className="data-table">
        <div className="table-header">
          <h2>Liste des Étudiants</h2>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#7f8c8d' }} />
              <input
                type="text"
                placeholder="Rechercher un étudiant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '8px 8px 8px 35px', border: '1px solid #ddd', borderRadius: '5px', width: '250px' }}
              />
            </div>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              style={{ padding: '8px 10px', border: '1px solid #ddd', borderRadius: '5px' }}
            >
              <option value="all">Toutes les classes</option>
              {availableClasses.map((className) => (
                <option key={className} value={className}>{className}</option>
              ))}
            </select>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
              {sortedStudents.length} résultat(s)
            </span>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th><button type="button" className="sort-header-btn" onClick={() => requestSort('id')}>ID {getSortIndicator('id')}</button></th>
              <th><button type="button" className="sort-header-btn" onClick={() => requestSort('name')}>Nom {getSortIndicator('name')}</button></th>
              <th><button type="button" className="sort-header-btn" onClick={() => requestSort('email')}>Email {getSortIndicator('email')}</button></th>
              <th><button type="button" className="sort-header-btn" onClick={() => requestSort('class')}>Classe {getSortIndicator('class')}</button></th>
              <th>Téléphone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.class}</td>
                <td>{student.phone}</td>
                <td>
                  <button className="btn btn-primary btn-sm" style={{ marginRight: '5px' }}>
                    <Edit size={14} />
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(student.id)}>
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Ajouter un étudiant</h2>
              <button className="close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nom complet</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Classe</label>
                <select
                  className="form-control"
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  required
                >
                  <option value="">Sélectionner une classe</option>
                  <option value="Seconde A">Seconde A</option>
                  <option value="Seconde B">Seconde B</option>
                  <option value="Première A">Première A</option>
                  <option value="Première B">Première B</option>
                  <option value="Terminale A">Terminale A</option>
                  <option value="Terminale B">Terminale B</option>
                </select>
              </div>
              <div className="form-group">
                <label>Téléphone</label>
                <input
                  type="tel"
                  className="form-control"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn" onClick={() => setShowModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
