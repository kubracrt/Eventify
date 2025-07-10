import pool from './db.js';
const createUserTables = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL
            )
        `);

        console.log("Users tablosu oluşturuldu.");

    } catch (error) {
        console.log("Tablolar Oluşturulamadı:", error);
    }
}

const createEventTables = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS events(
                id SERIAL PRIMARY KEY,
                title VARCHAR(100) NOT NULL,
                description TEXT NOT NULL,
                date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                location VARCHAR(100) NOT NULL,
                user_id INTEGER REFERENCES users(id)
            )
        `);

        console.log("Events tablosu oluşturuldu.");

    } catch (error) {
        console.log("Tablolar Oluşturulamadı:", error);
    }

}

createUserTables();
createEventTables();