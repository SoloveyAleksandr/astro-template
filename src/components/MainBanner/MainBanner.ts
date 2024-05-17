export function initMainBanner() {
  const container = document.querySelector<HTMLElement>("[data-mode]");
  const input =
    container && container.querySelector<HTMLInputElement>("[data-switch]");

  if (container && input) {
    if (input.checked) {
      container.setAttribute("data-mode", "dark");
    } else {
      container.setAttribute("data-mode", "light");
    }

    input.addEventListener("change", changeHandler);
  }

  function changeHandler() {
    if (container) {
      const mode = container.getAttribute("data-mode");

      if (mode && mode === "light") {
        container.setAttribute("data-mode", "dark");
      } else {
        container.setAttribute("data-mode", "light");
      }
    }
  }
}
