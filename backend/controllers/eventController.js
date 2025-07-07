import postgresClient from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getEvents = async (req, res) => {
    try {
        const result = await postgresClient.query("SELECT * FROM events");
        res.status(200).json({
            message: "Etkinlikler başarıyla getirildi.",
            data: result.rows
        });
    } catch (error) {
        res.status(500).json({ message: "Sunucu hatası" });
    }
}

export const getEventById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await postgresClient.query("SELECT * FROM events WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Etkinlik bulunamadı." });
        }

        res.status(200).json({
            message: "Etkinlik başarıyla getirildi.",
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ message: "Sunucu hatası" });
    }

}

export const createEvent = async (req, res) => {
    const { title, description, location } = req.body;

    if (!title || !description || !location) {
        return res.status(400).json({ message: "Lütfen tüm alanları doldurun." });
    }
    try {
        const result = await postgresClient.query(
            "INSERT INTO events (title, description, date, location, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [title, description, location, req.user.id]
        );

        res.status(201).json({
            message: "Etkinlik başarıyla oluşturuldu.",
            data: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ message: "Sunucu hatası" });
    }

}

export const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { title, description, location } = req.body;

    if (!title || !description || !location) {
        return res.status(400).json({ message: "Lütfen tüm alanları doldurun." });
    }

    try {
        const result = await postgresClient.query(
            "UPDATE events SET title = $1, description = $2, location = $3 WHERE id = $4 RETURNING *",
            [title, description, location, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Etkinlik bulunamadı." });
        }

        res.status(200).json({
            message: "Etkinlik başarıyla güncellendi.",
            data: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ message: "Sunucu hatası" });
    }

}

export const deleteEvent = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await postgresClient.query("DELETE FROM events WHERE id = $1 RETURNING *", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Etkinlik bulunamadı." });
        }

        res.status(200).json({
            message: "Etkinlik başarıyla silindi.",
            data: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ message: "Sunucu hatası" });
    }

}