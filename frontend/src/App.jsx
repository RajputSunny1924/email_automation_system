import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [emails, setEmails] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchEmails = () => {
    fetch("http://localhost:8000/emails")
      .then((response) => response.json())
      .then((data) => {
        setEmails(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const processEmails = () => {
    setLoading(true);
    setMessage("");

    fetch("http://localhost:8000/process-emails", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(`${data.processed_count} email(s) processed successfully`);

        fetchEmails();
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessage("Something went wrong while processing emails.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const totalEmails = emails.length;

  const pendingEmails = emails.filter(
    (email) => email.status === "pending",
  ).length;

  const processedEmails = emails.filter(
    (email) => email.status === "processed",
  ).length;

  const errorEmails = emails.filter((email) => email.status === "error").length;

  const getCategoryClass = (category) => {
    if (category === "customer_support") return "support";
    if (category === "work") return "work";
    if (category === "personal") return "personal";
    if (category === "spam") return "spam";
    return "other";
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">AI</div>

          <div>
            <h2>AI Automation</h2>
            <span>Email Intelligence</span>
          </div>
        </div>

        <nav>
          <div className="nav-item active">
            <span>▦</span>
            Dashboard
          </div>

          <div className="nav-item">
            <span>✉</span>
            Emails
          </div>

          <div className="nav-item">
            <span>⚙</span>
            Automation
          </div>
        </nav>

        <div className="system-status">
          <span className="status-dot"></span>

          <div>
            <strong>System Active</strong>
            <small>Worker is running</small>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>Dashboard</h1>
            <p>Monitor and manage your AI-powered email automation.</p>
          </div>

          <button
            className="process-button"
            onClick={processEmails}
            disabled={loading}>
            {loading ? "Processing..." : "Process Pending Emails"}
          </button>
        </header>

        {message && <div className="message">{message}</div>}

        {/* Statistics */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">✉</div>
            <div>
              <span>Total Emails</span>
              <strong>{totalEmails}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending-icon">◷</div>
            <div>
              <span>Pending</span>
              <strong>{pendingEmails}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon processed-icon">✓</div>
            <div>
              <span>Processed</span>
              <strong>{processedEmails}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon error-icon">!</div>
            <div>
              <span>Errors</span>
              <strong>{errorEmails}</strong>
            </div>
          </div>
        </section>

        {/* Emails */}
        <section className="email-section">
          <div className="section-header">
            <div>
              <h2>Email Processing</h2>
              <p>AI classification and automation results</p>
            </div>

            <span className="email-count">{totalEmails} emails</span>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Category</th>
                  <th>AI Summary</th>
                  <th>Action</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {emails.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty">
                      No emails found.
                    </td>
                  </tr>
                ) : (
                  emails.map((email) => (
                    <tr key={email.id}>
                      <td>
                        <div className="email-text">{email.email}</div>
                      </td>

                      <td>
                        <span
                          className={`category ${getCategoryClass(
                            email.category,
                          )}`}>
                          {email.category || "—"}
                        </span>
                      </td>

                      <td>
                        <div className="summary">{email.summary || "—"}</div>
                      </td>

                      <td>
                        <span className="action">{email.action || "—"}</span>
                      </td>

                      <td>
                        <span className={`status ${email.status}`}>
                          {email.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
