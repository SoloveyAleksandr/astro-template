import VenoBox from "venobox/dist/venobox";

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
