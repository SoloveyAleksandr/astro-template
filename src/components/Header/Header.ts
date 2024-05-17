export function menuHandler(target: HTMLElement) {
  if (target.closest("[data-menu-btn]")) {
    document.body.classList.toggle("_open-menu");
  }
}
