import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    location: "",
    stage: "",
    message: "",
    start: "",
    end: ""
  });

  const [updates, setUpdates] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post("http://localhost:4000/api/updates", form, {
         headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`
  }

      });
      toast.success("Update posted!");
      setForm({ location: "", stage: "", message: "", start: "", end: "" });
      fetchUpdates();
    } catch (err) {
      toast.error("Failed to post update.");
    }
  };

  const fetchUpdates = async () => {
    const res = await axios.get("http://localhost:4000/api/updates");
    setUpdates(res.data);
  };
  
  // Check if user is admin
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      navigate("/"); // redirect non-admins
    }
  }, [navigate]);

  useEffect(() => {
    fetchUpdates();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Admin: Post Loadshedding Update</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="location"
          placeholder="Area name"
          value={form.location}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="stage"
          placeholder="Stage"
          value={form.stage}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="message"
          placeholder="Message"
          value={form.message}
          onChange={handleChange}
        />
        <input
          type="datetime-local"
          name="start"
          value={form.start}
          onChange={handleChange}
          required
        />
        <input
          type="datetime-local"
          name="end"
          value={form.end}
          onChange={handleChange}
          required
        />
        <button type="submit">Post Update</button>
      </form>

      <hr />

      <h3>Recent Updates</h3>
      <ul>
        {updates.map((u) => (
          <li key={u._id}>
            <strong>{u.location}</strong> - Stage {u.stage} <br />
            {u.message} <br />
            {new Date(u.start).toLocaleString()} → {new Date(u.end).toLocaleString()}
          </li>
        ))}
      </ul>

      <ToastContainer />
    </div>
  );
};

export default AdminPanel;
