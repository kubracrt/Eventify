import postgresClient from "../db.js";


export const getEvents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const countResult = await postgresClient.query(
            "SELECT COUNT(*) FROM events"
        );
        const totalEvents = parseInt(countResult.rows[0].count);

        const eventsResult = await postgresClient.query(
            "SELECT * FROM events ORDER BY date DESC LIMIT $1 OFFSET $2",
            [limit, offset]
        );

        const totalPages = Math.ceil(totalEvents / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        res.status(200).json({
            success: true,
            data: eventsResult.rows,
            pagination: {
                currentPage: page,
                totalPages,
                totalEvents,
                limit,
                hasNextPage,
                hasPrevPage,
                nextPage: hasNextPage ? page + 1 : null,
                prevPage: hasPrevPage ? page - 1 : null
            }
        });
    } catch (error) {
        console.error("Events getirilirken hata:", error);
        res.status(500).json({
            success: false,
            message: "Sunucu hatası"
        });
    }
};


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
    const { title, description, location, date, user_id } = req.body;

    if (!title || !description || !location || !date || !user_id) {
        return res.status(400).json({ message: "Lütfen tüm alanları doldurun." });
    }
    try {
        const result = await postgresClient.query(
            "INSERT INTO events (title, description, date, location, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [title, description, date, location, user_id]
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

export const getEventByUserId = async (req, res) => {
    const { user_id } = req.params;
    try {
        const result = await postgresClient.query("SELECT * FROM events WHERE user_id = $1", [user_id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Kullanıcıya ait etkinlik bulunamadı." });
        }
        res.status(200).json({
            message: "Kullanıcıya ait etkinlikler başarıyla getirildi.",
            data: result.rows
        });

    } catch (error) {
        console.error("Etkinlikler kullanıcıya göre getirilirken hata:", error);
        res.status(500).json({
            success: false,
            message: "Sunucu hatası"
        });
    }

}