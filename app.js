
const BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies"

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from-box select");
const toCurr = document.querySelector(".to-box select");
const msg = document.querySelector(".msg input");
const update = document.querySelector(".last-update p");
const newSymFrom = document.querySelector(".amount p");
const newSymTo = document.querySelector(".msg p");

window.addEventListener("load", () => {
    updateExchangeRate();

});

for (let select of dropdowns) {
    for (let key in currencycode) {
        let newOption = document.createElement("option");

        newOption.innerText = currencycode[key].name;
        newOption.value = currencycode[key].name;
        if (select.name === "from" && currencycode[key].name === "United States Dollar") {
            newOption.selected = "selected";
            newSymFrom.innerHTML = currencycode[key].symbolNative

        } else if (select.name === "to" && currencycode[key].name === "Indian Rupee") {
            newOption.selected = "selected";
            newSymTo.innerHTML = currencycode[key].symbolNative
        }
        select.append(newOption);
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target, currencycode);
    })
}

const updateFlag = (element, currencycode) => {
    let currcode = element.value;
    for (let key in currencycode) {
        if (currcode === currencycode[key].name) {
            let countrycode = countryList[key];
            let newSrc = `https://flagsapi.com/${countrycode}/flat/64.png`;
            if (element.name == "from") {
                newSymFrom.innerHTML = currencycode[key].symbolNative
            } else {
                newSymTo.innerHTML = currencycode[key].symbolNative
            }
            // symbol.innerHTML = currencycode[key].symbolNative
            let img = element.parentElement.querySelector("img");
            img.src = newSrc;

        }
    }
}

btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    let fromCurrency = 0;
    let toCurrency = 0;

    for (let key in currencycode) {
        if (fromCurr.value === currencycode[key].name) {
            fromCurrency = key.toLowerCase();
        }

        if (toCurr.value === currencycode[key].name) {
            toCurrency = key.toLowerCase();
        }
    }

    const URL = `${BASE_URL}/${fromCurrency}.json`
    let response = await fetch(URL);
    let data = await response.json();
    update.innerText = `last updated on: ${data["date"]}`;
    for (values in data[fromCurrency]) {
        if (values === toCurrency) {
            let result = data[fromCurrency][values] * amtVal;
            msg.value = result;
        }
    }
}


