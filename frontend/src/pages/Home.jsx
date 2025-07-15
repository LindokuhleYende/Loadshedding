import { useEffect, useState } from "react";
import { useNavigate ,Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const [area, setArea] = useState(""); // search input
  const [updates, setUpdates] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const isAdmin = localStorage.getItem("isAdmin") === "true";


  // Check login via cookie
  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/login");
      }
      const { data } = await axios.post(
        "http://localhost:4000",
        {},
        { withCredentials: true }
      );
      const { status, user } = data;
      setUsername(user);
      return status
        ? toast(`Hello ${user}`, { position: "top-right" })
        : (removeCookie("token"), navigate("/login"));
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);

  // Logout
  const Logout = () => {
    removeCookie("token");
    navigate("/signup");
  };

  // Fetch all updates once
  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/updates");
        setUpdates(res.data);
      } catch (err) {
        toast.error("Failed to load updates");
      }
    };
    fetchUpdates();
  }, []);

  // Handle search/filter
  const handleSearch = (e) => {
    e.preventDefault();
    const results = updates.filter((u) =>
      u.location.toLowerCase().includes(area.toLowerCase())
    );
    setFiltered(results);
  };

  return (
    <>
      <div className="home_page">
        <h4>
          Welcome <span>{username}</span>
        </h4>
        <button onClick={Logout}>LOGOUT</button>
        {/* Show admin panel link only if admin */}
        <h5>{isAdmin && <Link to="/admin">Admin Panel</Link>}</h5>

        <div>
          <h5>Power Outage Live Updates</h5>
          <h6>Search Your Area</h6>

          <form onSubmit={handleSearch}>
            <input
              type="search"
              name="area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="Enter area name"
            />
            <button type="submit">Search 🔍</button>
          </form>

          <div>
            <h5>Results for: {area}</h5>

            {filtered.length === 0 ? (
              <p>No updates found for this area.</p>
            ) : (
              <ul>
                {filtered.map((update) => (
                  <li key={update._id}>
                    <strong>{update.location}</strong> - Stage {update.stage}
                    <br />
                    {update.message}
                    <br />
                    {new Date(update.start).toLocaleString()} →{" "}
                    {new Date(update.end).toLocaleString()}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Home;
