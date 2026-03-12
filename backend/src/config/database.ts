// config/database.ts
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || undefined, // pas de mot de passe
  database: process.env.DB_NAME,
});

// Fonction pour vérifier la connexion
const connectDB = async (): Promise<Pool> => {
  try {
    await pool.connect();
    console.log("✅ PostgreSQL connected");
    return pool;
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
};

export { pool, connectDB };
