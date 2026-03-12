import { Request, Response } from 'express';
import { pool } from '../config/database';

// GET all jobs with optional keyword search & pagination
export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const keyword = (req.query.keyword as string) || '';
    const page = parseInt((req.query.page as string) || '1');
    const pageSize = parseInt((req.query.pageSize as string) || '10');
    const offset = (page - 1) * pageSize;

    let query = 'SELECT * FROM job_listings';
    const params: any[] = [];

    if (keyword) {
      query += ' WHERE title ILIKE $1 OR description ILIKE $2';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    query += ` ORDER BY id ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(pageSize, offset);

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// GET job by ID
export const getJobById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM job_listings WHERE id=$1', [id]);
    res.json(result.rows[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: (err as Error).message });
  }
};

// POST create job
export const createJob = async (req: Request, res: Response) => {
  const { company_id, title, description, location, salary } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO job_listings (company_id, title, description, location, salary)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [company_id, title, description, location, salary]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: (err as Error).message });
  }
};
