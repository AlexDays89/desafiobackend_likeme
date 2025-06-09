import express from 'express';
import cors from 'cors';
import pool from './db/config.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`El servidor está corriendo en el puerto ${PORT}`);
});

app.get("/posts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts");
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener los posts" });
  }
});

app.post("/posts", async (req, res) => {
  try {
    const { titulo, url, descripcion} = req.body;
    const result = await pool.query(
      "INSERT INTO posts (titulo, img, descripcion) VALUES ($1, $2, $3) RETURNING *",
      [titulo, url, descripcion]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al crear el post" });
  }
});

