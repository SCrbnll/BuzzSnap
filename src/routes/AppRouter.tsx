import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/views/LoginView';
import Register from '@/views/RegisterView';
import HomeView from '@/views/HomeView';
import NotFound from '@/views/NotFoundView';
import MainLayout from '@/layouts/MainLayout';
import ChatView from '@/views/ChatView';
import ContactView from '@/views/ContactView';
import GroupView from '@/views/GroupView';
import ProtectedRoute from './ProtectedRoute'; 

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Redirige de '/' a '/login' */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <MainLayout>
                <HomeView />
              </MainLayout>
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <p className="text-center fs-4 d-flex align-items-center justify-content-center vh-100">
                ¿Listo para chatear?
              </p>
            }
          />
          <Route path="chats" element={<ChatView />} />
          <Route path="contacts" element={<ContactView />} />
        </Route>

        <Route
          path="/groups/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <GroupView />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Ruta para errores 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
