let btnEncryptionToggle = document.querySelector(".encryption_toggle");
let formEncription = document.querySelector(".encryption_form");
let encryptionInputText = document.querySelector(".encryption_input-text");
let encryptionInputFile = document.querySelector(".encryption_input-file");
let encryptionBtnKey = document.querySelector(".encryption_btn--key");
let encryptionBtnBack = document.querySelector(".encryption_btn--back");

let encryptionData = {
  operation: "",
  text: "",
  picture: "",
  picture_length: "",
  picture_type: "",
}
let toggleTypeEncryption = function() {
  toggleTypeEncryptionClass();
  cleanEncryptionForm();
  removeUploadedPic();
}

let toggleTypeEncryptionClass = function() {
  formEncription.classList.toggle("encryption_form--encrypt");
  formEncription.classList.toggle("encryption_form--decipher");
}

let cleanEncryptionForm = function() {
  encryptionInputText.value = "";
  encryptionInputFile.value = "";
}

let showUploadedPic = function(evt) {
  if (encryptionInputFile.value != "") {
    formEncription.classList.add("encryption_form--uploaded");
  }

  let reader = new FileReader();

  reader.onload = function(e) {

    var img = document.createElement('img');

    img.onload = function() {
      console.log(this.width+'x'+this.height);
    };

    img.src = e.target.result;
  }
}
let removeUploadedPic = function() {
  formEncription.classList.remove("encryption_form--uploaded");
}
let getPic = function() {
  let reader = new FileReader();
  reader.readAsDataURL(encryptionInputFile.files[0])

  let createImg = function(evt) {
    let img = document.createElement('img');

    encryptionData.picture = evt.target.result;

    img.src = evt.target.result;
    img.className = "encryption_input-img";
    document.querySelector(".encryption_input-img-wrap").append(img);
    encryptionData.picture_type = img.src.slice(img.src.indexOf("/") + 1, img.src.indexOf(";"));

    let showSize = function() {
      encryptionData.picture_length = img.width * img.height;
    };

    img.addEventListener("load", showSize);
  }

  reader.addEventListener("load", createImg);
}
let updateSrcImg = function(newSrc) {
  goNextStep();
  document.querySelector('.encryption_form').classList.add("encryption_form--updated");
  document.querySelector('.encryption_input-img').src = newSrc;
}
let showText = function(text) {
  goNextStep();
  document.querySelector('.encryption_input-text').value = text;
}
let tapEncryptionBtnKey = function(evt) {
  evt.preventDefault();

  if (getTypeEncryption() == 'encrypt') {
    if (getStepEncryption() == 1) {
      goNextStep();
    } else {
      encryptionData.operation = 'encrypt';
      encryptionData.text = encryptionInputText.value;
      let cookie = document.cookie;
      let csrfToken = cookie.substring(cookie.indexOf('=') + 1);
      console.log('ushlo na servak\n', encryptionData);
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
        .then((json) => updateSrcImg(json.picture));
    }
  }
  if (getTypeEncryption() == 'decipher') {
    encryptionData.operation = 'decipher';
    delete encryptionData.text;
    let cookie = document.cookie;
    let csrfToken = cookie.substring(cookie.indexOf('=') + 1);
    fetch(
      '/req',
      // 'https://jsonplaceholder.typicode.com/posts',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(encryptionData),
      })
      .then((response) => response.json())
      .then((json) => showText(json.picture_length));
  }
}

let getTypeEncryption = function() {
  if (formEncription.classList.contains('encryption_form--encrypt')) {
    return 'encrypt';
  }
  return 'decipher';
}
let getStepEncryption = function() {
  if (formEncription.classList.contains('encryption_form--step-1')) {
    return 1;
  }
  return 2;
}

let goNextStep = function() {
  numberStep = +formEncription.className.split("encryption_form--step-")[1][0];

  formEncription.classList.remove("encryption_form--step-1");
  formEncription.classList.remove("encryption_form--step-2");
  formEncription.classList.add(`encryption_form--step-${numberStep + 1}`);
}
let goPreviousStep = function() {
  numberStep = +formEncription.className.split("encryption_form--step-")[1][0];

  formEncription.classList.remove("encryption_form--step-3");
  formEncription.classList.remove("encryption_form--step-2");
  formEncription.classList.add(`encryption_form--step-${numberStep - 1}`);
}



btnEncryptionToggle.addEventListener("click", toggleTypeEncryption);
encryptionInputFile.addEventListener("change", showUploadedPic);
encryptionInputFile.addEventListener("change", getPic);
encryptionBtnKey.addEventListener("click", tapEncryptionBtnKey);
encryptionBtnBack.addEventListener("click", goPreviousStep);


//раздел info

let info = document.querySelector('.info');
let infoHowEncrypt = info.querySelector('.info_how--encrypt');
let schemeEncrypt = infoHowEncrypt.querySelector('.info_how-scheme');
let schemeEncryptIcons = schemeEncrypt.querySelectorAll('.info_how-scheme-icon');
let schemeEncryptIconsArr = Array.from(schemeEncryptIcons);
let schemeEncryptTexts = infoHowEncrypt.querySelectorAll('.info_how-text');
let schemeEncryptTextsArr = Array.from(schemeEncryptTexts);

schemeEncrypt.addEventListener('click', function(event) {
  let icon = event.target.closest(".info_how-scheme-icon");

  if (icon) {
    for (let icon of schemeEncryptIconsArr) {
      icon.classList.remove("info_how-scheme-icon--active");
    }
    icon.classList.add("info_how-scheme-icon--active");

    let iconNum = icon.dataset.count;

    for (let text of schemeEncryptTextsArr) {
      text.classList.remove("info_how-text--active");
    }
    infoHowEncrypt.querySelector(`.info_how-text--${iconNum}`).classList.add("info_how-text--active");
  }
});

let infoHowDecipher = info.querySelector('.info_how--decipher');
let schemeDecipher = infoHowDecipher.querySelector('.info_how-scheme');
let schemeDecipherIcons = schemeDecipher.querySelectorAll('.info_how-scheme-icon');
let schemeDecipherIconsArr = Array.from(schemeDecipherIcons);
let schemeDecipherTexts = infoHowDecipher.querySelectorAll('.info_how-text');
let schemeDecipherTextsArr = Array.from(schemeDecipherTexts);

schemeDecipher.addEventListener('click', function(event) {
  let icon = event.target.closest(".info_how-scheme-icon");

  if (icon) {
    for (let icon of schemeDecipherIconsArr) {
      icon.classList.remove("info_how-scheme-icon--active");
    }
    icon.classList.add("info_how-scheme-icon--active");

    let iconNum = icon.dataset.count;

    for (let text of schemeDecipherTextsArr) {
      text.classList.remove("info_how-text--active");
    }
    infoHowDecipher.querySelector(`.info_how-text--${iconNum}`).classList.add("info_how-text--active");
  }
});

//# sourceMappingURL=app.js.map

//# sourceMappingURL=app.js.map
