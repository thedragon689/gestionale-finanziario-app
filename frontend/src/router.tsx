import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import Accounts from './pages/Accounts/Accounts';
import Transactions from './pages/Transactions/Transactions';
import Customers from './pages/Customers/Customers';
import Funds from './pages/Funds/Funds';
import Insurance from './pages/Insurance/Insurance';
import Reports from './pages/Reports/Reports';
import Settings from './pages/Settings/Settings';
import Login from './pages/Auth/Login';
import AIAgent from './pages/AIAgent/AIAgent';
import AIAdvanced from './pages/AIAdvanced/AIAdvanced';
import AIEnterprise from './pages/AIEnterprise/AIEnterprise';
import CryptoWallets from './pages/CryptoWallets/CryptoWallets';
import RSS from './pages/RSS/RSS';
import Equities from './pages/Equities/Equities';
import Bonds from './pages/Bonds/Bonds';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Configurazione router con autenticazione
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/accounts',
    element: (
      <ProtectedRoute>
        <Accounts />
      </ProtectedRoute>
    ),
  },
  {
    path: '/transactions',
    element: (
      <ProtectedRoute>
        <Transactions />
      </ProtectedRoute>
    ),
  },
  {
    path: '/crypto',
    element: (
      <ProtectedRoute>
        <CryptoWallets />
      </ProtectedRoute>
    ),
  },
  {
    path: '/customers',
    element: (
      <ProtectedRoute>
        <Customers />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reports',
    element: (
      <ProtectedRoute>
        <Reports />
      </ProtectedRoute>
    ),
  },
  {
    path: '/funds',
    element: (
      <ProtectedRoute>
        <Funds />
      </ProtectedRoute>
    ),
  },
  {
    path: '/insurance',
    element: (
      <ProtectedRoute>
        <Insurance />
      </ProtectedRoute>
    ),
  },
  {
    path: '/ai-agent',
    element: (
      <ProtectedRoute>
        <AIAgent />
      </ProtectedRoute>
    ),
  },
  {
    path: '/ai-advanced',
    element: (
      <ProtectedRoute>
        <AIAdvanced />
      </ProtectedRoute>
    ),
  },
  {
    path: '/ai-enterprise',
    element: (
      <ProtectedRoute>
        <AIEnterprise />
      </ProtectedRoute>
    ),
  },
  {
    path: '/ai-news',
    element: (
      <ProtectedRoute>
        <div style={{ padding: '24px' }}>
          <h4>AI News Intelligence</h4>
          <p>Funzionalità in sviluppo. Presto disponibile.</p>
        </div>
      </ProtectedRoute>
    ),
  },
  {
    path: '/rss',
    element: (
      <ProtectedRoute>
        <RSS />
      </ProtectedRoute>
    ),
  },
  {
    path: '/equities',
    element: (
      <ProtectedRoute>
        <Equities />
      </ProtectedRoute>
    ),
  },
  {
    path: '/bonds',
    element: (
      <ProtectedRoute>
        <Bonds />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
], {
  // Future flags will be added when upgrading to React Router v7
});

export { router };
