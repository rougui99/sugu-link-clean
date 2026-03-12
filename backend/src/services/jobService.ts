import { pool } from '../config/database';
import { Job } from '../models/Job';

// Rechercher tous les jobs avec pagination et mot-clé
export const searchJobs = async (
  keyword = '',
  page = 1,
  pageSize = 10
): Promise<Job[]> => {
  const offset = (page - 1) * pageSize;
  const params: any[] = [];
  let query = 'SELECT * FROM job_listings';

  if (keyword) {
    query += ' WHERE title ILIKE $1 OR description ILIKE $2';
    params.push(`%${keyword}%`, `%${keyword}%`);
  }

  query += ` ORDER BY id ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(pageSize, offset);

  const result = await pool.query(query, params);
  return result.rows;
};

// Récupérer un job par ID
export const getJobById = async (jobId: number): Promise<Job | null> => {
  const result = await pool.query('SELECT * FROM job_listings WHERE id=$1', [jobId]);
  return result.rows[0] ?? null;
};

// Créer un nouveau job
export const createJob = async (job: Omit<Job, 'id' | 'created_at' | 'updated_at'>): Promise<Job> => {
  const { company_id, title, description, location, salary } = job;
  const result = await pool.query(
    `INSERT INTO job_listings (company_id, title, description, location, salary)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [company_id, title, description, location, salary]
  );
  return result.rows[0];
};
