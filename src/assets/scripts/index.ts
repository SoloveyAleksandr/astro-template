import { formValidateInit } from "./fv";
import Swiper from "swiper";
import {
  Navigation,
  Thumbs,
  EffectFade,
  Pagination,
  Autoplay,
  Scrollbar,
} from "swiper/modules";
import LazyLoad from "vanilla-lazyload";
import { vBoxHandler } from "./vBox";
import { PopupController } from "./utils/popup";
import { initDropdownItems } from "./utils/dropdown";
import { initSwipers } from "./utils/swiper";
import { initSelectItems } from "./utils/select";
import { initFileInputs } from "./utils/FileInput";
import { initSectionsNav } from "./utils/sectionsNav";

Swiper.use([Navigation, Thumbs, EffectFade, Pagination, Autoplay, Scrollbar]);

document.addEventListener("DOMContentLoaded", () => {
  const lazyLoad = new LazyLoad({
    elements_selector: ".lazy",
  });
  lazyLoad.update();

  const popupController = new PopupController();
  (window as any).popupController = popupController;

  // Инициализация компонентов и обработчиков
  // общие
  formValidateInit(".fv");
  initDropdownItems();
  initSelectItems();
  initSwipers();
  initFileInputs();
  initSectionsNav();

  // компоненты

  // <--

  // События
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    vBoxHandler(e, target);

    popupController.clickHandler(e, target);
  });

  document.addEventListener("vBoxContentLoaded", () => {
    lazyLoad.update();

    formValidateInit(".vbox-content .fv");
  });
});
