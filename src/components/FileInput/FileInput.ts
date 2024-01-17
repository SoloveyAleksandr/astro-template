class FileInputController {
  input: HTMLInputElement;
  // fileArea: HTMLElement;
  list: HTMLElement;
  fileTemplate: HTMLTemplateElement;
  files: File[];

  constructor(
    input: HTMLInputElement,
    // fileArea: HTMLElement,
    list: HTMLElement,
    fileTemplate: HTMLTemplateElement,
  ) {
    this.input = input;
    // this.fileArea = fileArea;
    this.list = list;
    this.fileTemplate = fileTemplate;

    this.files = [];

    // (this.fileArea as any).files = this.files;
    (this.input as any).fileList = this.files;

    this.input.addEventListener("change", this.inputHandler.bind(this));

    // this.fileArea.addEventListener(
    //   "dragenter",
    //   (e) => {
    //     e.preventDefault();
    //     this.fileArea.classList.add("focus");
    //   },
    //   false,
    // );
    // this.fileArea.addEventListener(
    //   "dragleave",
    //   (e) => {
    //     e.preventDefault();
    //     this.fileArea.classList.remove("focus");
    //   },
    //   false,
    // );
    // this.fileArea.addEventListener(
    //   "dragend",
    //   (e) => {
    //     e.preventDefault();
    //     this.fileArea.classList.remove("focus");
    //   },
    //   false,
    // );
    // this.fileArea.addEventListener(
    //   "dragover",
    //   (e) => {
    //     e.preventDefault();
    //     this.fileArea.classList.add("focus");
    //   },
    //   false,
    // );
    // this.fileArea.addEventListener(
    //   "drop",
    //   (e) => this.dropHandler.call(this, e),
    //   false,
    // );
  }

  inputHandler() {
    if (this.input.files) {
      for (let i = 0; i < this.input.files.length; i++) {
        const file = this.input.files[i];
        this.files.push(file);
      }

      this.input.files = null;
      this.input.value = "";

      // (this.fileArea as any).files = this.files;
      (this.input as any).fileList = this.files;
    }

    this.render();
  }

  // dropHandler(e: DragEvent) {
  //   e.preventDefault();
  //   // this.fileArea.classList.remove("focus");

  //   const dt = e.dataTransfer;
  //   if (dt) {
  //     const files = dt.files;
  //     const types = this.input.accept.split(" ").join("").split(",");

  //     for (let i = 0; i < files.length; i++) {
  //       if (types.includes(files[i].type)) {
  //         this.files.push(files[i]);
  //       }
  //     }

  //     // (this.fileArea as any).files = this.files;
  //     (this.input as any).fileList = this.files;

  //     this.render();
  //   }
  // }

  removeFile(file: File) {
    this.files = this.files.filter((i) => i !== file);
    (this.input as any).fileList = this.files;
    this.render();
  }

  render() {
    const fragment = document.createDocumentFragment();

    this.files.forEach((file) => {
      const newNode = this.fileTemplate.content.children[0].cloneNode(true);

      const name = (newNode as HTMLElement).querySelector("[data-name]");
      const type = (newNode as HTMLElement).querySelector("[data-type]");
      const btn = (newNode as HTMLElement).querySelector<HTMLButtonElement>(
        "[data-btn]",
      );

      if (name && type && btn) {
        const fileNameArr = file.name.split(".");
        name.textContent = fileNameArr
          .splice(0, fileNameArr.length - 1)
          .join(".");
        type.textContent = "." + fileNameArr[fileNameArr.length - 1];
        btn.addEventListener("click", () => this.removeFile.call(this, file));

        fragment.appendChild(newNode);
      }
    });

    this.list.innerHTML = "";
    this.list.appendChild(fragment);
  }
}

export const initFileInputs = (wrapperSelector?: string) => {
  const wrapper =
    wrapperSelector && document.querySelector<HTMLElement>(wrapperSelector);
  const containers = wrapper
    ? wrapper.querySelectorAll<HTMLElement>(".file-input")
    : document.querySelectorAll<HTMLElement>(".file-input");

  containers.forEach((container) => {
    const input = container.querySelector<HTMLInputElement>(
      ".file-input__btn input",
    );
    const list = container.querySelector<HTMLElement>(".file-input__list");
    const template = container.querySelector<HTMLTemplateElement>(
      "template#file-input-doc",
    );

    if (input && list && template) {
      new FileInputController(input, list, template);
    }
  });
};
