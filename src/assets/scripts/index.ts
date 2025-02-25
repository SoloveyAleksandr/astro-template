import { formValidateInit } from "./fv";
import Swiper from "swiper";
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectCreative,
  EffectCoverflow,
  Manipulation,
  FreeMode,
} from "swiper/modules";
import LazyLoad from "vanilla-lazyload";
import { vBoxHandler } from "./vBox";
import { PopupController } from "./utils/popup";
import { initDropdownItems } from "./utils/dropdown";
import { initSwipers } from "./utils/swiper";
import { initSelectItems } from "./utils/select";
import { initMainServices } from "@components/pageMain/MainServices/MainServices";
import { initTextInputs } from "@components/_UI/TextInput/TextInput";
import { Gallery } from "./utils/gallery";
import { initShowHandler } from "./utils/showController";
import { initTabController } from "./utils/tabController";
import { initCalc } from "@components/Calc/Calc";

Swiper.use([
  Navigation,
  Pagination,
  Autoplay,
  EffectCreative,
  EffectCoverflow,
  Manipulation,
  FreeMode,
]);

document.addEventListener("DOMContentLoaded", () => {
  const lazyLoad = new LazyLoad({
    elements_selector: ".lazy",
  });
  lazyLoad.update();

  const popupController = new PopupController();
  (window as any).popupController = popupController;

  const gallery = new Gallery(popupController);

  // Инициализация компонентов и обработчиков
  // общие
  formValidateInit(".fv");
  initDropdownItems();
  initSelectItems();
  initSwipers();
  initTextInputs();
  initShowHandler();
  initTabController();

  // компоненты
  initMainServices();
  initCalc();
  // <--

  // События
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    vBoxHandler(e, target);

    popupController.clickHandler(e, target);
    gallery.clickHandler(e, target);
  });

  document.addEventListener("vBoxContentLoaded", () => {
    lazyLoad.update();

    formValidateInit(".vbox-content .fv");
  });
});
