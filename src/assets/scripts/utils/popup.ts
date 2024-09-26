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
  }

  open() {
    const form = this.container.querySelector("form");
    if (form) {
      form.classList.remove("_sended");
      form.classList.remove("_send-error");
    }

    this.container.classList.add("_open");
  }

  close() {
    this.container.classList.remove("_open");

    this.container
      .querySelectorAll<HTMLVideoElement>("video")
      .forEach((video) => video.pause());
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

  clickHandler(e: Event, target: HTMLElement) {
    const open = target.closest("[data-open-popup]");
    const close = target.closest("[data-close-popup]");

    if (open || close) {
      e.preventDefault();
    }

    if (close && this.currentOpen) {
      this.close(this.currentOpen.key);
    }

    if (open) {
      const key = open.getAttribute("data-open-popup");

      key && this.open(key);
    }
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
