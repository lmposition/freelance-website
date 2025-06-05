import { Pool } from 'pg';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:pass@localhost:5432/mydb'
});
export default pool;
