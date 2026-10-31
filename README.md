# Montrose on small screens

`app.montrose.io` only shows its desktop interface when the browser viewport is
at least **1024 CSS pixels** wide. Below that it shows a "download the app"
screen instead.

This project makes the site usable on phones and other small screens by forcing
the page viewport to that desktop breakpoint (`width=1024`). The browser then
lays the site out as a desktop page and scales it to fit the screen, just like
Chrome's or Safari's "Request desktop website" feature. The primary approach
does not patch the page's markup, generated class names, or translations, so it
keeps working when Montrose updates the app.

## Userscript

Install [montrose-small-screen.user.js](./montrose-small-screen.user.js) with
Tampermonkey, Violentmonkey, Userscripts (iOS), or another userscript manager.

The script runs at `document-start` and keeps the viewport `<meta>` tag pinned
to `width=1024`, including if the app rewrites it.

## Bookmarklet

Useful on browsers where userscripts are not available, notably iOS Safari.

Open [montrose-small-screen.bookmarklet.html](./montrose-small-screen.bookmarklet.html)
in a desktop browser and drag the button onto your bookmarks bar. Alternatively,
create a bookmark and use the contents of
[montrose-small-screen.bookmarklet.txt](./montrose-small-screen.bookmarklet.txt)
as its URL:

```text
javascript:(()=>{const w=1024,c='width='+w,f=()=>{for(const m of document.querySelectorAll('meta[name=viewport]'))if(m.getAttribute('content')!==c)m.setAttribute('content',c)};f();new MutationObserver(f).observe(document,{childList:!0,subtree:!0,attributes:!0,attributeFilter:['content']});const h=()=>{if(innerWidth>=w){clearInterval(i);return}const l=document.querySelector('a[href*="apps.apple.com"],a[href*="play.google.com"]');if(l)for(let n=l;n&&n!==document.body;n=n.parentElement)if(getComputedStyle(n).position==='fixed'){n.style.setProperty('display','none','important');break}};const i=setInterval(h,500);setTimeout(()=>clearInterval(i),15000)})()
```

Then open `https://app.montrose.io` and tap the bookmark. It applies the same
viewport fix to the already-open page.

## Android

The userscript is the reliable option: Chrome for Android cannot run extensions,
so use a browser that can, such as Firefox for Android with Tampermonkey or
Violentmonkey. Chrome's "Desktop site" toggle is not enough on its own because it
ignores the viewport meta and lays the page out at about 980 CSS pixels, below
the site's 1024 pixel breakpoint.

Bookmarklets do work in Chrome for Android, with two catches:

- Chrome removes a pasted `javascript:` prefix. When editing the bookmark's URL,
  clear the field, type `javascript:` by hand, and paste the rest of the code
  after it. Reopen the bookmark afterwards to confirm the prefix survived; the
  drag-to-install HTML page does not work on Android.
- Tapping the bookmark in the bookmarks list often just navigates. Instead, open
  `https://app.montrose.io`, tap the address bar, type the bookmark's name, and
  choose it from the bookmark suggestions.

A bookmarklet runs after the page has loaded, so if Montrose has already rendered
its mobile layout, the bookmarklet may be too late. To check that it is running
at all, try `javascript:alert(location.host + ' ' + innerWidth)`; no alert means
the bookmark was not saved or invoked as JavaScript.

## Notes

- The page appears zoomed out, exactly like desktop mode. Pinch to zoom if
  needed.
- If a browser refuses to change the viewport after the page has loaded, the
  script falls back to hiding the blocking screen, so the page content is still
  reachable.
- The viewport approach does not depend on Montrose's build-specific CSS class
  names or text, so it should survive most site updates.

## License

CC-BY-SA 4.0
