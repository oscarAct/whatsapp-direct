import { countryCodes } from "../data/countryCodes.js";
import { translatedText } from "../data/translatedText.js";

const notyf = new Notyf({
  duration: 4000,
  position: {
    x: "right",
    y: "top",
  },
  multiple: false,
  types: [
    {
      type: "warning",
      background: "orange",
      icon: {
        className: "material-icons",
        tagName: "i",
        text: "warning",
      },
    },
    {
      type: "error",
      background: "indianred",
      duration: 4000,
      dismissible: true,
    },
  ],
});

const selectId = "#country";
const buttonId = "#send-message-btn";
const inputTextId = "#phone-number";
const countryImgId = "#country-img";
const firstLineId = "#first-line";
const secondLineId = "#second-line";

const select = document.querySelector(selectId);
const sendMessageButton = document.querySelector(buttonId);
const inputText = document.querySelector(inputTextId);
const countryImg = document.querySelector(countryImgId);
const firstLine = document.querySelector(firstLineId);
const secondLine = document.querySelector(secondLineId);

const defaultFirstLine = "Don't save any unwanted contact anymore. 🥳";
const defaultSecondLine =
  "Please DO NOT type the country code. Instead, select your country bellow.";

function fillSelect(countryCodes) {
  let template = "";

  countryCodes.forEach((element) => {
    template += `<option value="${element.dial_code}" con-code="${element.code}">${element.code} (${element.dial_code})</option>`;
  });
  select.innerHTML = template;

  const localCountry = localStorage.getItem("country");
  if (localCountry !== null) {
    select.value = localCountry;
    const countryCode = select.selectedOptions[0].attributes["con-code"].value
      .toString()
      .toLowerCase();
    countryImg.src = `../assets/img/flags/4x3/${countryCode}.svg`;
  }
}

function onCountryChanged() {
  select.addEventListener("change", () => {
    localStorage.setItem("country", select.value);
    const countryCode = select.selectedOptions[0].attributes["con-code"].value
      .toString()
      .toLowerCase();
    countryImg.src = `../assets/img/flags/4x3/${countryCode}.svg`;
    firstLine.innerText =
      translatedText[countryCode]?.first || defaultFirstLine;
    secondLine.innerText =
      translatedText[countryCode]?.second || defaultSecondLine;
  });
}
function onSendMessageButtonClick() {
  sendMessageButton.addEventListener("click", () => {
    if (isnumberValid()) {
      const number = inputText.value;
      const countryCode = select.value;
      const fullNumber = `${countryCode}${number}`;
      window.open(
        `https://api.whatsapp.com/send?phone=${fullNumber}`,
        "_blank"
      );
    } else {
      if (notyf.notifications.notifications.length === 0) {
        notyf.error("You must fill out the input text before moving forward", {
          x: "right",
          y: "top",
        });
      }
    }
  });
}
function isnumberValid() {
  if (
    inputText.value !== null &&
    inputText.value !== undefined &&
    inputText.value !== "".trim()
  )
    return true;
  else return false;
}
fillSelect(countryCodes);
onCountryChanged();
onSendMessageButtonClick();
