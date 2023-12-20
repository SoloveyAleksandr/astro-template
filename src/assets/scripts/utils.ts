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
  btn: any;
  controller: DropdownController;
  controllerID: string | null;
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
        const closestEl = (e.target as HTMLElement).closest(
          "[data-close]",
        );

        if (!closestEl || closestEl !== this.container) {
          this.close();
        }
      });
    }

    // data-open - открыт изначально
    if (this.container.hasAttribute("data-open")) {
      this.open();
    }

    // data-controller-id={id для группы} при открытии закрывает остальные
    this.controllerID = this.container.getAttribute("data-controller-id");
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

    // if (this.scrollTo) {
    this.scrollToStart();
    // }
  }

  close() {
    this.dropped = false;
    this.container.classList.remove("_dropped");
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

export class Select extends Dropdown {
  items: NodeListOf<HTMLElement>;
  btnText: HTMLElement | null;

  constructor(container: HTMLElement) {
    super(container);
    this.btnText =
      this.container.querySelector<HTMLElement>("[data-btn-text]");
    this.items = this.container.querySelectorAll<HTMLElement>("[data-item]");

    this.items.forEach((i) => {
      const input = i.querySelector<HTMLInputElement>("[data-input]");
      const text = i.querySelector<HTMLSpanElement>("[data-text]");

      if (input && text) {
        input.addEventListener("change", () => {
          this.inputHandler(text.innerHTML);
          this.close();
        });

        if (input.checked) {
          this.inputHandler(text.innerHTML);
          this.container.classList.remove("placeholder");
        }
      }
    });
  }

  inputHandler(text: string) {
    if (this.btnText) {
      this.btnText.textContent = text;
      this.container.classList.remove("placeholder");
    }
  }
}
