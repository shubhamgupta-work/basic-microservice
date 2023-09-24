const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

const commentsByPostId = {};
//commentsByPostId = {"idOfPost": [{id:idOfComment, content:contentOfComment}], ...}

app.get("/posts/:id/comments", async (req, res) => {
  const { id } = req.params;
  const comments = commentsByPostId[id] || [];
  res.send(comments);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;
  const { id: postId } = req.params;

  const comments = commentsByPostId[postId] || [];
  comments.push({ id: commentId, content, status: "pending" });
  commentsByPostId[postId] = comments;

  await axios.post("http://event-bus-srv:4005/events", {
    type: "CommentCreated",
    data: { postId, id: commentId, content, status: "pending" },
  });

  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  try {
    const { type, data } = req.body;
    console.log("Event Received:", type);

    if (type === "CommentModerated") {
      const { id, postId, content, status } = data;
      const comments = commentsByPostId[postId];
      const comment = comments.find((comment) => comment.id === id);
      comment.status = status;

      await axios.post("http://event-bus-srv:4005/events", {
        type: "CommentUpdated",
        data: { id, postId, status, content },
      });
    }

    res.send({});
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(4001, () => {
  console.log("Listening on port 4001");
});
