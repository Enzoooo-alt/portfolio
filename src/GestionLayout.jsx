import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './app-de-gestion/src/components/Sidebar';
import Dashboard from './app-de-gestion/src/pages/Dashboard';
import Attendance from './app-de-gestion/src/pages/Attendance';
import Courses from './app-de-gestion/src/pages/Courses';
import Grades from './app-de-gestion/src/pages/Grades';
import Students from './app-de-gestion/src/pages/Students';
import Teachers from './app-de-gestion/src/pages/Teachers';

export default function GestionLayout() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="courses" element={<Courses />} />
          <Route path="grades" element={<Grades />} />
          <Route path="attendance" element={<Attendance />} />
        </Routes>
      </div>
    </div>
  );
}
