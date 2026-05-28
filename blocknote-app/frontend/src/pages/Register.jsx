import { useState } from "react";
import { api } from "../api";

export default function Register({ onSuccess, onSwitch }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.register(form);
      onSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="auth-form"
      data-testid="register-form"
    >
      {error && (
        <p className="form-error" data-testid="register-error">
          {error}
        </p>
      )}

      <div className="form-group">
        <label htmlFor="reg-username">Username</label>
        <input
          id="reg-username"
          data-testid="register-username"
          type="text"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          placeholder="johndoe"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="reg-email">Email</label>
        <input
          id="reg-email"
          data-testid="register-email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="reg-password">Password</label>
        <input
          id="reg-password"
          data-testid="register-password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="min. 6 characters"
          required
          minLength={6}
        />
      </div>

      <button
        type="submit"
        className="btn-primary"
        disabled={loading}
        data-testid="register-submit"
      >
        {loading ? "Creating account…" : "create account"}
      </button>

      <p className="switch-link">
        Already have an account?{" "}
        <button
          type="button"
          className="link-btn"
          onClick={onSwitch}
          data-testid="go-login"
        >
          Login
        </button>
      </p>
    </form>
  );
}
