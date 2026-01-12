import pool from '../config/database.js';

export const getSettings = async (req, res) => {
  try {
    // No retornar el PIN por seguridad
    res.json({
      message: 'Settings disponibles vía endpoints específicos'
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Error al obtener configuración' });
  }
};

export const verifyPin = async (req, res) => {
  try {
    const { pin } = req.body;

    if (!pin) {
      return res.status(400).json({ error: 'PIN es requerido' });
    }

    const result = await pool.query(
      'SELECT pin FROM settings LIMIT 1'
    );

    if (result.rows.length === 0) {
      return res.status(500).json({ error: 'No hay configuración de PIN' });
    }

    const storedPin = result.rows[0].pin;
    const isValid = pin === storedPin;

    if (isValid) {
      res.json({ valid: true, message: 'PIN correcto' });
    } else {
      res.status(401).json({ valid: false, message: 'PIN incorrecto' });
    }
  } catch (error) {
    console.error('Error verifying PIN:', error);
    res.status(500).json({ error: 'Error al verificar PIN' });
  }
};

export const updatePin = async (req, res) => {
  try {
    const { oldPin, newPin } = req.body;

    if (!oldPin || !newPin) {
      return res.status(400).json({ error: 'PIN actual y nuevo son requeridos' });
    }

    if (newPin.length !== 6 || !/^\d+$/.test(newPin)) {
      return res.status(400).json({ error: 'El nuevo PIN debe tener 6 dígitos' });
    }

    // Verificar PIN actual
    const result = await pool.query(
      'SELECT pin FROM settings LIMIT 1'
    );

    if (result.rows.length === 0) {
      return res.status(500).json({ error: 'No hay configuración de PIN' });
    }

    const storedPin = result.rows[0].pin;

    if (oldPin !== storedPin) {
      return res.status(401).json({ error: 'PIN actual incorrecto' });
    }

    // Actualizar PIN
    await pool.query(
      'UPDATE settings SET pin = $1, updated_at = NOW()',
      [newPin]
    );

    res.json({ message: 'PIN actualizado exitosamente' });
  } catch (error) {
    console.error('Error updating PIN:', error);
    res.status(500).json({ error: 'Error al actualizar PIN' });
  }
};

export const getSetting = async (req, res) => {
  try {
    const { key } = req.params;

    // No permitir obtener el PIN directamente
    if (key === 'pin') {
      return res.status(403).json({ error: 'No se puede obtener el PIN directamente' });
    }

    const result = await pool.query(
      'SELECT value FROM settings WHERE key = $1',
      [key]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Configuración no encontrada' });
    }

    res.json({ key, value: result.rows[0].value });
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({ error: 'Error al obtener configuración' });
  }
};

export const updateSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    // No permitir actualizar el PIN por esta ruta
    if (key === 'pin') {
      return res.status(403).json({ error: 'Use el endpoint /api/settings/pin para actualizar el PIN' });
    }

    const result = await pool.query(
      'UPDATE settings SET value = $1, updated_at = NOW() WHERE key = $2 RETURNING *',
      [value, key]
    );

    if (result.rows.length === 0) {
      // Insertar si no existe
      await pool.query(
        'INSERT INTO settings (key, value) VALUES ($1, $2)',
        [key, value]
      );
    }

    res.json({ message: 'Configuración actualizada', key, value });
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({ error: 'Error al actualizar configuración' });
  }
};
