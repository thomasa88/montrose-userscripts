// ==UserScript==
// @name         Montrose on small screens
// @name:sv      Montrose på liten skärm
// @namespace    thomasa88
// @version      2.1.0
// @description  Use app.montrose.io on phones and other small screens by giving the page a desktop-width viewport
// @description:sv Använd app.montrose.io på telefoner och andra små skärmar genom att ge sidan en skrivbordsbredd
// @match        https://app.montrose.io/*
// @run-at       document-start
// @grant        none
// @author       thomasa88
// @license      CC-BY-SA 4.0
// ==/UserScript==

(() => {
  'use strict';

  // The site switches to its desktop layout with `min-width: 1024px` media
  // queries and shows a "use the app instead" screen below that. Giving the
  // page a viewport of exactly the desktop breakpoint makes the browser lay
  // it out as a desktop page (scaled to fit the phone) instead of applying
  // the mobile rules. This is the same trick as "Request desktop website".
  const DESKTOP_WIDTH = 1024;
  const VIEWPORT_CONTENT = `width=${DESKTOP_WIDTH}`;

  function setViewport() {
    const metas = document.querySelectorAll('meta[name="viewport"]');

    if (metas.length === 0) {
      // The server-rendered <meta> may not have been parsed yet. Wait for
      // <head> instead of putting the tag somewhere the browser ignores.
      if (!document.head) return;
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = VIEWPORT_CONTENT;
      document.head.appendChild(meta);
      return;
    }

    for (const meta of metas) {
      if (meta.getAttribute('content') !== VIEWPORT_CONTENT) {
        meta.setAttribute('content', VIEWPORT_CONTENT);
      }
    }
  }

  // Fallback for browsers that ignore viewport changes (some in-app
  // browsers): hide the "use the app instead" dialog. It is rendered in a
  // Base UI portal that is a sibling of the app, so hiding the whole portal
  // removes the backdrop and the dialog together without touching the app.
  //
  // Do not hide a `position: fixed` ancestor instead: the nearest one is the
  // dialog popup, and hiding only that leaves the inert full-screen backdrop
  // covering the page.
  const BLOCK_TEXT = 'Vill du använda Montrose i din telefon?';
  const BLOCK_PATHS = [
    // Preferred: the portal that Base UI mounts the dialog and its backdrop in.
    `//div[@data-base-ui-portal][contains(normalize-space(.), "${BLOCK_TEXT}")]`,
    // Only if the portal attribute ever changes: the body-level dialog wrapper.
    `/html/body/div[contains(normalize-space(.), "${BLOCK_TEXT}")][.//*[@role="dialog"]]`,
  ];

  function findMobileBlock() {
    const evaluator = new XPathEvaluator();
    for (const path of BLOCK_PATHS) {
      const node = evaluator
        .createExpression(path)
        .evaluate(document, XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue;
      if (node) return node;
    }
    return null;
  }

  // A dialog wrapper never holds the app chrome, so this catches the case
  // where a path above matches an app container and would blank the page.
  function holdsAppChrome(node) {
    const chrome = 'main, nav, form, [role="main"]';
    return node.matches(chrome) || node.querySelector(chrome) !== null;
  }

  // Returns true once the dialog is hidden, so the caller can stop polling.
  function hideMobileBlock() {
    const overlay = findMobileBlock();
    if (!overlay || overlay === document.body) return false;
    if (holdsAppChrome(overlay)) return false;

    // At desktop width the same markup is in the page but hidden by the
    // min-width media query. Only act on a dialog the user can actually see.
    if (overlay.getClientRects().length === 0) return false;

    overlay.style.setProperty('display', 'none', 'important');
    console.debug('Montrose on small screens: hid the app dialog');
    return true;
  }

  setViewport();

  // The viewport tag is part of the server-rendered HTML, which may be parsed
  // after this script starts. The app may also touch <head> later on, so keep
  // the tag pinned rather than patching it only once.
  function isViewportRelated(node) {
    return (
      node.nodeType === Node.ELEMENT_NODE &&
      (node.matches('meta[name="viewport"], head') ||
        node.querySelector('meta[name="viewport"]') !== null)
    );
  }

  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes') {
        if (mutation.target.nodeName === 'META') setViewport();
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (isViewportRelated(node)) {
          setViewport();
          return;
        }
      }
      for (const node of mutation.removedNodes) {
        if (isViewportRelated(node)) {
          setViewport();
          return;
        }
      }
    }
  }).observe(document, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['content', 'name'],
  });

  // The dialog is mounted after hydration, so it cannot be found in the
  // server-rendered markup. Retry briefly, then give up.
  let tries = 0;
  const poller = setInterval(() => {
    tries += 1;
    if (hideMobileBlock() || tries >= 30) clearInterval(poller);
  }, 500);

  addEventListener('DOMContentLoaded', setViewport, { once: true });
  addEventListener('load', setViewport, { once: true });
})();
