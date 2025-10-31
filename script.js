

document.addEventListener("DOMContentLoaded", () => {
  renderPage();
  let initialHeight = window.innerHeight;
  window.addEventListener("resize", debounce(() => {
    const currentHeight = window.innerHeight;
    const heightDifference = Math.abs(currentHeight - initialHeight);
    if (heightDifference > 500) {
      initialHeight = currentHeight;
    }
  }, 200));
});

async function renderPage() {

  await Promise.all([
    loadCSV("projectDt.csv").then((data) => {
      drawInfo(data);
      drawProjectCards(data);
    }),
    loadCSV("linksDt.csv").then((data) => {
      drawLinks(data, "div.collapsePanel", "div.collapseBtn");
    })
  ]);


}

function drawInfo(data) {
  const date = document.querySelector("i.date");
  const filterDate = data.filter(item => item.label === "time");
  if (date) date.textContent = filterDate[0].desc;
  const filterBk = data.filter(item => item.label === "background");
  const filterskillResc = data.filter(item => item.label === "skill");
  const filterBkResc = data.filter(item => item.label === "researchBk");

  drawIntroText(filterBk, "div.bkDesc");
  drawIntroText(filterskillResc, "div.skillDesc");
  drawIntroText(filterBkResc, "div.bkRsear");
  function drawIntroText(data, selector) {
    const bkSelector = document.querySelector(selector);
    data.forEach((item, index) => {
      const bkDescTxt = document.createElement("span");
      const txtBreak = document.createElement("br");
      bkDescTxt.textContent = item.desc;
      bkDescTxt.appendChild(txtBreak);
      if (bkSelector) bkSelector.appendChild(bkDescTxt);
    })
  }
  hoverImg(filterBk, "div.bkDesc");
  hoverImg(filterskillResc, "div.skillDesc");
  hoverImg(filterBkResc, "div.bkRsear");
}

function hoverImg(hoverDt, textBox) {
  const textHover = document.querySelectorAll(textBox + " > span");
  textHover.forEach((item, index) => {
    item.addEventListener("mouseover", (e) => {
      e.stopPropagation();
      if (hoverDt[index].cover === "") return;
      item.style.cursor = "pointer";
      item.style.textDecoration = "underline";
      item.style.textDecorationThickness = "2px";
      item.style.textUnderlineOffset = "5px";
      item.style.textDecorationColor = "#0004ffff";
      const hoverimg = document.createElement("img");
      hoverimg.classList.add("hoverImg");
      hoverimg.src = hoverDt[index].cover;
      const pos = {itemX: e.clientX, itemY: e.clientY}
      hoverimg.style.left = pos.itemX * 0.1 + "px";
      hoverimg.style.top = pos.itemY * 0.1 + "px";
      item.appendChild(hoverimg);
    })
    item.addEventListener("mouseout", () => {
      if (hoverDt[index].cover === "") return;
      item.querySelector(".hoverImg").remove();
      item.style.textDecoration = "none";
    })
  })
}

function drawProjectCards(data) {
  const wrkGalCtn = document.querySelector("section.stories > div.galleryCtn");
  const reascGalCtn = document.querySelector("section.articles > div.galleryCtn");
  const smtGalCtn = document.querySelector("section.something > div.galleryCtn");
  const cardBox = document.querySelector("section.stories > div.galleryCtn > .cardBox");
  const bodyBg = document.querySelector(".bodyBg");

  data.forEach((item, index) => {
    if (item.group === "stories") {
      const cardLabel = item.label;
      const mapCardlabel = [];
      for (let i = 0; i < cardLabel.length; i++) {
        mapCardlabel.push(cardLabel[i]);
      }
      const cardClsList = mapCardlabel.join("").split(",");
      if (item.link !== "") {
        const cardLink = document.createElement("a");
        cardLink.setAttribute("href", item.link);
        cardLink.setAttribute("target", "_blank");
        cardLink.setAttribute("rel", "noopener noreferrer");
        const card = document.createElement("div");
        card.style.backgroundImage = `url(${item.cover})`;
        card.classList.add("card");
        for (let i = 0; i < cardClsList.length; i++) {
          card.classList.add(cardClsList[i]);
        }
        const hoverIcon = document.createElement("div");
        hoverIcon.classList.add("hoverIcon");
        hoverIcon.style.backgroundImage = "url(./works/external-link.png)"
        card.appendChild(hoverIcon);
        card.addEventListener("mouseover", (e) => {
          e.stopPropagation();
          hoverIcon.classList.add("active");
        })
        card.addEventListener("mouseout", (e) => {
          e.stopPropagation();
          hoverIcon.classList.remove("active");
        })

        const cardTitle = document.createElement("div");
        cardTitle.classList.add("cardTitle");
        cardTitle.textContent = item.title;
        const cardRole = document.createElement("div");
        cardRole.classList.add("cardRole");
        cardRole.textContent = item.role;
        cardLink.appendChild(card);
        cardLink.appendChild(cardTitle);
        cardLink.appendChild(cardRole);
        if (wrkGalCtn) wrkGalCtn.appendChild(cardLink);
      } else {
        const cardCtn = document.createElement("div");
        cardCtn.classList.add("cardCtn");
        const card = document.createElement("div");
        card.classList.add("card");
        for (let i = 0; i < cardClsList.length; i++) {
          card.classList.add(cardClsList[i]);
        }
        card.style.backgroundImage = `url(${item.cover})`;
        const hoverIcon = document.createElement("div");
        hoverIcon.classList.add("hoverIcon");
        hoverIcon.style.backgroundImage = "url(./works/frames.png)"
        card.appendChild(hoverIcon);
        const cardTitle = document.createElement("div");
        cardTitle.classList.add("cardTitle");
        cardTitle.textContent = item.title;
        const cardRole = document.createElement("div");
        cardRole.classList.add("cardRole");
        cardRole.textContent = item.role;
        cardCtn.appendChild(card);
        cardCtn.appendChild(cardTitle);
        cardCtn.appendChild(cardRole);
        card.addEventListener("mouseover", (e) => {
          e.stopPropagation();
          hoverIcon.classList.add("active");
        })
        card.addEventListener("mouseout", (e) => {
          e.stopPropagation();
          hoverIcon.classList.remove("active");
        })
        if(!cardBox) return;
        cardCtn.addEventListener("click", (e) => {
          e.stopPropagation();
          cardBox.classList.add("active");
          bodyBg.classList.add("active");
          cardBox.innerHTML = "";
          const boxBd = document.createElement("div");
          boxBd.classList.add("boxBd");
          const elements = [item.element1, item.element2];
          elements.forEach((elem, index) => {
            const boxBdItem = document.createElement("div");
            boxBdItem.classList.add("boxBdItem");
            boxBdItem.innerHTML = elem;
            boxBd.appendChild(boxBdItem);
          });
          const closeBtn = document.createElement("div");
          closeBtn.classList.add("closeBtn");
          closeBtn.textContent = "+";
          cardBox.appendChild(boxBd);
          cardBox.appendChild(closeBtn);
          closeBtn.addEventListener("click", () => {
            cardBox.classList.remove("active");
            bodyBg.classList.remove("active");
          })
        })
        document.addEventListener("click", (e) => {
          e.stopPropagation();
          cardBox.classList.remove("active");
          bodyBg.classList.remove("active");
        })
        cardBox.addEventListener("click", (e) => {
          e.stopPropagation();
        });
        if (wrkGalCtn) wrkGalCtn.appendChild(cardCtn);
      }
    } else if (item.group === "articles") {
      const cardLink = document.createElement("a");
      cardLink.setAttribute("href", item.link);
      cardLink.setAttribute("target", "_blank");
      cardLink.setAttribute("rel", "noopener noreferrer");
      const card = document.createElement("div");
      card.classList.add("card");
      const boxHd = document.createElement("div");
      boxHd.classList.add("boxHd");
      boxHd.style.backgroundImage = `url(${item.cover})`;
      const boxBd = document.createElement("div");
      boxBd.classList.add("boxBd");
      boxBd.textContent = item.title;
      const boxFt = document.createElement("div");
      boxFt.classList.add("boxFt");
      boxFt.textContent = item.desc;
      const hoverIcon = document.createElement("div");
      hoverIcon.classList.add("hoverIcon");
      hoverIcon.style.backgroundImage = "url(./works/external-link.png)"
      card.appendChild(boxBd);
      card.appendChild(boxHd);
      card.appendChild(boxFt);
      card.appendChild(hoverIcon);
      cardLink.appendChild(card);
      cardLink.addEventListener("mouseover", (e) => {
        e.stopPropagation();
        boxFt.classList.add("active");
        hoverIcon.classList.add("active");
      })
      cardLink.addEventListener("mouseout", (e) => {
        e.stopPropagation();
        boxFt.classList.remove("active");
        hoverIcon.classList.remove("active");
      })
      if (reascGalCtn) reascGalCtn.appendChild(cardLink);
    } else if (item.group === "something") {
      if (item.element1.includes("mp4")) {
        const card = document.createElement("div");
        card.classList.add("card");
        const cardVd = document.createElement("video");
        cardVd.classList.add("insertVideo");
        cardVd.autoplay = true;
        cardVd.loop = true;
        cardVd.muted = true;
        cardVd.playsInline = true;
        cardVd.preload = "auto";
        const cardSrc = document.createElement("source");
        cardSrc.setAttribute("src", item.element1);
        cardSrc.setAttribute("type", "video/mp4");
        cardVd.appendChild(cardSrc);
        const soundCtrl = document.createElement("div");
        soundCtrl.classList.add("soundCtrl");
        soundCtrl.addEventListener("click", async (e) => {
          e.stopPropagation();
          cardVd.muted = !cardVd.muted;

          if (!cardVd.muted) {
            soundCtrl.classList.add("active");
            try {
              await cardVd.play(); 
            } catch (err) {
              console.error("Error playing unmuted video:", err);
            }
          } else {
            soundCtrl.classList.remove("active");
          }
        });
        const imgCaption = document.createElement("div");
        imgCaption.classList.add("imgCaption");
        imgCaption.textContent = item.title;
        card.appendChild(imgCaption);
        card.appendChild(cardVd);
        card.appendChild(soundCtrl);
        const playVideo = async () => {
          try {
            await cardVd.play();
          } catch (err) {
            console.error("Video autoplay was prevented:", err);
          }
        };

        playVideo();
        if (smtGalCtn) smtGalCtn.appendChild(card);
      } else {
        const card = document.createElement("div");
        card.classList.add("card");
        card.style.cursor = "unset";
        const cardImg = document.createElement("div");
        cardImg.classList.add("cardImg");
        cardImg.style.backgroundImage = `url(${item.element1})`;
        const imgCaption = document.createElement("div");
        imgCaption.classList.add("imgCaption");
        imgCaption.textContent = item.title;
        card.appendChild(imgCaption);
        card.appendChild(cardImg);
        if (smtGalCtn) smtGalCtn.appendChild(card);
      }
    }
  })
  const storyDt = data.filter(item => item.group === "stories");
  filterCards(storyDt, ".stories .card", ".stories .cardFilter")
}

function filterCards(getDt, selector, filterSelector) {
  const cardFilter = document.querySelector(filterSelector);
  const cards = document.querySelectorAll(selector);
  const getLabels = getDt.map(item => item.label);
  const getLabelList = [];
  for (let i = 0; i < getLabels.length; i++) {
    getLabels[i].split(",").forEach(item => {
      getLabelList.push(item);
    })
  }
  const getLabelSet = new Set(getLabelList);
  const getLabelArr = [...getLabelSet];

  if (!cardFilter) return
  getLabelArr.forEach((item, index) => {
    const filterBtn = document.createElement("div");
    filterBtn.classList.add("filterBtn");
    filterBtn.textContent = item;
    const filterDot = document.createElement("div");
    filterDot.classList.add("filterDot");
    if (cardFilter) cardFilter.appendChild(filterBtn);
    filterBtn.appendChild(filterDot);
  })
  const allFilterBtns = cardFilter.querySelectorAll(".filterBtn");
  allFilterBtns.forEach((item, index) => {
    item.addEventListener("click", () => {
      const isAlreadyActive = item.classList.contains("active");
      allFilterBtns.forEach(btn => {
        btn.classList.remove("active");
      });
      if (isAlreadyActive) {
        cards.forEach(card => {
          card.classList.remove("unactive");
          const parent = card.parentElement;
          if (parent && parent.tagName === 'A' || parent.classList.contains("cardCtn")) {
            parent.classList.remove("unactive");
          }
        });
      } else {
        item.classList.add("active");
        cards.forEach(card => {
          const parent = card.parentElement;
          if (!card.classList.contains(item.textContent)) {
            card.classList.add("unactive"); 
            if (parent && parent.tagName === 'A' || parent.classList.contains("cardCtn")) {
              parent.classList.add("unactive");
            }
          } else {
            card.classList.remove("unactive");
            if (parent && parent.tagName === 'A' || parent.classList.contains("cardCtn")) {
              parent.classList.remove("unactive");
            }
          }
        });
      }
    });
  })
}

function drawLinks(data, collaSelector, selector){
  const collapseBtn = document.querySelectorAll(selector);
  const collapsePanel = document.querySelectorAll(collaSelector);
  const urldate = document.querySelector("div.urldate");
  const collapseArrow = document.querySelectorAll(".btnArr")
  if(urldate) urldate.textContent = data[0].updated;

  const getLabels = data.map(item => item.labels);
  const getLabelList = [];
  for (let i = 0; i < getLabels.length; i++) {
    getLabels[i].split(",").forEach(item => {
      getLabelList.push(item);
    })
  }
  const getLabelSet = new Set(getLabelList);
  const getLabelArr = [...getLabelSet];
  getLabelArr.sort();

  getLabelArr.forEach((item, index) => {
    const filterLinks = data.filter(item => item.labels.includes(getLabelArr[index]));
    if(collapsePanel[index] && collapseBtn[index]) drawLinks(filterLinks, collapsePanel[index]);
  })
  function drawLinks(filterDt, colaPn){
    const linkCtn = document.createElement("div");
    linkCtn.classList.add("linkCtn");
    filterDt.forEach((item, index) => {
      const link = document.createElement("a");
      link.setAttribute("href", item.link);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
      const linkTitle = document.createElement("div");
      linkTitle.classList.add("linkTitle");
      linkTitle.textContent = item.title;
      const linkDesc = document.createElement("div");
      linkDesc.classList.add("linkDesc");
      linkDesc.textContent =  item.description;
      link.appendChild(linkTitle);
      link.appendChild(linkDesc);
      if(item.collection === ""){
        linkCtn.appendChild(link);
      }else{
        const linkCollection = document.createElement("div");
        linkCollection.classList.add("linkCollection");
        linkCollection.textContent = item.collection;
        linkCollection.appendChild(link);
        linkCtn.appendChild(linkCollection);
      }
    })
    colaPn.appendChild(linkCtn);
  }
  
  collapseBtn.forEach((item, index) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      if(collapsePanel[index].classList.contains("panelOpen")){
        collapsePanel[index].classList.remove("panelOpen");
        collapsePanel[index].style.maxHeight = null;
        collapseArrow[index].style.transform = "rotate(0deg)";
      }else{
        collapsePanel[index].classList.add("panelOpen");
        collapsePanel[index].style.maxHeight = "60vh";
        collapseArrow[index].style.transform = "rotate(180deg)";
        const selectAllLinks = document.querySelectorAll(".linkTitle, .linkDesc");
        selectAllLinks.forEach(item => {
          const isOverFlow = item.scrollWidth > item.clientWidth;
          if(isOverFlow){
            const originalText = item.textContent;
            item.textContent = "";
            item.innerHTML = `
              <span class="scrollTxt">
                <span>${originalText} &nbsp;&nbsp;</span>
                <span>${originalText} &nbsp;&nbsp;</span>
              </span>
            `;
          }
        });
      }
    });
  });
}


async function loadHTML(fileUrl, containerId) {
  try {
    const response = await fetch(fileUrl);
    const html = await response.text();
    const container = document.getElementById(containerId);
    let shadowRoot = container.shadowRoot;
    if (!shadowRoot) {
      shadowRoot = container.attachShadow({ mode: 'open' });
    }
    shadowRoot.innerHTML = html;
  } catch (error) {
    console.error(`Error loading ${fileUrl} into shadow root of ${containerId}:`, error);
  }
}


async function loadSVG(url, containerId) {
  return new Promise(async (resolve, reject) => {
    let container = document.getElementById(containerId);
    if (!container.shadowRoot) {
      container.attachShadow({ mode: 'open' });
    } else if (container.getAttribute('data-loaded') === 'true') {
      resolve(); return;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`storiespace failed: ${url}`);
      const svgText = await response.text();
      container.shadowRoot.innerHTML = svgText;
      container.setAttribute('data-loaded', 'true');
      resolve();
    } catch (err) {
      console.error(`Error loading ${url}:`, err);
      reject(err);
    }
  });
}


async function loadCSV(url) {
  try {
    const response = await fetch(url);
    const data = await response.text();
    return parseCSV(data);
  } catch (error) {
    console.error("Error fetching data");
  }
}

function parseCSV(csv, delimiter = ",") {
  const pattern = new RegExp(
    `(${delimiter}|\\r?\\n|\\r|^)` +
    `(?:"([^"]*(?:""[^"]*)*)"|([^"${delimiter}\\r\\n]*))`,
    "gi"
  );
  const rows = [[]];
  let matches = null;
  while ((matches = pattern.exec(csv))) {
    const matchedDelimiter = matches[1];
    if (matchedDelimiter.length && matchedDelimiter !== delimiter) {
      rows.push([]);
    }
    let value;
    if (matches[2] !== undefined) {
      value = matches[2].replace(/""/g, '"');
    } else {
      value = matches[3];
    }
    rows[rows.length - 1].push(value);
  }
  const headers = rows.shift();
  return rows.map((row) => {
    return headers.reduce((acc, header, i) => {
      acc[header] = row[i] ?? "";
      return acc;
    }, {});
  });
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}