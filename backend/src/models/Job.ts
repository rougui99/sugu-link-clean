export interface Job {
  id?: number;            // JobId → id
  company_id: number;     // CompanyId → company_id
  title: string;          // Title → title
  description: string;    // Description → description
  location: string;       // Location → location
  salary?: number;        // Salary → salary
  created_at?: Date;      // CreatedAt → created_at
  updated_at?: Date;      // UpdatedAt → updated_at
}
