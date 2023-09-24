import { useState } from "react";
import axios from "axios";

const CommentCreate = ({ postId }) => {
  const [content, setContent] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://posts.com/posts/${postId}/comments`, {
        content,
      });
      setContent("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <form action="" onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="">New Comment</label>
          <input
            type="text"
            className="form-control"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button className="btn-primary btn" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CommentCreate;
