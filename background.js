function updateRules(blockedSites) {
  let rules = blockedSites.map((site, index) => ({
    id: index + 1,
    priority: 1,
    action: { type: "block" },
    condition: { urlFilter: site, resourceTypes: ["main_frame"] }
  }));

  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: rules.map(rule => rule.id),
    addRules: rules
  });

  console.log("Updated blocking rules:", rules);
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get("blockedSites", function (result) {
    let blockedSites = result.blockedSites || [];
    updateRules(blockedSites);
  });
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.blockedSites) {
    updateRules(changes.blockedSites.newValue || []);
  }
});
