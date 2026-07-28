(() => {
  const state = { query: "", modes: {} };
  const normalize = (value) => value.toLowerCase().trim();
  const sideFromHash = () => window.location.hash === "#carta-targets" ? "target" : "source";
  const setSide = (side, scrollToPanel = false) => {
    document.querySelectorAll("[data-side-panel]").forEach((panel) => { const active = panel.dataset.sidePanel === side; panel.hidden = !active; panel.setAttribute("aria-hidden", String(!active)); });
    document.querySelectorAll("[data-side-tab]").forEach((button) => { const active = button.dataset.sideTab === side; button.classList.toggle("is-active", active); button.setAttribute("aria-selected", String(active)); });
    if (scrollToPanel) { const panel = document.querySelector(`[data-side-panel="${side}"]`); panel?.scrollIntoView({ behavior: "auto", block: "start" }); }
  };
  const apply = () => {
    const query = normalize(state.query);
    document.querySelectorAll("[data-directory]").forEach((directory) => {
      const group = directory.dataset.directory || "";
      const mode = state.modes[group] || "all";
      directory.querySelectorAll("[data-card]").forEach((card) => {
        const matchesQuery = !query || normalize(card.dataset.search || "").includes(query);
        const matchesMode = mode === "all" || card.dataset.status === mode;
        card.hidden = !(matchesQuery && matchesMode);
      });
    });
  };
  document.querySelectorAll("[data-filter-input]").forEach((input) => {
    input.addEventListener("input", (event) => { state.query = event.target.value; apply(); });
  });
  document.querySelectorAll("[data-filter-group]").forEach((group) => {
    const name = group.dataset.filterGroup || "";
    state.modes[name] = "all";
    group.querySelectorAll("[data-filter-button]").forEach((button) => {
      button.addEventListener("click", () => {
        state.modes[name] = button.dataset.filterButton || "all";
        group.querySelectorAll("[data-filter-button]").forEach((item) => item.classList.toggle("is-active", item === button));
        apply();
      });
    });
  });
  document.querySelectorAll("[data-side-tab]").forEach((button) => {
    button.addEventListener("click", () => { const side = button.dataset.sideTab || "source"; history.replaceState(null, "", side === "target" ? "#carta-targets" : "#ocf-objects"); setSide(side, true); });
  });
  setSide(sideFromHash(), Boolean(window.location.hash));
  window.addEventListener("hashchange", () => setSide(sideFromHash(), true));
})();