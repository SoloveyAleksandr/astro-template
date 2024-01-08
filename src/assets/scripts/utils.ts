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
        const closestEl = (e.target as HTMLElement).closest("[data-close]");

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
    this.btnText = this.container.querySelector<HTMLElement>("[data-btn-text]");
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

export class Tooltip {
  trigger: HTMLElement;
  container: HTMLElement | null;
  static: boolean;

  constructor(trigger: HTMLElement) {
    this.trigger = trigger;
    this.container = this.trigger.querySelector<HTMLElement>(
      "[data-tooltip-container]",
    );

    this.static = this.trigger.hasAttribute("data-static");

    if (this.trigger && this.container) {
      this.trigger.addEventListener("mouseenter", this.show.bind(this));
      this.trigger.addEventListener("mouseleave", this.hide.bind(this));
    }
  }

  show(e: MouseEvent) {
    if (this.container) {
      this.updateSize(e);
      this.container.classList.add("_active");
    }
  }

  hide() {
    if (this.container) {
      this.container.classList.remove("_active");
    }
  }

  resetSize() {
    if (this.container) {
      this.container.style.removeProperty("right");
      this.container.style.removeProperty("width");
    }
  }

  updateSize(e: MouseEvent) {
    if (this.container && !this.static) {
      let pos = this.container.getBoundingClientRect();

      this.container.style.setProperty("top", e.clientY - pos.height + "px");
      this.container.style.setProperty(
        "left",
        e.clientX - pos.width + 10 + "px",
      );

      pos = this.container.getBoundingClientRect();

      if (pos.left < 0) {
        this.container.style.setProperty("left", 5 + "px");
      }

      if (pos.width > window.innerWidth) {
        this.container.style.setProperty(
          "width",
          window.innerWidth - 10 + "px",
        );
      }
    }
  }
}

export class Toast {
  container: HTMLDivElement;
  list: HTMLDivElement;
  template: HTMLTemplateElement;

  constructor() {
    this.container = document.createElement("div");
    this.list = document.createElement("div");
    this.template = document.createElement("template");

    this.init();
  }

  private init() {
    this.container.className = "toast";

    this.template.innerHTML = `
      <div class="toast-item">
        <div class="toast-item__wrapper">
          <div class="toast-item__container">
            <div class="toast-item__inner">
              <span class="toast-item__title" data-title></span>
              <span class="toast-item__text" data-text></span>
            </div>
            <button type="button" class="toast-item__btn" data-btn>
              <svg astro-icon="menu-close">
                  <use xlink:href="#astroicon:menu-close"></use>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.container);

    (window as any).toast = this;
  }

  new(props: {
    title: string;
    text: string;
    color?: "red" | "greed";
    duration?: number;
    closeable?: boolean;
  }) {
    const toast = this.template.content.children[0].cloneNode(true);

    const title = (toast as HTMLElement).querySelector<HTMLElement>(
      "[data-title]",
    );
    const text = (toast as HTMLElement).querySelector<HTMLElement>(
      "[data-text]",
    );
    const btn = (toast as HTMLElement).querySelector<HTMLButtonElement>(
      "[data-btn]",
    );

    if (title && text && btn) {
      title.textContent = props.title;
      text.textContent = props.text;
      btn.addEventListener(
        "click",
        this.close.bind(this, toast as HTMLElement),
      );

      if (props.color) {
        (toast as HTMLElement).classList.add(props.color);
      }

      if (props.duration) {
        setTimeout(this.close.bind(this, toast as HTMLElement), props.duration);
      }

      if (props.closeable === false) {
        btn.remove();
      }

      this.container.appendChild(toast);
      (toast as HTMLElement).classList.add("toast-in");
    }
  }

  private close(item: HTMLElement) {
    item.addEventListener("animationend", () => {
      item.remove();
    });

    item.classList.add("toast-out");
  }
}
