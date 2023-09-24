import { useState } from "react";
import axios from "axios";

const PostCreate = () => {
  const [title, setTitle] = useState("");

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      await axios.post("http://posts.com/posts/create", { title });
      setTitle("");
    } catch (er) {
      console.log(er);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="form-control"
          />
        </div>
        <button className="btn-primary btn" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default PostCreate;
