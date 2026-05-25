import { useState, useEffect } from 'react';
import { api } from '../api';

export default function Notes({ user, onLogout }) {
  const [notes, setNotes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ title: '', content: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    try {
      const data = await api.getNotes();
      setNotes(data);
    } catch (err) {
      setError(err.message);
    }
  }

  function openNew() {
    setSelected(null);
    setForm({ title: '', content: '' });
    setShowForm(true);
    setError('');
  }

  function openEdit(note) {
    setSelected(note);
    setForm({ title: note.title, content: note.content });
    setShowForm(true);
    setError('');
  }

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (selected) {
        const updated = await api.updateNote(selected.id, form);
        setNotes(notes.map((n) => (n.id === updated.id ? updated : n)));
      } else {
        const created = await api.createNote(form);
        setNotes([created, ...notes]);
      }
      setShowForm(false);
      setSelected(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteNote(id);
      setNotes(notes.filter((n) => n.id !== id));
      if (selected?.id === id) {
        setShowForm(false);
        setSelected(null);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="notes-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>BlockNote</h2>
          <span className="username" data-testid="username-display">{user?.username}</span>
        </div>

        <button className="btn-primary new-note-btn" onClick={openNew} data-testid="new-note-btn">
          + New Note
        </button>

        <ul className="note-list">
          {notes.length === 0 && (
            <li className="empty-hint">No notes yet. Create one!</li>
          )}
          {notes.map((note) => (
            <li
              key={note.id}
              className={`note-item ${selected?.id === note.id ? 'active' : ''}`}
              data-testid="note-item"
            >
              <button className="note-title-btn" onClick={() => openEdit(note)}>
                {note.title}
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(note.id)}
                data-testid="delete-note-btn"
                title="Delete note"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        <button className="logout-btn" onClick={onLogout} data-testid="logout-btn">
          Logout
        </button>
      </aside>

      <main className="note-editor">
        {showForm ? (
          <form onSubmit={handleSave} data-testid="note-form">
            <div className="editor-header">
              <input
                className="note-title-input"
                data-testid="note-title"
                type="text"
                placeholder="Note title…"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <div className="editor-actions">
                <button type="submit" className="btn-primary" disabled={saving} data-testid="save-note-btn">
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowForm(false)}
                  data-testid="cancel-note-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
            {error && <p className="form-error" data-testid="note-error">{error}</p>}
            <textarea
              className="note-content"
              data-testid="note-content"
              placeholder="Write your note here…"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
          </form>
        ) : (
          <div className="empty-editor" data-testid="empty-editor">
            <p>Select a note or create a new one</p>
          </div>
        )}
      </main>
    </div>
  );
}
