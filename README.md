# 🏴‍☠️ Preispirat Filter

**A lightweight Chrome extension that hides deal posts from specific users on [preispirat.ch](https://www.preispirat.ch).**

> For a cleaner, more personal deal overview – without spam and unwanted posts.

[![Chrome](https://img.shields.io/badge/Chrome-Extension-blue?logo=googlechrome&style=for-the-badge)](https://chromewebstore.google.com/detail/preispirat-filter/jnkicobhnhdfncbelaloeldemookpkho)
[![Brave](https://img.shields.io/badge/Brave-Extension-orange?logo=brave&style=for-the-badge)](https://chromewebstore.google.com/detail/preispirat-filter/jnkicobhnhdfncbelaloeldemookpkho)
[![Manifest](https://img.shields.io/badge/Manifest-V3-green?style=for-the-badge)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

---

## ✨ Features

- 🚫 Block any number of usernames (and remove them again)
- 🔄 Automatic detection of newly loaded deals (Infinite Scroll / MutationObserver)
- 📱 Settings are synced across devices via `chrome.storage.sync`
- 🔒 100% local – no data is sent to third parties
- 🎨 Simple, clean popup

## 📦 Installation (Developer Mode)

1. Clone the repository or download it as a ZIP.
2. Go to `chrome://extensions` in Chrome.
3. Enable **Developer mode** in the top right.
4. Click **Load unpacked** and select the **root folder** of this repository (where `manifest.json` is located).
5. The extension will appear in the toolbar (pin it if needed).

> **Tip:** The extension only works on `https://www.preispirat.ch/*`.

## 💻 Usage

1. Click the extension icon.
2. Enter a username (e.g. `Arlinda`) and confirm with **Add** or Enter.
3. Reload preispirat.ch or continue scrolling – posts from these users are automatically hidden.
4. Click the **✕** next to a name to remove it.

## 🛠️ How It Works

The extension looks for text nodes that exactly match a blocked username and hides the surrounding deal container.

Detection is based on a heuristic (`looksLikeCard` in `content.js`):
- Container with an image + price (CHF) or time indication
- Limited size so that not too much is accidentally hidden

Since preispirat.ch can change its structure, the logic is intentionally conservative.

## 🔒 Privacy

- The blocklist is stored exclusively locally (or via Chrome Sync).
- No user data is collected, transmitted, or sold.
- The extension only has access to `preispirat.ch` and the Storage API.

## 📸 Screenshots

![Popup](screenshots/popup.png)

*Hide users specifically – directly via the popup*

## 🛤️ Chrome Web Store

The extension is available on the Chrome Web Store:

**[Install Preispirat Filter](https://chromewebstore.google.com/detail/preispirat-filter/jnkicobhnhdfncbelaloeldemookpkho)**

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

**Unofficial community tool** – not affiliated with preispirat.ch or Preispirat GmbH.
