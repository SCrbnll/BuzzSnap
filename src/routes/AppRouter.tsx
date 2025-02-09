// src/routes/AppRouter.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../views/LoginView';
import Register from '../views/RegisterView';
import HomeView from '../views/HomeView';
import NotFound from '../views/NotFoundView';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Redirige de '/' a '/login' */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Ruta para el login */}
        <Route path="/login" element={<Login />} />
        
        {/* Ruta para el registro */}
        <Route path="/register" element={<Register />} />
        
        {/* Ruta para el home */}
        <Route path="/home" element={<HomeView />} />

        {/* Ruta para errores 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
