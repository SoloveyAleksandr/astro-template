import VenoBox from "venobox/dist/venobox";

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

    this.btn && this.btn.classList.add("placeholder");

    this.items.forEach((item) => {
      const input = item.querySelector<HTMLInputElement>("input[type='radio']");
      const text = item.querySelector<HTMLElement>("[data-text]");

      if (input && text) {
        input.addEventListener(
          "change",
          this.selectHandler.bind(this, item, text.textContent),
        );

        if (input.checked) {
          item.classList.add("selected");
          if (this.btn && this.btnText) {
            this.btnText.textContent = text.textContent;
            this.btn.classList.remove("placeholder");
          }
        }
      }
    });
  }

  selectHandler(item: HTMLElement | null, text: string | null) {
    this.items.forEach((el) => {
      if (el === item) {
        el.classList.add("selected");
        if (this.btn && this.btnText && text) {
          this.btnText.textContent = text;
          this.btn.classList.remove("placeholder");
        }
      } else {
        el.classList.remove("selected");
      }
    });
    this.close();
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

export class Popup {
  container: HTMLElement;
  key: string;
  controller: PopupController;

  constructor(
    container: HTMLElement,
    key: string,
    controller: PopupController,
  ) {
    this.container = container;
    this.key = key;
    this.controller = controller;

    const closeBtns =
      this.container.querySelectorAll<HTMLElement>("[data-close-popup]");
    closeBtns.forEach((item) => {
      item.addEventListener("click", () => this.controller.close(this.key));
    });
  }

  open() {
    this.container.classList.add("_open");
  }

  close() {
    this.container.classList.remove("_open");
  }
}

export class PopupController {
  readonly popupMap: {
    [key: string]: Popup;
  };
  private currentOpen: null | Popup;

  constructor() {
    this.popupMap = {};
    this.currentOpen = null;

    const popupList = document.querySelectorAll<HTMLElement>("[data-popup]");
    popupList.forEach((container) => {
      const key = container.getAttribute("data-popup");

      if (key) {
        this.popupMap[key] = new Popup(container, key, this);
      }
    });

    const openBtns =
      document.querySelectorAll<HTMLElement>("[data-open-popup]");

    openBtns.forEach((btn) => {
      const key = btn.getAttribute("data-open-popup");

      key && btn.addEventListener("click", this.open.bind(this, key));
    });
  }

  open(key: string) {
    this.currentOpen && this.currentOpen.close();

    if (this.popupMap[key]) {
      document.body.classList.add("_hidden");
      this.popupMap[key].open();
      this.currentOpen = this.popupMap[key];
    } else {
      throw new Error(
        "Проверьте правильность ключа и/или наличие popup на странице",
      );
    }
  }

  close(key: string) {
    document.body.classList.remove("_hidden");
    this.popupMap[key] && this.popupMap[key].close();
    this.currentOpen && this.currentOpen.close();
    this.currentOpen = null;
  }
}

export const initVBox = () => {
  const vboxOptions = {
    // selector: "[data-venobox]",
    overlayColor: "#15151580",
    bgcolor: null,
    // maxWidth: "1045px",

    // is called after new content loaded
    onContentLoaded: (newcontent: Element): void => {
      // formValidateInit(".vbox-content .fv");
    },
  };

  let vBox = new VenoBox(vboxOptions);

  (window as any).vBox = vBox;

  document.addEventListener("click", (e) => {
    const dataAction = "data-action";
    const eTarget = (e.target as HTMLElement).closest(`[${dataAction}]`);
    const activeClass = "_active";

    const vBoxLink = (e.target as HTMLElement).closest("[data-venobox]");
    if (vBoxLink) {
      const href = vBoxLink.getAttribute("href");

      if (href) {
        e.preventDefault();
        if (!(vBoxLink as any).settings) {
          (vBoxLink as any).settings = vBox.settings;
        }
        vBox.close();
        setTimeout(() => {
          vBox.open(vBoxLink);
        }, 300);
      }
    }
  });
};

export const initSelectInputs = (wrapperSelector?: string) => {
  const list = document.querySelectorAll<HTMLElement>(
    `${wrapperSelector || ""} [data-select]`,
  );
  list.forEach((container) => new Select(container));
};

export const initDropdownItems = (wrapperSelector?: string) => {
  const list = document.querySelectorAll<HTMLElement>(
    `${wrapperSelector || ""} [data-dropdown]`,
  );
  list.forEach((container) => new Dropdown(container));
};

export const initTooltipItems = (wrapperSelector?: string) => {
  const list = document.querySelectorAll<HTMLElement>(
    `${wrapperSelector || ""} [data-tooltip]`,
  );
  list.forEach((container) => new Tooltip(container));
};
