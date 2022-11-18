const express = require("express");
const app = express();
const conn = require("./db");
const path = require("path");

app.use(express.json());

app.use("/static", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
	return res.sendFile(path.join(__dirname + '/public/' + 'index.html'));
})

app.get("/posts", (req, res) => {
  const query ="SELECT posts.id, title, url, score, owners.name FROM posts JOIN owners ON posts.owner_Id = owners.id ORDER BY score DESC";
  conn.query(query, (err, rows) => {
    if (err) res.status(500).send({ err });
    res.send(rows);
  });
});

app.post("/posts", (req, res) => {
  const newPost = req.body;

  const query = `INSERT INTO posts (title, url, owner_Id) VALUES (?, ?, ?)`;

  const params = [newPost.title, newPost.url, newPost.owner_Id];

  conn.query(query, params, (err, result) => {
    if (err) return res.status(500).send({ err });

    const query2 = `SELECT posts.id, title, url, owners.name FROM posts JOIN owners ON posts.owner_Id = owners.id WHERE posts.id = ${result.insertId}`;

    conn.query(query2, (err, row) => {
			if (err) return res.status(500).send({ err });
      res.status(201).send(row[0]);
    });
  });
});

app.put("/:id/upvote", (req, res) => {
  const id = Number(req.params.id);
  const userId = Number(req.body.user_id);

  const query0 = `SELECT * FROM votes WHERE owner_Id = ? AND post_Id = ?`;
  const params = [userId, id];
  conn.query(query0, params, (err, result) => {
    if (err){
			console.log(err);
			return res.status(500).send({ err });	
		} 

    if (result.length != 0) {
      return res.status(400).send({ error: "Already voted" });
    } else {
      const query = `UPDATE posts SET score = score + 1 WHERE id = ?`;
      const params = [id];
      conn.query(query, params, (err, result) => {
        if (err) return res.status(500).send({ err });
        if (result.affectedRows === 0)
          return res.status(404).send({ message: "Not Found OMG" });

        const query2 = `INSERT INTO votes (owner_Id, post_Id, vote) VALUES (?, ?, ?)`;

        const params = [userId, id, 1];
        conn.query(query2, params, (err, result) => {
          if (err) return res.status(500).send({ err });
        });

        const query3 = `SELECT * FROM posts WHERE id = ${id}`;
        conn.query(query3, (err, row) => {
          if (err) return res.status(500).send({ err });
          res.status(200).send(row[0]);
        });
      });
    }
  });
});

app.put("/:id/downvote", (req, res) => {
  const id = Number(req.params.id);
  const userId = Number(req.body.user_id);

  const query0 = `SELECT * FROM votes WHERE owner_Id = ? AND post_Id = ?`;
  const params = [userId, id];
  conn.query(query0, params, (err, result) => {
		if (err) return res.status(500).send({ err });
    if (result.length != 0) {
      return res.status(400).send({ error: "Already voted" });
    } else {
      const query = `UPDATE posts SET score = score - 1 WHERE id = ?`;
      const params = [id];
      conn.query(query, params, (err, result) => {
        if (err) {
          console.error(err);
          if (err) return res.status(500).send({ err });
          return;
        }

        if (result.affectedRows === 0) {
          res.status(404).send({ message: "Not Found" });
          return;
        }

        const query3 = `INSERT INTO votes (owner_Id, post_Id, vote) VALUES (?, ?, ?)`;

        const params = [userId, id, -1];

        conn.query(query3, params, (err, result) => {
          if (err) return res.status(500).send({ err });             
        });

        const query2 = `SELECT * FROM posts WHERE id = ${id}`;

        conn.query(query2, (err, row) => {
        	if (err) return res.status(500).send({ err });
          res.status(200).send(row[0]);
        });
      });
    }
  });
});

app.delete("/posts/:id", (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.status(404).send({ message: "Not Found" });
    return;
  }

  const query = "DELETE FROM posts WHERE id = ?";
  const params = [id];
  conn.query(query, params, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: "Database Error" });
      return;
    }
    res.status(200).send();
  });
});

app.put("/posts/:id", (req, res) => {
  const id = Number(req.params.id);
  const updatePost = req.body;

  const query = `
    UPDATE posts
    SET title = ?, url = ?
		WHERE id = ?
  `;
  const params = [updatePost.title, updatePost.url, id];

  conn.query(query, params, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: "Database Error" });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).send({ message: "Not Found" });
      return;
    }

    const query2 = `SELECT * FROM posts WHERE id = ${id}`;

    conn.query(query2, (err, row) => {
      if (err) {
        console.error(err);
        res.status(500).send({ message: "Database Error" });
        return;
      }
      res.status(200).send(row[0]);
    });
  });
});


module.exports = app;
