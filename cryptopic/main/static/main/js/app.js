let btnEncryptionToggle = document.querySelector(".encryption_toggle");
let formEncription = document.querySelector(".encryption_form");
let encryptionInputText = document.querySelector(".encryption_input-text");
let encryptionInputFile = document.querySelector(".encryption_input-file");
let encryptionBtnKey = document.querySelector(".encryption_btn--key");
let encryptionBtnBack = document.querySelector(".encryption_btn--back");

let encryptionData = {
  text: "",
  picture: "",
  picture_length: "",
}
let toggleTypeEncryption = function() {
  toggleTypeEncryptionClass();
  cleanEncryptionForm();
  removeUploadedPic();

  if (getTypeEncryption() == "decipher") {
    encryptionInputText.disabled = true;
  } else {
    encryptionInputText.disabled = false;
  }
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

    console.log('adsasd');
    var img = document.createElement('img');

    img.onload = function() {
      console.log(this.width+'x'+this.height); // наконец-то результат
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

    let showSize = function() {
      encryptionData.picture_length = img.width * img.height;
    };

    img.addEventListener("load", showSize);
  }

  reader.addEventListener("load", createImg);
}

let tapEncryptionBtnKey = function(evt) {
  evt.preventDefault();

  if (getTypeEncryption() == 'encrypt') {
    if (getStepEncryption() == 1) {
      goNextStep();
    } else {
      fetch(
        'https://jsonplaceholder.typicode.com/posts',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(encryptionData),
        })
        .then((response) => response.json())
        .then((json) => console.log(json));
    }
  }
  if (getTypeEncryption() == 'decipher') {
    delete encryptionData.text;
    fetch(
      'https://jsonplaceholder.typicode.com/posts',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(encryptionData),
      })
      .then((response) => response.json())
      .then((json) => console.log(json));
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
  formEncription.classList.remove("encryption_form--step-1");
  formEncription.classList.add("encryption_form--step-2");
}
let goPreviousStep = function() {
  formEncription.classList.add("encryption_form--step-1");
  formEncription.classList.remove("encryption_form--step-2");
}



btnEncryptionToggle.addEventListener("click", toggleTypeEncryption);
encryptionInputFile.addEventListener("change", showUploadedPic);
encryptionInputFile.addEventListener("change", getPic);
encryptionBtnKey.addEventListener("click", tapEncryptionBtnKey);
encryptionBtnBack.addEventListener("click", goPreviousStep);


//раздел info

// let sectionEncrypt = document.querySelector(".info__how--encrypt");
// let sectionEncryptIcon = sectionEncrypt.querySelectorAll(".info__how-scheme-icon");
//
// sectionEncrypt.addEventListener('click', function(event) {
//
//     if (event.target.className === 'info__how-scheme-icon') {
//       for (let item of Array.from(sectionEncryptIcon)) {
//         item.classList.remove("info__how-scheme-icon--active");
//       }
//       event.target.classList.add("info__how-scheme-icon--active");
//       console.log(event.target);
//     }
//
//   });

//AJAX

const ajaxSend = async (formData) => {
  const fetchResp = await fetch('mail.php', {
    method: 'POST',
    body: formData
  });
  if (!fetchResp.ok) {
    throw new Error(`Ошибка по адресу ${url}, статус ошибки ${fetchResp.status}`);
  }
  return await fetchResp.text();
};

formEncription.addEventListener('submit', function (e) {
    e.preventDefault();

    let formData = new FormData(this);
    formData = Object.fromEntries(formData);

    ajaxSend(formData)
      .then((response) => {
        console.log(response);
        form.reset(); // очищаем поля формы
      })
      .catch((err) => console.error(err))
});
//# sourceMappingURL=app.js.map

//# sourceMappingURL=app.js.map
