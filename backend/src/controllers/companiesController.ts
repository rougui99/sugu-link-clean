import { Request, Response } from 'express';
import { pool } from '../config/database';

// GET all companies
export const getAllCompanies = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM companies ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// GET company by ID
export const getCompanyById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM companies WHERE id=$1', [id]);
    res.json(result.rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// POST create company
export const createCompany = async (req: Request, res: Response) => {
  const { name, email, phone_number, website, industry } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO companies (name, email, phone_number, website, industry) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, email, phone_number, website, industry]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};
