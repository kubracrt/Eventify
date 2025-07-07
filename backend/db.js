import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const postgresClient = new Pool({
  connectionString: process.env.DB,
});

export default postgresClient;
