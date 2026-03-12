export interface Company {
  id?: number;           // CompanyId → id
  name: string;          // Name → name
  email: string;         // Email → email
  phone_number: string;  // PhoneNumber → phone_number
  website?: string;      // Website → website
  industry: string;      // Industry → industry
  created_at?: Date;     // CreatedAt → created_at
  updated_at?: Date;     // UpdatedAt → updated_at
  verified?: boolean;    // Verified → verified (contenu local)
}
