import VenoBox from "venobox/dist/venobox";
import { formValidateInit } from "./fv";
import { initDropdownItems, initSelectInputs } from "./utils";

formValidateInit(".fv");
initDropdownItems();
initSelectInputs();

// const vOnContentLoaded = [
//   formValidateInit.bind(this, ".vbox-content .fv"),
//   initDropdownItems.bind(this, ".vbox-content"),
//   initSelectInputs.bind(this, ".vbox-content"),
// ];

const vboxOptions = {
  overlayColor: "rgba(22, 22, 22, 0.45)",
  bgcolor: null,
  spinner: "grid",
  onContentLoadedEvent: new Event("vBoxContentLoaded", { bubbles: true }),
  onContentLoaded: (): void => {
    // vOnContentLoaded.forEach((func) => func());
    console.log(this);
    // document.dispatchEvent(this.)
  },
  onPreOpen: (): void => {
    vBox.isOpen = true;
  },
  onPreClose: (): void => {
    vBox.isOpen = false;
  },
};

const vBox = new VenoBox(vboxOptions);

(window as any).vBox = vBox;
(window as any).openVBox = openVBox;

document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  const closePopup = target.closest("[data-vclose]");
  const vBoxLink = target.closest("[data-vbox]");

  if (vBoxLink) {
    e.preventDefault();

    if (!(vBoxLink as any).settings) {
      (vBoxLink as any).settings = vBox.settings;
    }
    if (vBox.isOpen) {
      vBox.close();
      setTimeout(() => {
        vBox.open(vBoxLink);
      }, 500);
    } else {
      vBox.open(vBoxLink);
    }
  }

  if (closePopup) {
    vBox.close();
  }
});

function openVBox(src: string, vbtype?: string) {
  const link = document.createElement("a");
  link.href = src;
  link.dataset.vbtype = vbtype ? vbtype : "ajax";
  (link as any).settings = vBox.settings;

  vBox.close();
  setTimeout(() => {
    vBox.open(link);
  }, 500);
}

// {
//   let id = 0;

//   window.addEventListener("resize", () => {
//     clearTimeout(id);

//     id = setTimeout(() => {
//       ScrollTrigger.update();
//     }, 100);
//   });
// }
