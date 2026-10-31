// ==UserScript==
// @name         Montrose on small screens
// @name:sv      Montrose på liten skärm
// @namespace    thomasa88
// @version      2.0.0
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

  // Last-resort fallback for browsers that ignore viewport changes (some
  // in-app browsers). The blocking screen is the only fixed layer with App
  // Store / Google Play links, so finding it this way does not depend on
  // class names or UI language.
  function hideMobileBlock() {
    const storeLink = document.querySelector(
      'a[href*="apps.apple.com"], a[href*="play.google.com"]',
    );
    if (!storeLink) return;

    for (let node = storeLink; node && node !== document.body; node = node.parentElement) {
      if (getComputedStyle(node).position === 'fixed') {
        node.style.setProperty('display', 'none', 'important');
        return;
      }
    }
  }

  function apply() {
    setViewport();
    if (window.innerWidth < DESKTOP_WIDTH) hideMobileBlock();
  }

  apply();

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
        if (mutation.target.nodeName === 'META') apply();
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (isViewportRelated(node)) {
          apply();
          return;
        }
      }
      for (const node of mutation.removedNodes) {
        if (isViewportRelated(node)) {
          apply();
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

  addEventListener('DOMContentLoaded', apply, { once: true });
  addEventListener('load', apply, { once: true });
})();
