import postgresClient from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Lütfen tüm alanları doldurun." });
  }

  try {
    const existingUser = await postgresClient.query(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "Kullanıcı zaten mevcut." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await postgresClient.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hashedPassword]
    );

    return res.status(201).json({
      message: "Kullanıcı kaydı başarılı.",
      user: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Lütfen tüm alanları doldurun." });
  }

  try {
    const user = await postgresClient.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    const match = await bcrypt.compare(password, user.rows[0].password);
    if (!match) {
      return res.status(401).json({ message: "Şifre hatalı." });
    }

    const token = jwt.sign(
      { id: user.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Giriş başarılı",
      token,
      userId: user.rows[0].id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};
