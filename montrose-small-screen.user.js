// ==UserScript==
// @name        Montrose on small screen
// @name:sv     Montrose på liten skärm
// @namespace   thomasa88
// @version     1.0.0
// @match       https://app.montrose.io/*
// @grant       none
// @author      thomasa88
// @description Allow usage of the Montrose webpage on small screens
// @description:sv Gör så att Montrose hemsida kan användas på små skärmar
// @license     CC-BY-SA 4.0
// ==/UserScript==
 
function getElementByXPath(path) {
  return new XPathEvaluator()
    .createExpression(path)
    .evaluate(document, XPathResult.FIRST_ORDERED_NODE_TYPE)
    .singleNodeValue
}
 
let triesLeft = 20;
let poller = setInterval(() => {
  console.log("Looking for the mobile overlay");
  let overlay = getElementByXPath('/html/body/div[.//*[contains(text(), "Vill du använda Montrose i din telefon?")]]');
  if (overlay) {
    console.log("Hiding the mobile overlay");
    overlay.style.display = 'none';
  }
  if (overlay || triesLeft <= 0) {
    clearTimeout(poller);
  }
  triesLeft--;
}, 1000);


// @layer priority7 {
//   @media (min-width: 1024px) {
//     .xfiw00r.xfiw00r {
//       display: flex;
//     }
//   }
// }

// document.querySelector('[aria-label=Huvudmeny]').style.display='flex'
// tag: nav




// @layer priority7 {
//   @media (min-width: 1024px) {
//     .x9sj0uk.x9sj0uk {
//       grid-template-columns: 64px minmax(0,1fr) 8px;
//     }
//   }
// }

// document.getElementById('main').parentElement.style.gridTemplateColumns="64px minmax(0,1fr) 8px"


// document.getElementById('main').parentElement.querySelectorAll('header > div').forEach(e => e.style.display = 'flex')

// document.getElementById('main').parentElement.querySelectorAll('header > *').forEach(e => e.style.display = 'flex')