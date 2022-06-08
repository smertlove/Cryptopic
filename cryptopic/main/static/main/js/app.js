// Encrypt

let page = document.querySelector(".page");

let encryptionData = {
  file: {},
  addPicture(data, width, height, type) {
    this.picture = {
      data: data,
      width: width,
      height: height,
      type: type,
    }
  },
  addFileData(data) {
    this.file.data = data;
  },
  addFileName(name) {
    this.file.name = name;
  },
  addMessage(text) {
    this.message = text;
  },
  addOperationType(type) {
    this.operationType = type;
  },
  cleanData() {
    this.operationType = "";
    this.message = "";
    this.file = {};
    this.picture = {};
  }
}

let forms = document.querySelectorAll(".encryption_form");
let formsArr = Array.from(forms);

let cleanForm = function() {
  for (form of formsArr) {
    form.reset();
    form.dataset.stepCount = "1";
    form.classList.remove('encryption_form--downloaded-pic');
    form.classList.remove('encryption_form--downloaded-pic1');
    form.classList.remove('encryption_form--downloaded-file');
    encryptionData.cleanData();
  }
}

let encryption = document.querySelector(".encryption");

let encryptionToggle = document.querySelector(".encryption_toggle");

encryption.classList.remove("encryption--encrypt");
encryption.classList.remove("encryption--decipher");

if (encryptionToggle.checked) {
  encryption.classList.add("encryption--decipher");
} else {
  encryption.classList.add("encryption--encrypt");
}

encryptionToggle.addEventListener("click", function() {
  cleanForm();
  encryption.className = "encryption";
  encryptToggleFileText.textContent = "текст";
  decipherToggleFileText.textContent = "текст";

  if (encryptionToggle.checked) {
    encryption.classList.add("encryption--decipher");
  } else {
    encryption.classList.add("encryption--encrypt");
  }
});


encryptToggleFileText = document.querySelector(".encryption_toggle-label--encrypt .encryption_toggle-label-btn--text");

encryptToggleFileText.addEventListener("click", function() {
  cleanForm();
  encryption.className = "encryption";
  if (encryptToggleFileText.textContent == "текст") {
    encryptToggleFileText.textContent = "файл";
    encryption.classList.add("encryption--encrypt-file");
  } else if (encryptToggleFileText.textContent == "файл") {
    encryptToggleFileText.textContent = "текст";
    encryption.classList.add("encryption--encrypt");
  }
});

decipherToggleFileText = document.querySelector(".encryption_toggle-label--decipher .encryption_toggle-label-btn--text");

decipherToggleFileText.addEventListener("click", function() {
  encryption.className = "encryption";
  if (decipherToggleFileText.textContent == "текст") {
    decipherToggleFileText.textContent = "файл";
    encryption.classList.add("encryption--decipher-file");
  } else if (decipherToggleFileText.textContent == "файл") {
    decipherToggleFileText.textContent = "текст";
    encryption.classList.add("encryption--decipher");
  }
});


/********************
МОДАЛЬНЫЕ ОКНА
********************/

let modals = document.querySelectorAll(".modal");
let modalsArr = Array.from(modals);
let modalEmptyString = document.querySelector(".modal--empty-string");
let modalSmallImg = document.querySelector(".modal--small-img");

page.addEventListener("click", function(evt) {
  let close = event.target.closest(".modal_close");

  if (close) {
    for (modal of modalsArr) {
      modal.classList.remove("modal--showen");
    }
  }
});

/********************
БЛОК 1
********************/

let formEncrypt = document.querySelector(".encryption_form--encrypt");

let encryptBtnNext = formEncrypt.querySelector(".encryption_form-btn--next");
let encryptBtnBack = formEncrypt.querySelector(".encryption_form-btn--back");

let formEncryptSteps = formEncrypt.querySelectorAll(".encryption_form-step");
let formEncryptStepsArray = Array.from(formEncryptSteps);

let encryptPic = formEncrypt.querySelector(".encryption_form-encrypt-pic");

let encryptGoNextStep = function () {
  if (formEncrypt.dataset.stepCount == 1) {
    formEncrypt.dataset.stepCount = +formEncrypt.dataset.stepCount + 1;
  } else if (formEncrypt.dataset.stepCount == 2) {
    formEncrypt.dataset.stepCount = +formEncrypt.dataset.stepCount + 1;
  } else if (formEncrypt.dataset.stepCount == 3) {
    let cookie = document.cookie;
    let csrfToken = cookie.substring(cookie.indexOf('=') + 1);
    console.log(encryptionData);
    fetch(
      '/req',
      // 'https://jsonplaceholder.typicode.com/posts',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With' : 'XMLHttpRequest',
          'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(encryptionData),
      })
      .then((response) => response.json())
      .then((json) => {
        encryptPic.src = json.picture.data;
        formEncrypt.dataset.stepCount = +formEncrypt.dataset.stepCount + 1;
      });

  }
}
let encryptGoBackStep = function () {
  formEncrypt.dataset.stepCount = +formEncrypt.dataset.stepCount - 1;
}

encryptBtnNext.addEventListener("click", encryptGoNextStep);
encryptBtnBack.addEventListener("click", encryptGoBackStep);

let formEncryptInputFile = formEncrypt.querySelector(".encryption_form-picture-input");
let formEncryptInputText = formEncrypt.querySelector(".encryption_form-text-input");
let formEncryptInputPassword = formEncrypt.querySelector(".encryption_form-text-input--password");
let formEncryptImage = formEncrypt.querySelector(".encryption_form-downloaded-pic");

let toggleDownloadedPic = function(form, countPic = "") {
  form.classList.add(`encryption_form--downloaded-pic${countPic}`);
}

let convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

let uploadImage = async (event, image) => {
  const file = event.target.files[0];
  const base64 = await convertBase64(file);
  image.src = base64;
};

let declareDataEncrypt = function(image, message, password) {
  let imageWidth = image.naturalWidth;
  let imageHeight = image.naturalHeight;
  let imageType = image.src.slice(image.src.indexOf("/") + 1, image.src.indexOf(";"));

  encryptionData.addPicture(image.src, imageWidth, imageHeight, imageType);
  if (password) {
    encryptionData.addMessage(CryptoJS.AES.encrypt(message, password).toString());
  } else {
    encryptionData.addMessage(message);
  }
  encryptionData.addOperationType("encrypt-text");
}

formEncryptInputFile.addEventListener("change", (e) => {
  uploadImage(e, formEncryptImage);
  toggleDownloadedPic(formEncrypt);
  formEncryptImage.onload = function() {
    declareDataEncrypt(formEncryptImage, formEncryptInputText.value, formEncryptInputPassword.value);
  };
});






/********************
БЛОК 2
********************/







let formEncryptFile = document.querySelector(".encryption_form--encrypt-file");

let encryptFileBtnNext = formEncryptFile.querySelector(".encryption_form-btn--next");
let encryptFileBtnBack = formEncryptFile.querySelector(".encryption_form-btn--back");

let formEncryptFileSteps = formEncryptFile.querySelectorAll(".encryption_form-step");
let formEncryptFileStepsArray = Array.from(formEncryptSteps);

let encryptFilePic = formEncryptFile.querySelector(".encryption_form-encrypt-pic");

let encryptFileGoNextStep = function () {
  if (formEncryptFile.dataset.stepCount == 1) {
    formEncryptFile.dataset.stepCount = +formEncryptFile.dataset.stepCount + 1;
  } else if (formEncryptFile.dataset.stepCount == 2) {
    formEncryptFile.dataset.stepCount = +formEncryptFile.dataset.stepCount + 1;
  } else if (formEncryptFile.dataset.stepCount == 3) {
    let cookie = document.cookie;
    let csrfToken = cookie.substring(cookie.indexOf('=') + 1);
    console.log(encryptionData);
    fetch(
      '/req',
      // 'https://jsonplaceholder.typicode.com/posts',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With' : 'XMLHttpRequest',
          'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(encryptionData),
      })
      .then((response) => response.json())
      .then((json) => {
        encryptFilePic.src = json.picture.data
        formEncryptFile.dataset.stepCount = +formEncryptFile.dataset.stepCount + 1;
      });

  }
}
let encryptFileGoBackStep = function () {
  formEncryptFile.dataset.stepCount = +formEncryptFile.dataset.stepCount - 1;
}

encryptFileBtnNext.addEventListener("click", encryptFileGoNextStep);
encryptFileBtnBack.addEventListener("click", encryptFileGoBackStep);

let formEncryptFileInputFile = formEncryptFile.querySelector(".encryption_form-step[data-step='1'] .encryption_form-picture-input");
let formEncryptFileInputPic = formEncryptFile.querySelector(".encryption_form-step[data-step='3'] .encryption_form-picture-input");
let formEncryptFileInputPassword = formEncryptFile.querySelector(".encryption_form-text-input--password");

let formEncryptFileImage = formEncryptFile.querySelector(".encryption_form-step[data-step='3'] .encryption_form-downloaded-pic");

let declareDataEncryptFile = function(image, password) {
  let imageWidth = image.naturalWidth;
  let imageHeight = image.naturalHeight;
  let imageType = image.src.slice(image.src.indexOf("/") + 1, image.src.indexOf(";"));

  encryptionData.addPicture(image.src, imageWidth, imageHeight, imageType);
  encryptionData.addOperationType("encrypt-file");

  if (password) {
    encryptionData.addFileData(CryptoJS.AES.encrypt(encryptionData.file.data, password).toString());
  }
}

formEncryptFileInputFile.addEventListener("change", (e) => {
  formEncryptFile.classList.add("encryption_form--downloaded-file");

  let files = formEncryptFileInputFile.files;
  encryptionData.addFileName(files[0].name);
  processFile(files[0], compressData, files[0].name + '.lz4');
});

formEncryptFileInputPic.addEventListener("change", (e) => {
  uploadImage(e, formEncryptFileImage);
  toggleDownloadedPic(formEncryptFile);
  formEncryptFileImage.onload = function() {
    declareDataEncryptFile(formEncryptFileImage, formEncryptFileInputPassword.value);
  };
});







/********************
БЛОК 3
********************/












let formDecipher = document.querySelector(".encryption_form--decipher");

let decipherBtnNext = formDecipher.querySelector(".encryption_form-btn--next");
let decipherBtnBack = formDecipher.querySelector(".encryption_form-btn--back");
let formDecipherSteps = formDecipher.querySelectorAll(".encryption_form-step");
let formDecipherStepsArray = Array.from(formDecipherSteps);

let formDecipherInputPassword = formDecipher.querySelector(".encryption_form-text-input--password");
let encryptText = formDecipher.querySelector(".encryption_form-step[data-step='3'] .encryption_form-text-input");

let decipherGoNextStep = function () {
  if (formDecipher.dataset.stepCount == 1) {
    formDecipher.dataset.stepCount = +formDecipher.dataset.stepCount + 1;
  } else if (formDecipher.dataset.stepCount == 2) {
    let cookie = document.cookie;
    let csrfToken = cookie.substring(cookie.indexOf('=') + 1);
    console.log(encryptionData);
    fetch(
      '/req',
      // 'https://jsonplaceholder.typicode.com/posts',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With' : 'XMLHttpRequest',
          'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(encryptionData),
      })
      .then((response) => response.json())
      .then((json) => {
        if (formDecipherInputPassword.value != '') {
          let bytes  = CryptoJS.AES.decrypt(json.message, formDecipherInputPassword.value);
          originalText = bytes.toString(CryptoJS.enc.Utf8);

          encryptText.value = originalText;
        } else {
          encryptText.value = json.message;
        }

        if (encryptText.value) {
          formDecipher.dataset.stepCount = +formDecipher.dataset.stepCount + 1;
        } else {
          modalEmptyString.classList.add("modal--showen");
        }

      });
  }
}
let decipherGoBackStep = function () {
  formDecipher.dataset.stepCount = +formDecipher.dataset.stepCount - 1;
}

decipherBtnNext.addEventListener("click", decipherGoNextStep);
decipherBtnBack.addEventListener("click", decipherGoBackStep);

let formDecipherInputFile = formDecipher.querySelector(".encryption_form-step[data-step='1'] .encryption_form-picture-input");
let formDecipherImage = formDecipher.querySelector(".encryption_form-step[data-step='1'] .encryption_form-downloaded-pic");

let declareDataDecipher = function(image) {
  encryptionData.addOperationType("decipher-text");

  let imageWidth = image.naturalWidth;
  let imageHeight = image.naturalHeight;
  let imageType = image.src.slice(image.src.indexOf("/") + 1, image.src.indexOf(";"));

  encryptionData.addPicture(image.src, imageWidth, imageHeight, imageType);
}

formDecipherInputFile.addEventListener("change", (e) => {
  uploadImage(e, formDecipherImage);
  toggleDownloadedPic(formDecipher, 1);
  formDecipherImage.onload = function() {
    declareDataDecipher(formDecipherImage);
  };
});





/********************
БЛОК 4
********************/






let formDecipherFile = document.querySelector(".encryption_form--decipher-file");

let decipherFileBtnNext = formDecipherFile.querySelector(".encryption_form-btn--next");
let decipherFileBtnBack = formDecipherFile.querySelector(".encryption_form-btn--back");

let formDecipherFileInputPassword = formDecipherFile.querySelector(".encryption_form-text-input--password");

let decipherFileGoNextStep = function () {
  if (formDecipherFile.dataset.stepCount == 1) {
    formDecipherFile.dataset.stepCount = +formDecipherFile.dataset.stepCount + 1;
  } else if (formDecipherFile.dataset.stepCount == 2) {
    let cookie = document.cookie;
    let csrfToken = cookie.substring(cookie.indexOf('=') + 1);
    console.log(encryptionData);
    fetch(
      '/req',
      // 'https://jsonplaceholder.typicode.com/posts',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With' : 'XMLHttpRequest',
          'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(encryptionData),
      })
      .then((response) => response.json())
      .then((json) => {
        if (formDecipherFileInputPassword.value != '') {
          let bytes  = CryptoJS.AES.decrypt(json.file.data, formDecipherFileInputPassword.value);
          originalText = bytes.toString(CryptoJS.enc.Utf8);
          if (originalText) {
            fetch(originalText)
            .then(res => res.blob())
            .then(function(myBlob) {
              let file = new File([myBlob], {type: myBlob.type});

              processFile(file, decompressData, myBlob.type);
            });
          } else {
            modalEmptyString.classList.add("modal--showen");
          }
        } else {
          originalText = json.file.data;
          if (originalText.includes("file")) {
            fetch(originalText)
            .then(res => res.blob())
            .then(function(myBlob) {
              let file = new File([myBlob], {type: myBlob.type});

              processFile(file, decompressData, myBlob.type);
            });
          } else {
            modalEmptyString.classList.add("modal--showen");
          }
        }
      });
  }
}
let decipherFileGoBackStep = function () {
  formDecipherFile.dataset.stepCount = +formDecipherFile.dataset.stepCount - 1;
}

decipherFileBtnNext.addEventListener("click", decipherFileGoNextStep);
decipherFileBtnBack.addEventListener("click", decipherFileGoBackStep);

let formDecipherFileInputFile = formDecipherFile.querySelector(".encryption_form-step[data-step='1'] .encryption_form-picture-input");
let formDecipherFileImage = formDecipherFile.querySelector(".encryption_form-step[data-step='1'] .encryption_form-downloaded-pic");

let declareDataDecipherFile = function(image) {
  encryptionData.addOperationType("decipher-file");

  let imageWidth = image.naturalWidth;
  let imageHeight = image.naturalHeight;
  let imageType = image.src.slice(image.src.indexOf("/") + 1, image.src.indexOf(";"));

  encryptionData.addPicture(image.src, imageWidth, imageHeight, imageType);
}

formDecipherFileInputFile.addEventListener("change", (e) => {
  uploadImage(e, formDecipherFileImage);
  toggleDownloadedPic(formDecipherFile, 1);
  formDecipherFileImage.onload = function() {
    declareDataDecipherFile(formDecipherFileImage);
  };
});
