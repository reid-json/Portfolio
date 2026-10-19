const libraryDomain = document.getElementById("library-domain");
modules.forEach((module) => {
  const option = node("option", "", module.title);
  option.value = module.id;
  libraryDomain.append(option);
});
function renderLibrary() {
  const query = document.getElementById("library-search").value.trim().toLowerCase();
  const domain = libraryDomain.value;
  const sources = referenceLibrary.filter((source) => (!domain || source.domains.includes(domain))
    && `${source.title} ${source.publisher} ${source.section} ${source.scope}`.toLowerCase().includes(query));
  const list = document.getElementById("library-list");
  list.replaceChildren();
  sources.forEach((source) => {
    const card = node("article", "panel resource-card");
    card.append(node("div", "kicker", `${source.publisher} · PRIMARY SOURCE`));
    const title = node("h2");
    const link = node("a", "", source.title);
    link.href = source.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    title.append(link);
    card.append(title, node("p", "", source.scope), node("p", "note", `Start here: ${source.section}`));
    card.append(node("p", "note", source.domains.map((id) => moduleById(id).short).join(" / ")));
    list.append(card);
  });
  document.getElementById("library-count").textContent = `${sources.length} of ${referenceLibrary.length} references`;
  if (!sources.length) list.append(node("p", "", "No matching references. Try another term or domain."));
}
document.getElementById("library-search").addEventListener("input", renderLibrary);
libraryDomain.addEventListener("change", renderLibrary);
renderLibrary();
