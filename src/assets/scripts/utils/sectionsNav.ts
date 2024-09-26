interface INavItem {
  link: HTMLElement;
  block: HTMLElement;
}

class SectionsNav {
  observer: IntersectionObserver;
  items: Map<string, INavItem> = new Map();

  constructor(public wrapper: HTMLElement) {
    this.observer = new IntersectionObserver(this.observeHandler.bind(this));

    wrapper
      .querySelectorAll<HTMLLinkElement>("a[data-nav-link]")
      .forEach((link) => {
        const href = link.getAttribute("href");
        const id = href && href.split("#").join("");
        const block =
          href && id && this.wrapper.querySelector<HTMLElement>(href);

        if (block) {
          this.items.set(id, {
            link,
            block,
          });
          this.observer.observe(block);
        }
      });
  }

  observeHandler() {
    let activeKey = null;

    let minY = Infinity;

    this.items.forEach((item, key) => {
      const rect = item.block.getBoundingClientRect();
      const posY = rect.y + rect.height;
      if (posY >= 0 && posY < minY) {
        minY = posY;
        activeKey = key;
      }
    });

    this.setActive(activeKey);
  }

  setActive(activeKey: string | null) {
    this.items.forEach((item, key) => {
      if (activeKey === key) {
        item.link.classList.add("_active");
        item.block.classList.add("_active");
      } else {
        item.link.classList.remove("_active");
        item.block.classList.remove("_active");
      }
    });
  }
}

export function initSectionsNav() {
  document
    .querySelectorAll<HTMLElement>("[data-sections-nav]")
    .forEach((container) => {
      new SectionsNav(container);
    });
}
