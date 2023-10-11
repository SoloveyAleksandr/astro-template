export class Counter extends HTMLElement {
  count: number = 0;
  textContainer: HTMLElement | null;

  constructor() {
    super();

    this.textContainer = this.querySelector(".counter__count");
    const decBtn = this.querySelector(".counter__btn_dec");
    const incBtn = this.querySelector(".counter__btn_inc");

    decBtn?.addEventListener("click", this.decrement.bind(this));
    incBtn?.addEventListener("click", this.increase.bind(this));
  }

  decrement() {
    this.count--;
    this.render();
  }

  increase() {
    this.count++;
    this.render();
  }

  render() {
    this.textContainer &&
      (this.textContainer.textContent = this.count.toString());
  }
}
