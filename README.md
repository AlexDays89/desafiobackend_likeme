Desafío 3 Backend DesafíoLatam
<br>
Documentación: API REST “Like Me” (Parte II)
<br>
Permitir la interacción de likes y la eliminación de posts en una red social, utilizando rutas PUT y DELETE en una API REST conectada a PostgreSQL, y capturando posibles errores en las consultas.
<br>
1. Estructura de la tabla en PostgreSQL
<br>
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(25),
  img VARCHAR(1000),
  descripcion VARCHAR(255),
  likes INT DEFAULT 0
);
<br>
Es importante que el campo likes tenga un valor por defecto de 0 para evitar problemas al incrementar.
<br>
2. Ruta PUT: Dar like a un post
<br>
Método: PUT
<br>
Endpoint: /posts/likes/:id
<br>
Funcionalidad: Incrementa en 1 el campo likes del post con el id especificado.
<br>

<p>
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
</p>

<br>
3. Ruta DELETE: Eliminar un post
<br>
Método: DELETE
<br>
Endpoint: /posts/:id
<br>
Funcionalidad: Elimina el post con el id especificado.


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

4. Manejo de errores en consultas SQL
Todas las rutas usan bloques try-catch para capturar y manejar errores, devolviendo un mensaje de error y un status HTTP 500 si ocurre algún problema con la base de datos.

5. Consumo desde el frontend (React)
Se utiliza axios para consumir las rutas PUT y DELETE.

const like = async (id) => {
  await axios.put(urlBaseServer + `/posts/likes/${id}`);
  getPosts();
};

const eliminarPost = async (id) => {
  await axios.delete(urlBaseServer + `/posts/${id}`);
  getPosts();
};

6. Puntos importantes
Si tengo un campo que es null y actualizo un conteo, nunca va a tomar la suma, por lo que tengo que crear un valor por defecto.
Usar RETURNING * en las consultas para devolver el registro modificado/eliminado.
Siempre manejar errores con try-catch, y poner mensajes útiles. Evitar llenarse de console.log.