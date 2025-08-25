const express = require('express');
const router = express.Router();

// GET /api/v1/accounts - Lista tutti i conti
router.get('/', async (req, res) => {
  try {
    const mockAccounts = [
      {
        id: '1',
        accountNumber: 'IT123456789',
        iban: 'IT60X0542811101000000123456',
        customerId: 'customer1',
        balance: 50000.00,
        availableBalance: 48000.00,
        currency: 'EUR',
        status: 'active',
        accountType: 'checking',
        createdAt: new Date('2024-01-01')
      },
      {
        id: '2',
        accountNumber: 'IT987654321',
        iban: 'IT60X0542811101000000987654',
        customerId: 'customer1',
        balance: 125000.00,
        availableBalance: 120000.00,
        currency: 'EUR',
        status: 'active',
        accountType: 'savings',
        createdAt: new Date('2024-01-15')
      }
    ];
    
    res.json(mockAccounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

// GET /api/v1/accounts/:id - Dettagli conto specifico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const mockAccount = {
      id: id,
      accountNumber: 'IT123456789',
      iban: 'IT60X0542811101000000123456',
      customerId: 'customer1',
      balance: 50000.00,
      availableBalance: 48000.00,
      currency: 'EUR',
      status: 'active',
      accountType: 'checking',
      createdAt: new Date('2024-01-01')
    };
    
    res.json(mockAccount);
  } catch (error) {
    console.error('Error fetching account:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

module.exports = router;
