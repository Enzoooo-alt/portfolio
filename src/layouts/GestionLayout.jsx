import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../features/school-management/components/Sidebar';
import Dashboard from '../features/school-management/pages/Dashboard';
import Attendance from '../features/school-management/pages/Attendance';
import Courses from '../features/school-management/pages/Courses';
import Grades from '../features/school-management/pages/Grades';
import Students from '../features/school-management/pages/Students';
import Teachers from '../features/school-management/pages/Teachers';

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
