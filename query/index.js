const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

const postWithComments = {};

// const sample_postsWithComments = {
//   nkh9s8y: {
//     id: "nkh9s8y",
//     title: "Post Title",
//     comments: [
//       {
//         id: "klhi87",
//         content: "Comment content",
//          status:"pending" , //new property
//       },
//     ],
//   },
// };

const handleEvent = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;
    postWithComments[id] = { id, title, comments: [] }; //add comments as [], for not getting null error while adding comments
  }

  if (type === "CommentCreated") {
    const { postId, id, content, status } = data;
    const post = postWithComments[postId];
    post.comments.push({ id, content, status });
  }

  if (type === "CommentUpdated") {
    const { postId, id, content, status } = data;
    const comments = postWithComments[postId].comments;
    const idx = comments.findIndex((comment) => comment.id === id);
    comments[idx] = { id, content, status };
  }
};

app.get("/posts", (req, res) => {
  res.send(postWithComments);
});

app.post("/events", (req, res) => {
  try {
    const { type, data } = req.body;
    handleEvent(type, data);

    res.send({});
  } catch (err) {
    console.log(err);
  }
});

app.listen(4002, async () => {
  console.log("Listening on port 4002");

  try {
    const res = await axios.get("http://event-bus-srv:4005/events");

    for (let event of res.data) {
      console.log("Processing Event:", event.type);
      handleEvent(event.type, event.data);
    }
  } catch (err) {
    console.log(err.message);
  }
});
