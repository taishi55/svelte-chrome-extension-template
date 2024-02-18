import Browser from "webextension-polyfill";

Browser.action.onClicked.addListener(function (tab) {
  const mainPage = Browser.runtime.getURL("index.html");
  Browser.tabs.create({ url: mainPage });
});
