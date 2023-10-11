import { Counter } from "../../assets/scripts/utils";

export const counterComponent = () => {
  customElements.define("counter-element", Counter);
};
