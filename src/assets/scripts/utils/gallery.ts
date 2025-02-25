import Swiper from "swiper";
import type { Popup, PopupController } from "./popup";

type TGaleryItem = {
  src: string;
  type: "video" | "img";
};

export class Gallery {
  gallery: Map<string, TGaleryItem[]> = new Map();
  popup: Popup | undefined;
  swiper: Swiper | null = null;

  constructor(popupController: PopupController) {
    this.popup = popupController.popupMap.get("gallery");

    this.initSwiper();

    document
      .querySelectorAll<HTMLLinkElement>("[data-gallery]")
      .forEach((link) => {
        try {
          const id = link.getAttribute("data-gallery");
          if (!id) return;

          const imgList = link.getAttribute("data-gallery-list");
          if (imgList) {
            const imgArr: TGaleryItem[] = (JSON.parse(imgList) as string[]).map(
              (i) => ({
                src: i,
                type: "img",
              }),
            );
            this.gallery.set(id, imgArr);
          } else {
            const src = link.getAttribute("href");
            if (!src) return;

            const isVideo = link.hasAttribute("data-gallery-video");

            const gallery = this.gallery.get(id);
            if (!gallery) {
              this.gallery.set(id, [
                {
                  src,
                  type: isVideo ? "video" : "img",
                },
              ]);
            } else {
              gallery.push({
                src,
                type: isVideo ? "video" : "img",
              });
            }
          }
        } catch (e) {
          console.error(e);
        }
      });
  }

  initSwiper() {
    if (!this.popup) return;

    const swiperContainer = this.popup.container.querySelector<HTMLElement>(
      ".swiper.popup-gallery__swiper",
    );
    const prevBtn = swiperContainer?.querySelector<HTMLElement>("[data-prev]");
    const nextBtn = swiperContainer?.querySelector<HTMLElement>("[data-next]");

    if (!swiperContainer) return;

    this.swiper = new Swiper(swiperContainer, {
      navigation: {
        prevEl: prevBtn,
        nextEl: nextBtn,
      },
      slidesPerView: 1,
      spaceBetween: 0,
      centeredSlides: true,
      effect: "coverflow",
      coverflowEffect: {
        slideShadows: false,
      },
    });
  }

  clickHandler(e: Event, target: HTMLElement) {
    if (!this.popup) return;
    const link = target.closest<HTMLLinkElement>("[data-gallery]");
    const id = link?.getAttribute("data-gallery");
    const src = link?.getAttribute("href");

    if (id) {
      e.preventDefault();
      this.open.call(this, id, src);
    }
  }

  open(id: string, src: string | null | undefined) {
    if (!this.popup || !this.swiper) return;

    const gallery = this.gallery.get(id);
    if (!gallery) return;

    const index = src ? gallery.findIndex((el) => el.src === src) : 0;

    this.swiper.removeAllSlides();
    this.swiper.appendSlide(this.createGallery(gallery));
    setTimeout(() => {
      this.swiper?.update();
      this.swiper?.slideTo(index, 1);
      this.popup?.controller.open(this.popup.key);
    }, 50);
  }

  createGallery(gallery: TGaleryItem[]): string[] {
    const result = gallery.map((item) => {
      if (item.type === "img") {
        return `<div class="swiper-slide">
          <img src="${item.src}" alt="" />
        </div>`;
      } else {
        return `<div class="swiper-slide">
          <video
            muted
            playsinline
            webkit-playsinline
            controls
          >
            <source src="${item.src}" type="video/mp4" />
          </video>
        </div>`;
      }
    });

    return result;
  }
}
