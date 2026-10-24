// Preispirat Filter - content.js
// Blendet Deal-Karten aus, deren Autor auf der Blockliste steht.

(function () {
  const STORAGE_KEY = "blockedUsers";
  let blockedUsers = [];
  let observer = null;

  function normalize(str) {
    return (str || "").trim().toLowerCase();
  }

  function loadBlockedUsers() {
    return new Promise((resolve) => {
      chrome.storage.sync.get([STORAGE_KEY], (result) => {
        blockedUsers = (result[STORAGE_KEY] || []).map(normalize);
        resolve();
      });
    });
  }

  // Heuristik: eine "Karte" ist ein Container, der ein Bild und einen
  // CHF-Preis enthält, eine gewisse Mindestgröße hat, aber NICHT zu groß
  // ist (sonst erwischt man auf Detailseiten aus Versehen den ganzen
  // Hauptbereich der Seite).
  const MAX_CARD_HEIGHT = 700;
  const MAX_CARD_WIDTH = 1100;

  function looksLikeCard(el) {
    if (!el || el.nodeType !== 1 || el === document.body) return false;
    const rect = el.getBoundingClientRect();
    if (rect.height < 60 || rect.width < 150) return false;
    if (rect.height > MAX_CARD_HEIGHT || rect.width > MAX_CARD_WIDTH) return false;
    const hasImg = !!el.querySelector("img");
    const text = el.textContent || "";
    const hasPrice = /CHF\s*[\d.,'’]+/.test(text) || /vor\s+\d+\s+(Minute|Stunde|Tag)/i.test(text);
    return hasImg && hasPrice;
  }

  function findCardAncestor(el) {
    let current = el;
    for (let i = 0; i < 12 && current; i++) {
      const rect = current.getBoundingClientRect ? current.getBoundingClientRect() : null;
      // Sobald wir einen Container erreichen, der schon zu groß ist,
      // lohnt es sich nicht mehr weiterzusuchen - lieber abbrechen als
      // zu viel auszublenden.
      if (rect && (rect.height > MAX_CARD_HEIGHT || rect.width > MAX_CARD_WIDTH)) {
        return null;
      }
      if (looksLikeCard(current)) return current;
      current = current.parentElement;
    }
    // Kein passend kleiner Container gefunden -> lieber nichts ausblenden,
    // statt versehentlich einen zu großen Bereich (oder die ganze Seite)
    // zu verstecken.
    return null;
  }

  function findUsernameNodes(root) {
    if (blockedUsers.length === 0) return [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const text = normalize(node.textContent);
        if (!text) return NodeFilter.FILTER_REJECT;
        return blockedUsers.includes(text)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    });
    const matches = [];
    let node;
    while ((node = walker.nextNode())) {
      matches.push(node);
    }
    return matches;
  }

  function hideMatchingCards(root) {
    if (blockedUsers.length === 0) return;
    const matches = findUsernameNodes(root);
    matches.forEach((textNode) => {
      const el = textNode.parentElement;
      if (!el) return;
      const card = findCardAncestor(el);
      if (!card) return;
      if (card.dataset.ppfHidden !== "true") {
        card.dataset.ppfHidden = "true";
        card.style.setProperty("display", "none", "important");
      }
    });
  }

  function unhideAll() {
    document.querySelectorAll('[data-ppf-hidden="true"]').forEach((el) => {
      el.style.removeProperty("display");
      delete el.dataset.ppfHidden;
    });
  }

  function runFilter() {
    hideMatchingCards(document.body);
  }

  function startObserving() {
    if (observer) observer.disconnect();
    observer = new MutationObserver((mutations) => {
      // Nur neu hinzugefügte Knoten durchsuchen, das ist günstiger,
      // fällt aber notfalls auf den ganzen body zurück.
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (node.nodeType === 1) hideMatchingCards(node);
        });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  async function init() {
    await loadBlockedUsers();
    runFilter();
    startObserving();
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes[STORAGE_KEY]) {
      unhideAll();
      blockedUsers = (changes[STORAGE_KEY].newValue || []).map(normalize);
      runFilter();
    }
  });

  init();
})();
