import pool from '../config/database.js';

export const getAllTransactions = async (req, res) => {
  try {
    const { month, year } = req.query;

    let query = 'SELECT * FROM transactions';
    const params = [];

    if (month && year) {
      query += ' WHERE EXTRACT(MONTH FROM date) = $1 AND EXTRACT(YEAR FROM date) = $2';
      params.push(month, year);
    }

    query += ' ORDER BY date DESC, created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Error al obtener transacciones' });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM transactions WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transacción no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Error al obtener transacción' });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { type, amount, description, category, date } = req.body;

    // Validación
    if (!type || !amount) {
      return res.status(400).json({ error: 'Tipo y monto son requeridos' });
    }

    if (type !== 'ingreso' && type !== 'gasto') {
      return res.status(400).json({ error: 'Tipo debe ser "ingreso" o "gasto"' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'El monto debe ser mayor a 0' });
    }

    const result = await pool.query(
      `INSERT INTO transactions (type, amount, description, category, date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [type, amount, description || null, category || null, date || new Date()]
    );

    const newTransaction = result.rows[0];

    // Emit socket event for real-time sync
    const io = req.app.get('io');
    if (io) {
      io.emit('transaction:created', newTransaction);
    }

    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Error al crear transacción' });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, description, category, date } = req.body;

    // Verificar que existe
    const checkResult = await pool.query(
      'SELECT * FROM transactions WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Transacción no encontrada' });
    }

    // Validación
    if (type && type !== 'ingreso' && type !== 'gasto') {
      return res.status(400).json({ error: 'Tipo debe ser "ingreso" o "gasto"' });
    }

    if (amount !== undefined && amount <= 0) {
      return res.status(400).json({ error: 'El monto debe ser mayor a 0' });
    }

    const result = await pool.query(
      `UPDATE transactions
       SET type = COALESCE($1, type),
           amount = COALESCE($2, amount),
           description = COALESCE($3, description),
           category = COALESCE($4, category),
           date = COALESCE($5, date)
       WHERE id = $6
       RETURNING *`,
      [type, amount, description, category, date, id]
    );

    const updatedTransaction = result.rows[0];

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('transaction:updated', updatedTransaction);
    }

    res.json(updatedTransaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Error al actualizar transacción' });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM transactions WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transacción no encontrada' });
    }

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('transaction:deleted', { id: parseInt(id) });
    }

    res.json({ message: 'Transacción eliminada', transaction: result.rows[0] });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Error al eliminar transacción' });
  }
};

export const getBalance = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COALESCE(SUM(CASE WHEN type = 'ingreso' THEN amount ELSE 0 END), 0) -
        COALESCE(SUM(CASE WHEN type = 'gasto' THEN amount ELSE 0 END), 0) as balance
      FROM transactions
    `);

    res.json({ balance: parseFloat(result.rows[0].balance) });
  } catch (error) {
    console.error('Error calculating balance:', error);
    res.status(500).json({ error: 'Error al calcular saldo' });
  }
};

export const getCurrentMonthStats = async (req, res) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const result = await pool.query(`
      SELECT
        COALESCE(SUM(CASE WHEN type = 'ingreso' THEN amount ELSE 0 END), 0) as deposited,
        COALESCE(SUM(CASE WHEN type = 'gasto' THEN amount ELSE 0 END), 0) as spent,
        COUNT(CASE WHEN type = 'gasto' THEN 1 END) as trips
      FROM transactions
      WHERE EXTRACT(MONTH FROM date) = $1
        AND EXTRACT(YEAR FROM date) = $2
    `, [month, year]);

    res.json({
      deposited: parseFloat(result.rows[0].deposited),
      spent: parseFloat(result.rows[0].spent),
      trips: parseInt(result.rows[0].trips)
    });
  } catch (error) {
    console.error('Error calculating stats:', error);
    res.status(500).json({ error: 'Error al calcular estadísticas' });
  }
};
