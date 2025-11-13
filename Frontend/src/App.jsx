import { useState, useEffect } from "react";
import instance from "./axiosConfig.js";

function App() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isRegister, setIsRegister] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    async function fetchUser() {
      try {
        const res = await instance.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        setToken("");
      }
    }
    fetchUser();
  }, [token]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const res = await instance.post(endpoint, form);

      if (isRegister) {
        alert("Registered successfully! You can now log in.");
        setIsRegister(false);
      } else {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
      }

      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  }

  function updateRegister() {
    setIsRegister(!isRegister);
    setForm({ name: "", email: "", password: "" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          React + Node + MongoDB Auth App (AWS Cloud)
        </h1>

        {!token ? (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                {isRegister ? "Register" : "Login"}
              </button>
            </form>

            {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}

            <p className="text-center mt-4 text-gray-600">
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}
              <button
                onClick={updateRegister}
                className="text-blue-600 hover:underline ml-1"
              >
                {isRegister ? "Login here" : "Register here"}
              </button>
            </p>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Welcome, {user?.name}
            </h2>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                setToken("");
                setUser(null);
              }}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
