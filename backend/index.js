import express from 'express';
import cors from 'cors';
import pool from './db/config.js';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
dotenv.config();
const swaggerDocument = YAML.load('./swagger.yaml');

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`El servidor está corriendo en el puerto ${PORT}`);
});

app.get("/posts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts ORDER BY likes DESC");
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

app.put("/posts/likes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *",
      [id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al dar like" });
  }
});

app.delete("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM posts WHERE id = $1 RETURNING *",
      [id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al eliminar el post" });
  }
});
