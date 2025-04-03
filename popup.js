document.addEventListener("DOMContentLoaded", function () {
  let siteInput = document.getElementById("siteInput");
  let addSiteBtn = document.getElementById("addSite");
  let siteList = document.getElementById("siteList");

  function loadSites() {
      chrome.storage.sync.get(["blockedSites"], function (result) {
          siteList.innerHTML = "";
          let sites = result.blockedSites || [];
          sites.forEach(site => {
              let li = document.createElement("li");
              li.textContent = site;

              let removeBtn = document.createElement("button");
              removeBtn.textContent = "Remove";
              removeBtn.onclick = function () {
                  let updatedSites = sites.filter(s => s !== site);
                  chrome.storage.sync.set({ blockedSites: updatedSites }, function () {
                      loadSites();
                  });
              };

              li.appendChild(removeBtn);
              siteList.appendChild(li);
          });
      });
  }

  addSiteBtn.addEventListener("click", function () {
      let site = siteInput.value.trim();
      if (site) {
          chrome.storage.sync.get(["blockedSites"], function (result) {
              let sites = result.blockedSites || [];
              if (!sites.includes(site)) {
                  sites.push(site);
                  chrome.storage.sync.set({ blockedSites: sites }, function () {
                      siteInput.value = "";
                      loadSites();
                  });
              }
          });
      }
  });

  loadSites();
});
