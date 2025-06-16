import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const token = "your_token_value_here";

  const resgisterUser = async () => {
    const res = await fetch(`${import.meta.env.VITE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, password }),
    });

    if (res.status == 200) {
      navigate("/home");
    }
  };

  const loginUser = async () => {
    const res = await fetch(`${import.meta.env.VITE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, password }),
    })
      .then((res) => res.json()) // 👈 parse the body
      .then((data) => {
        console.log(data); // 👈 see your token here
        localStorage.setItem("token", data.token); // save it if needed

        if (data.message == "Login Succesful") {
          navigate("/home");
        }
      });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4">
      <section className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Welcome to J.T</h1>
        </header>

        <form className="flex flex-col gap-4">
          <fieldset className="flex flex-col">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email:
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </fieldset>

          <fieldset>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </fieldset>

          <fieldset>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password: 
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </fieldset>

          <footer className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
            <button
              type="button"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition duration-300"
              onClick={resgisterUser}
            >
              Create Account
            </button>
            <button
              type="button"
              className="w-full px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-xl shadow-md hover:bg-blue-50 transition duration-300"
              onClick={loginUser}
            >
              Log in
            </button>
          </footer>
        </form>
      </section>
    </main>
  );
}