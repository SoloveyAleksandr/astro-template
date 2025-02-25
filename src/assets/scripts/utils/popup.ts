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
  popupMap: Map<string, Popup> = new Map();
  private currentOpen: null | Popup;

  constructor() {
    this.currentOpen = null;

    const popupList = document.querySelectorAll<HTMLElement>("[data-popup]");
    popupList.forEach((container) => {
      const key = container.getAttribute("data-popup");

      if (key) {
        this.popupMap.set(key, new Popup(container, key, this));
      }
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
      const keyAttr = open.getAttribute("data-open-popup");

      if (keyAttr) {
        this.open(keyAttr);
        return;
      }

      const keyHref = open.getAttribute("href");
      if (keyHref) {
        this.open(keyHref);
        return;
      }
    }
  }

  open(key: string) {
    this.currentOpen && this.currentOpen.close();

    const popup = this.popupMap.get(key);

    if (popup) {
      document.body.classList.add("_hidden");
      popup.open();
      this.currentOpen = popup;
    } else {
      throw new Error(
        "Проверьте правильность ключа и/или наличие popup на странице",
      );
    }
  }

  close(key: string) {
    document.body.classList.remove("_hidden");
    const popup = this.popupMap.get(key);

    popup && popup.close();
    this.currentOpen && this.currentOpen.close();
    this.currentOpen = null;
  }
}
