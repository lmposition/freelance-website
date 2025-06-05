import express from 'express';
import pool from './db';

const app = express();
const port = process.env.PORT || 4000;

app.get('/', async (req, res) => {
  const { rows } = await pool.query('SELECT NOW() as now');
  res.json({ message: 'Backend API', now: rows[0].now });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
