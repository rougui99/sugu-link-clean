import { pool } from '../config/database';
import { Company } from '../models/Company';

// Récupérer toutes les entreprises
export const getAllCompanies = async (): Promise<Company[]> => {
  const result = await pool.query('SELECT * FROM companies ORDER BY id ASC');
  return result.rows;
};

// Récupérer une entreprise par ID
export const getCompanyById = async (companyId: number): Promise<Company | null> => {
  const result = await pool.query('SELECT * FROM companies WHERE id=$1', [companyId]);
  return result.rows[0] ?? null;
};

// Créer une nouvelle entreprise
export const createCompany = async (company: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<Company> => {
  const { name, email, phone_number, website, industry } = company;
  const result = await pool.query(
    `INSERT INTO companies (name, email, phone_number, website, industry)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, phone_number, website, industry]
  );
  return result.rows[0];
};
