import { gsap } from "gsap";

const items = document.querySelectorAll(".partners__item");

const tl = gsap.timeline({
  repeat: -1,
});

items.forEach((item) => {
  tl.to(
    item,
    {
      scale: 1.2,
      duration: 2,
      repeat: 1,
      yoyo: true,
    },
    "-=3",
  );
});
