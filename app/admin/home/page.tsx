import { homeSections } from "@/lib/fixtures";

export default function AdminHomePage() {
  return (
    <main className="page-shell">
      <p className="eyebrow">Admin</p>
      <div className="section-heading">
        <div>
          <h1>Home management</h1>
          <h2>Home sections</h2>
        </div>
        <button className="button" type="button">
          Save section order
        </button>
      </div>
      <div className="admin-list">
        {homeSections.map((section) => (
          <article className="panel admin-row" key={section.id}>
            <div>
              <p className="eyebrow">{section.type === "hero" ? "Hero banner" : section.type}</p>
              <h2>{section.title}</h2>
              <p>{section.subtitle}</p>
            </div>
            <span>{section.active ? "Active" : "Hidden"}</span>
          </article>
        ))}
      </div>
    </main>
  );
}
