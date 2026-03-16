import React, { useState } from 'react';
import { Check, X, Search } from 'lucide-react';

const Attendance = () => {
  const [attendance, setAttendance] = useState([
    { id: 1, student: 'Jean Martin', date: '2024-01-15', status: 'present' },
    { id: 2, student: 'Marie Dupont', date: '2024-01-15', status: 'absent' },
    { id: 3, student: 'Pierre Lambert', date: '2024-01-15', status: 'present' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const toggleAttendance = (id) => {
    setAttendance(attendance.map(item => 
      item.id === id 
        ? { ...item, status: item.status === 'present' ? 'absent' : 'present' }
        : item
    ));
  };

  return (
    <div>
      <div className="page-header">
        <h1>Gestion des Présences</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input 
            type="date" 
            className="form-control" 
            style={{ width: 'auto' }}
            defaultValue="2024-01-15"
          />
          <button className="btn btn-primary">Enregistrer</button>
        </div>
      </div>

      <div className="data-table">
        <div className="table-header">
          <h2>Feuille de Présence - 15/01/2024</h2>
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
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Étudiant</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record) => (
              <tr key={record.id}>
                <td>{record.id}</td>
                <td>{record.student}</td>
                <td>{record.date}</td>
                <td>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: record.status === 'present' ? '#27ae60' : '#e74c3c',
                    color: 'white'
                  }}>
                    {record.status === 'present' ? 'Présent' : 'Absent'}
                  </span>
                </td>
                <td>
                  <button 
                    className={`btn btn-sm ${record.status === 'present' ? 'btn-danger' : 'btn-success'}`}
                    onClick={() => toggleAttendance(record.id)}
                  >
                    {record.status === 'present' ? <X size={14} /> : <Check size={14} />}
                    {record.status === 'present' ? 'Marquer absent' : 'Marquer présent'}
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

export default Attendance;
