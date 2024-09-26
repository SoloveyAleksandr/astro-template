import { Dropdown } from "./dropdown";

export class Select extends Dropdown {
  items: NodeListOf<HTMLElement>;
  btnText: HTMLElement | null;
  changeEvent = new Event("change", { bubbles: true });
  input: HTMLInputElement;

  constructor(container: HTMLElement) {
    super(container);
    this.btnText = this.container.querySelector<HTMLElement>("[data-btn-text]");
    this.items = this.container.querySelectorAll<HTMLElement>("[data-item]");

    const input =
      this.container.querySelector<HTMLInputElement>("[data-input]");
    if (input) {
      this.input = input;
    } else {
      const input = document.createElement("input");
      input.type = "text";
      input.hidden = true;
      this.input = input;
    }

    this.btn && this.btn.classList.add("_placeholder");

    this.items.forEach((item) => {
      const input = item.querySelector<HTMLInputElement>("input[type='radio']");
      const text = item.querySelector<HTMLElement>("[data-text]");

      if (input && text) {
        input.addEventListener(
          "change",
          this.selectHandler.bind(this, item, input, text.textContent),
        );

        if (input.checked) {
          this.selectHandler(item, input, text.textContent);
        }
      }
    });
  }

  selectHandler(
    item: HTMLElement | null,
    input: HTMLInputElement,
    text: string | null,
  ) {
    this.items.forEach((el) => {
      if (el === item) {
        el.classList.add("_selected");
        if (this.btn && this.btnText && text) {
          this.btnText.textContent = text;
          this.btn.classList.remove("_placeholder");
        }
        this.input.value = input.value;
        this.input.dispatchEvent(this.changeEvent);
      } else {
        el.classList.remove("_selected");
      }
    });
    this.close();
  }
}

export const initSelectItems = (wrapperSelector?: string) => {
  const list = document.querySelectorAll<HTMLElement>(
    `${wrapperSelector || ""} [data-select]`,
  );
  list.forEach((container) => new Select(container));
};
