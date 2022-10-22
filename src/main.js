import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")

const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img ")


function setCardType(type) {
  const colors = {
    visa: ["#2D57F2", "#436D99"],
    mastercard: ["#C69347", "#DF6F29"],
    default: ["black", "gray"],
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])

  ccLogo.setAttribute("src", `cc-${type}.svg`)
}
//função global > console: windows.setCardType("type")
globalThis.setCardType = setCardType


const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000"
}

const securityCodeMasked = IMask(securityCode, securityCodePattern)


const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2)
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    }
  }
}

const expirationDateMasked = IMask(expirationDate, expirationDatePattern)


const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      //regra visa: inicia com num 4, seguido de 15 digitos
      //d{0,15} é p/ não esperar digitar tudo, tendo o 4 já muda a bandeira p/ visa
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      //regra master: inicia com 5, prox digito entre 1 e 5 seguido de dois digitos 
      //OU inicia com 22, prox digito entre 2 e 9 seguido de 1 digito
      //OU inicia com 2, prox digito entre 3 e 7 seguido de 2 digitos
      //seguem mais 12 digitos.
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  //exemplo das prox funções na doc imask
  dispatch: function (appended, dynamicMasked) {
    //substitui tudo que não é digito por vazio
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    //retorna o regex se deu match na mascara
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })
    //console.log(foundMask)
    return foundMask
  },
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)


const addButton = document.querySelector("#add-card")

addButton.addEventListener("click", () => {
  alert("Cartão adicionado")
})

//p/ retirar o padrão que é recarregar a página
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})


//funções seguintes são p/ atualizar os valores digitados, que passaram pelas mascaras,
//na imagem do cartão.
//digitou algo e apagou, volta ao texto padrão
const cardHolder = document.querySelector("#card-holder")

cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")

  ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value 
})


securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = code.length === 0 ? "123" : code
}


cardNumberMasked.on("accept", () => {
  //atualiza logo e cor do cartão
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  //atualiza num cartão ao digitar
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")

  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}


expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
  const ccExpirationDate = document.querySelector(".cc-expiration .value")

  ccExpirationDate.innerText = date.length === 0 ? "02/32" : date
}
