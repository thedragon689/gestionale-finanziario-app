const express = require('express');
const router = express.Router();

// GET /api/v1/transactions - Lista tutte le transazioni
router.get('/', async (req, res) => {
  try {
    const mockTransactions = [
      {
        id: '1',
        accountId: '1',
        type: 'deposit',
        amount: 1000.00,
        currency: 'EUR',
        description: 'Bonifico in entrata',
        status: 'completed',
        timestamp: new Date('2024-01-15T10:30:00Z')
      },
      {
        id: '2',
        accountId: '1',
        type: 'withdrawal',
        amount: -150.00,
        currency: 'EUR',
        description: 'Prelievo ATM',
        status: 'completed',
        timestamp: new Date('2024-01-14T15:45:00Z')
      },
      {
        id: '3',
        accountId: '1',
        type: 'payment',
        amount: -75.50,
        currency: 'EUR',
        description: 'Pagamento bolletta',
        status: 'completed',
        timestamp: new Date('2024-01-13T09:15:00Z')
      }
    ];
    
    res.json(mockTransactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

// GET /api/v1/transactions/:id - Dettagli transazione specifica
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const mockTransaction = {
      id: id,
      accountId: '1',
      type: 'deposit',
      amount: 1000.00,
      currency: 'EUR',
      description: 'Bonifico in entrata',
      status: 'completed',
      timestamp: new Date('2024-01-15T10:30:00Z'),
      metadata: {
        sender: 'Banca Sender',
        reference: 'REF123456',
        category: 'income'
      }
    };
    
    res.json(mockTransaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

module.exports = router;
