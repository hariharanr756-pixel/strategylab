import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const login = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(auth, email, password);

      alert("Login Successful");

      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}></div>

      <div style={styles.card}>
        <div style={styles.logoContainer}>
          <div style={styles.logo}>S</div>
        </div>

        <h1 style={styles.title}>StrategyLab</h1>
        <p style={styles.subtitle}>
          AI Powered Dashboard Login
        </p>

        <div style={styles.inputContainer}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </div>

        <button
          onClick={login}
          style={styles.button}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div style={styles.bottomText}>
          Secure Authentication with Firebase
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg, #0f172a, #1e3a8a, #7c3aed)",
    position: "relative",
    overflow: "hidden",
    fontFamily: "Arial, sans-serif",
  },

  overlay: {
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.08)",
    filter: "blur(80px)",
  },

  card: {
    position: "relative",
    zIndex: 2,
    width: "380px",
    padding: "40px",
    borderRadius: "28px",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
    textAlign: "center",
    color: "white",
  },

  logoContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },

  logo: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    background: "linear-gradient(135deg,#22c55e,#06b6d4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: "bold",
    color: "white",
    boxShadow: "0 0 20px rgba(34,197,94,0.6)",
  },

  title: {
    fontSize: "34px",
    marginBottom: "8px",
    fontWeight: "bold",
  },

  subtitle: {
    color: "#cbd5e1",
    marginBottom: "30px",
    fontSize: "15px",
  },

  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  input: {
    padding: "15px",
    borderRadius: "14px",
    border: "none",
    outline: "none",
    background: "rgba(255,255,255,0.12)",
    color: "white",
    fontSize: "15px",
  },

  button: {
    width: "100%",
    padding: "15px",
    marginTop: "28px",
    border: "none",
    borderRadius: "14px",
    background: "linear-gradient(135deg,#22c55e,#06b6d4)",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
    boxShadow: "0 6px 20px rgba(6,182,212,0.4)",
  },

  bottomText: {
    marginTop: "20px",
    color: "#cbd5e1",
    fontSize: "13px",
  },
};