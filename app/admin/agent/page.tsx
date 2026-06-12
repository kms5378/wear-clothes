export default function AdminAgentPage() {
  return (
    <main className="page-shell">
      <p className="eyebrow">Admin Agent</p>
      <h1>Agent proposals</h1>
      <section className="agent-layout">
        <form className="panel agent-form">
          <label>
            Admin instruction
            <textarea
              aria-label="Admin instruction"
              defaultValue="Feature the wool coat in the hero and publish the product."
              rows={5}
            />
          </label>
          <button className="button" type="button">
            Create proposal
          </button>
        </form>
        <aside className="panel proposal-preview">
          <p className="eyebrow">Pending proposal</p>
          <h2>Homepage and product update</h2>
          <p>Approval required: approval is required before publishing. The agent stores JSON changes first.</p>
          <pre>{`{"status":"pending","changes":["products","home_sections"]}`}</pre>
          <button className="button secondary" type="button">
            Approve proposal
          </button>
        </aside>
      </section>
    </main>
  );
}
