import { initPasswordInputs } from "@components/TextInput/TextInput";
import { formValidateInit } from "./fv";
import { initFileInputs } from "@components/FileInput/FileInput";
import { Dropdown, PopupController, Select } from "./utils";

const dropdownItems = document.querySelectorAll<HTMLElement>("[data-dropdown]");
dropdownItems.forEach((container) => new Dropdown(container));

const selectItems = document.querySelectorAll<HTMLElement>("[data-select]");
selectItems.forEach((container) => new Select(container));

formValidateInit(".fv");
initPasswordInputs();
initFileInputs();

const popupController = new PopupController();
(window as any).popupController = popupController;

// {
//   let id = 0;

//   window.addEventListener("resize", () => {
//     clearTimeout(id);

//     id = setTimeout(() => {
//       ScrollTrigger.update();
//     }, 100);
//   });
// }
