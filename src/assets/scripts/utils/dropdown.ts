export class DropdownController {
  slots: {
    [key: string]: Dropdown[];
  };

  constructor() {
    this.slots = {};
  }

  openHandler(target: Dropdown) {
    if (target.controllerID) {
      this.slots[target.controllerID].forEach((el) => {
        if (el !== target) {
          el.close();
        }
      });
    }
  }
}

const dropdownController = new DropdownController();

export class Dropdown {
  container: HTMLElement;
  dropped: boolean;
  btn: HTMLElement | null;
  controller: DropdownController;
  controllerID: string | null;
  className: null | string = null;
  // scrollTo: boolean;

  constructor(container: HTMLElement) {
    this.controller = dropdownController;

    this.container = container;
    this.dropped = false;

    // блок с data-dropdown-btn станет кнопкой
    this.btn = this.container.querySelector<HTMLElement>("[data-btn]");

    if (this.btn) {
      this.btn.addEventListener("click", this.dropStateHandler.bind(this));
    }

    // data-dropdown-close на контейнере будет закрыть при клике вне контейнера
    if (this.container.hasAttribute("data-close")) {
      document.addEventListener("click", (e) => {
        const closestEl = (e.target as HTMLElement).closest("[data-close]");

        if (!closestEl || closestEl !== this.container) {
          this.close();
        }
      });
    }

    // data-open - открыт изначально
    if (this.container.classList.contains("_dropped")) {
      this.open();
    }

    // data-controller-id={id для группы} при открытии закрывает остальные
    this.controllerID = this.container.getAttribute("data-group");
    if (this.controllerID !== null) {
      if (this.controller.slots[this.controllerID]) {
        this.controller.slots[this.controllerID].push(this);
      } else {
        this.controller.slots[this.controllerID] = [];
        this.controller.slots[this.controllerID].push(this);
      }
    }

    // data-scroll-to скрол до блока при открытии
    // this.scrollTo = this.container.hasAttribute("data-scroll-to");
    this.className = this.container.getAttribute("data-class");
  }

  dropStateHandler() {
    if (this.dropped) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.dropped = true;
    this.container.classList.add("_dropped");

    if (this.controller) {
      this.controller.openHandler(this);
    }

    if (this.className) {
      document.body.classList.add(this.className);
    }

    // if (this.scrollTo) {
    this.scrollToStart();
    // }
  }

  close() {
    this.dropped = false;
    this.container.classList.remove("_dropped");

    if (this.className) {
      document.body.classList.remove(this.className);
    }
  }

  scrollToStart() {
    if (window.matchMedia("(max-width: 768px)").matches) {
      setTimeout(() => {
        const rect = this.container.getBoundingClientRect();

        if (rect.top < 0) {
          window.scrollTo({
            top: window.scrollY + (rect.top - 60),
            behavior: "smooth",
          });
        }
      }, 500);
    }
  }
}

export const initDropdownItems = (wrapperSelector?: string) => {
  const list = document.querySelectorAll<HTMLElement>(
    `${wrapperSelector || ""} [data-dropdown]`,
  );
  list.forEach((container) => new Dropdown(container));
};
