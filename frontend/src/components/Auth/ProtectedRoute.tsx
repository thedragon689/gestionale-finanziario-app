import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  
  // Controlla se l'utente è autenticato
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    // Verifica che ci sia sia il token che i dati utente
    if (!token || !user) {
      return false;
    }
    
    try {
      // Verifica che i dati utente siano validi JSON
      const userData = JSON.parse(user);
      if (!userData.id || !userData.email) {
        return false;
      }
      
      // Verifica che il token non sia scaduto (qui puoi aggiungere logica per JWT expiration)
      // Per ora consideriamo valido se esiste
      return true;
    } catch (error) {
      console.error('Errore nel parsing dei dati utente:', error);
      return false;
    }
  };

  if (!isAuthenticated()) {
    // Salva la route richiesta per reindirizzare dopo il login
    localStorage.setItem('redirectAfterLogin', location.pathname);
    
    // Reindirizza al login
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
