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
  encryption.classList.remove("encryption--encrypt");
  encryption.classList.remove("encryption--decipher");

  if (encryptionToggle.checked) {
    encryption.classList.add("encryption--decipher");
  } else {
    encryption.classList.add("encryption--encrypt");
  }
});



let encryptionData = {
  addPicture(data, width, height, type, count = "") {
    this["picture" + count] = {
      data: data,
      width: width,
      height: height,
      type: type,
    }
  },
  addMessage(text) {
    this.messege = text;
  },
  addOperationType(type) {
    this.operationType = type;
  },
}
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
    let cookie = document.cookie;
    let csrfToken = cookie.substring(cookie.indexOf('=') + 1);
    fetch(
      // '/req',
      'https://jsonplaceholder.typicode.com/posts',
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
      .then((json) => encryptPic.src = json.picture.data);
      formEncrypt.dataset.stepCount = +formEncrypt.dataset.stepCount + 1;
  }
}
let encryptGoBackStep = function () {
  formEncrypt.dataset.stepCount = +formEncrypt.dataset.stepCount - 1;
}

encryptBtnNext.addEventListener("click", encryptGoNextStep);
encryptBtnBack.addEventListener("click", encryptGoBackStep);

let formEncryptInputFile = formEncrypt.querySelector(".encryption_form-picture-input");
let formEncryptInputText = formEncrypt.querySelector(".encryption_form-text-input");
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

let declareDataEncrypt = function(image, messege) {
  let imageWidth = image.naturalWidth;
  let imageHeight = image.naturalHeight;
  let imageType = image.src.slice(image.src.indexOf("/") + 1, image.src.indexOf(";"));

  encryptionData.addPicture(image.src, imageWidth, imageHeight, imageType);
  encryptionData.addMessage(messege);
  encryptionData.addOperationType("encrypt");
}

formEncryptInputFile.addEventListener("change", (e) => {
  uploadImage(e, formEncryptImage);
  toggleDownloadedPic(formEncrypt);
  formEncryptImage.onload = function() {
    declareDataEncrypt(formEncryptImage, formEncryptInputText.value);
  };
});

























let formDecipher = document.querySelector(".encryption_form--decipher");

let decipherBtnNext = formDecipher.querySelector(".encryption_form-btn--next");
let decipherBtnBack = formDecipher.querySelector(".encryption_form-btn--back");
let formDecipherSteps = formDecipher.querySelectorAll(".encryption_form-step");
let formDecipherStepsArray = Array.from(formDecipherSteps);

let encryptText = formDecipher.querySelector(".encryption_form-text-input");

let decipherGoNextStep = function () {
  if (formDecipher.dataset.stepCount == 1) {
    formDecipher.dataset.stepCount = +formDecipher.dataset.stepCount + 1;
  } else if (formDecipher.dataset.stepCount == 2) {
    let cookie = document.cookie;
    let csrfToken = cookie.substring(cookie.indexOf('=') + 1);
    fetch(
      // '/req',
      'https://jsonplaceholder.typicode.com/posts',
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
      .then((json) => encryptText.value = json.messege);
      formDecipher.dataset.stepCount = +formDecipher.dataset.stepCount + 1;
  }
}
let decipherGoBackStep = function () {
  formDecipher.dataset.stepCount = +formDecipher.dataset.stepCount - 1;
}

decipherBtnNext.addEventListener("click", decipherGoNextStep);
decipherBtnBack.addEventListener("click", decipherGoBackStep);

let formDecipherInputFileFirst = formDecipher.querySelector(".encryption_form-step[data-step='1'] .encryption_form-picture-input");
let formDecipherImageFirst = formDecipher.querySelector(".encryption_form-step[data-step='1'] .encryption_form-downloaded-pic");

let formDecipherInputFileSecond = formDecipher.querySelector(".encryption_form-step[data-step='2'] .encryption_form-picture-input");
let formDecipherImageSecond = formDecipher.querySelector(".encryption_form-step[data-step='2'] .encryption_form-downloaded-pic");

let declareDataDecipher = function(imageFirst, imageSecond) {
  encryptionData.addOperationType("decipher");

  let imageFirstWidth = imageFirst.naturalWidth;
  let imageFirstHeight = imageFirst.naturalHeight;
  let imageFirstType = imageFirst.src.slice(imageFirst.src.indexOf("/") + 1, imageFirst.src.indexOf(";"));

  encryptionData.addPicture(imageFirst.src, imageFirstWidth, imageFirstHeight, imageFirstType, 1);

  let imageSecondWidth = imageSecond.naturalWidth;
  let imageSecondHeight = imageSecond.naturalHeight;
  let imageSecondType = imageSecond.src.slice(imageSecond.src.indexOf("/") + 1, imageSecond.src.indexOf(";"));
  encryptionData.addPicture(imageSecond.src, imageSecondWidth, imageSecondHeight, imageSecondType, 2);
}

formDecipherInputFileFirst.addEventListener("change", (e) => {
  uploadImage(e, formDecipherImageFirst);
  toggleDownloadedPic(formDecipher, 1);
});
formDecipherInputFileSecond.addEventListener("change", (e) => {
  uploadImage(e, formDecipherImageSecond);
  toggleDownloadedPic(formDecipher, 2);
  formDecipherImageSecond.onload = function() {
    declareDataDecipher(formDecipherImageFirst, formDecipherImageSecond);
  };
});

//# sourceMappingURL=app.js.map
