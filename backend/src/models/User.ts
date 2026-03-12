export interface User {
  id?: number;           // UserId → id
  first_name: string;    // FirstName → first_name
  last_name: string;     // LastName → last_name
  email: string;         // Email → email
  password?: string;     // Password hashé
  created_at?: Date;     // CreatedAt → created_at
  updated_at?: Date;     // UpdatedAt → updated_at
}
