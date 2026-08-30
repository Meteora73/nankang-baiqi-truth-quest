const screens = [...document.querySelectorAll(".screen")];
const pageCounter = document.querySelector("#pageCounter");
const tickerText = document.querySelector("#tickerText");
const archiveDock = document.querySelector("#archiveDock");
const diaryReader = document.querySelector("#diaryReader");
const diaryReaderTitle = document.querySelector("#diaryReaderTitle");
const diaryReaderCrumb = document.querySelector("#diaryReaderCrumb");
const diaryReaderMeta = document.querySelector("#diaryReaderMeta");
const diaryReaderText = document.querySelector("#diaryReaderText");
const deadDialog = document.querySelector("#deadDialog");
const deadDialogTitle = document.querySelector("#deadDialogTitle");
const deadDialogText = document.querySelector("#deadDialogText");
const recoveryStepNumber = document.querySelector("#recoveryStepNumber");
const recoveryProgressBar = document.querySelector("#recoveryProgressBar");
const recoveryForms = [...document.querySelectorAll("[data-recovery-form]")];
const diaryArchive = window.DIARY_ARCHIVE || {};
const storageKey = "tianya-mirror-recovery-v2";

const tickers = {
  0: "旧版社区仅供浏览，部分帖子及用户资料可能无法访问。",
  1: "旧帖首页恢复 205 条回复，全帖回复数记录为 437。",
  2: "地方新闻目录共恢复 344 条，站内关键词搜索服务已经停止。",
  3: "小组页面来自 2009 年缓存，原回复账号、日期和楼层缺失。",
  4: "用户中心正在维护，注销账号的登录记录可能存在延迟。",
  5: "本页所附外部证明链接大部分已经失效。",
  6: "网络日记目录已恢复，部分正文没有保存在镜像中。",
  7: "匿名讨论区只保留部分楼层，请谨慎辨别转载内容。",
  8: "用户中心：密保验证中。您可以返回已打开的页面查找答案。",
  9: "账号恢复完成。新的登录记录已经写入。"
};

let state = loadState();
let diaryReturnFocus = null;
let deadReturnFocus = null;

history.scrollRestoration = "manual";

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return {
      storyStarted: Boolean(saved?.storyStarted),
      recoveryStep: Math.max(0, Math.min(7, Number(saved?.recoveryStep) || 0))
    };
  } catch {
    return { storyStarted: false, recoveryStep: 0 };
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function stamp(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function openDiary(title, trigger) {
  const content = diaryArchive[title];
  diaryReturnFocus = trigger;
  diaryReaderTitle.textContent = title;
  diaryReaderCrumb.textContent = title;
  diaryReaderText.classList.toggle("missing", !content);

  if (content) {
    diaryReaderMeta.textContent = "正文来源：天涯《南康的网络日记本》存档";
    diaryReaderText.textContent = content;
  } else {
    diaryReaderMeta.textContent = "年轮目录标题已恢复，单篇正文没有留下可读取的存档";
    diaryReaderText.textContent = "该内容不存在\n\n目录记录仍在，但正文未被保存。";
  }

  diaryReader.hidden = false;
  document.body.classList.add("reader-open");
  document.querySelector("#closeDiaryTop").focus();
}

function closeDiary() {
  if (diaryReader.hidden) return;
  diaryReader.hidden = true;
  document.body.classList.remove("reader-open");
  diaryReturnFocus?.focus({ preventScroll: true });
  diaryReturnFocus = null;
}

function openDead(title, trigger, message = "您访问的页面未被镜像保存，或已被原作者删除。") {
  deadReturnFocus = trigger;
  deadDialogTitle.textContent = title ? `“${title}”无法显示` : "该内容不存在";
  deadDialogText.textContent = message;
  deadDialog.hidden = false;
  document.body.classList.add("reader-open");
  document.querySelector("#closeDeadBottom").focus();
}

function closeDead() {
  if (deadDialog.hidden) return;
  deadDialog.hidden = true;
  document.body.classList.remove("reader-open");
  deadReturnFocus?.focus({ preventScroll: true });
  deadReturnFocus = null;
}

function pageFromHash() {
  const match = location.hash.match(/^#page-(\d+)$/);
  return match ? Number(match[1]) : 0;
}

function showPage(requestedPage, addHistory = true) {
  let next = Math.max(0, Math.min(9, Number(requestedPage) || 0));
  if (next === 8 && state.recoveryStep >= 7) next = 9;

  screens.forEach(screen => {
    const active = Number(screen.dataset.page) === next;
    screen.classList.toggle("active", active);
    screen.setAttribute("aria-hidden", active ? "false" : "true");
  });

  archiveDock.hidden = !state.storyStarted;
  archiveDock.querySelectorAll("[data-goto]").forEach(button => {
    button.classList.toggle("current", Number(button.dataset.goto) === next);
  });

  if (next === 0) pageCounter.textContent = "社区首页";
  else if (next <= 7) pageCounter.textContent = `已打开档案 ${next} / 7`;
  else if (next === 8) pageCounter.textContent = `账号恢复：密保 ${state.recoveryStep + 1} / 7`;
  else pageCounter.textContent = "账号恢复完成";

  tickerText.textContent = tickers[next];
  document.title = next === 0
    ? "天涯社区旧版镜像 - 全球华人网上家园"
    : next === 8
      ? "找回账号 - 天涯用户中心"
      : next === 9
        ? "该用户已注销 - ERROR 035"
        : `${document.querySelector(`#page-${next} h1`)?.textContent?.trim() || "旧帖"} - 天涯社区旧版镜像`;

  if (addHistory) history.pushState({ page: next }, "", `#page-${next}`);
  window.scrollTo({ top: 0, behavior: "auto" });
  document.querySelector(`#page-${next} h1, #page-${next} h2, #page-${next} button`)?.focus({ preventScroll: true });

  if (next === 8) renderRecovery();
  if (next === 9) document.querySelector("#endingTime").textContent = stamp();
}

function beginStory() {
  state.storyStarted = true;
  saveState();
  showPage(1);
}

function renderRecovery() {
  const step = Math.min(state.recoveryStep, 6);
  recoveryForms.forEach((form, index) => {
    form.classList.toggle("active", index === step);
  });
  recoveryStepNumber.textContent = String(state.recoveryStep + 1);
  recoveryProgressBar.style.width = `${(state.recoveryStep / 7) * 100}%`;
  pageCounter.textContent = `账号恢复：密保 ${state.recoveryStep + 1} / 7`;
  const activeInput = recoveryForms[step]?.querySelector("input");
  window.setTimeout(() => activeInput?.focus({ preventScroll: true }), 0);
}

function answerValue(form) {
  const checked = form.querySelector("input[type=radio]:checked");
  if (checked) return checked.value;
  const textInput = form.querySelector("input:not([type=radio])");
  if (!textInput) return "";
  let value = textInput.value.trim().replace(/[《》\s]/g, "");
  if (["days", "dates", "floor"].includes(form.dataset.key)) value = value.replace(/\D/g, "");
  return value;
}

function submitRecovery(form) {
  const index = recoveryForms.indexOf(form);
  if (index !== state.recoveryStep) return;
  const feedback = form.querySelector(".recovery-feedback");
  const value = answerValue(form);

  if (!value) {
    feedback.className = "recovery-feedback";
    feedback.textContent = "请输入或选择一个答案。";
    return;
  }
  if (value !== form.dataset.answer) {
    feedback.className = "recovery-feedback error";
    feedback.textContent = "密保答案不匹配，请查阅公开资料后重试。";
    form.classList.add("shake");
    window.setTimeout(() => form.classList.remove("shake"), 320);
    return;
  }

  feedback.className = "recovery-feedback ok";
  feedback.textContent = "答案匹配，正在载入下一项……";
  state.recoveryStep += 1;
  saveState();
  window.setTimeout(() => {
    if (state.recoveryStep >= 7) showPage(9);
    else renderRecovery();
  }, 520);
}

document.addEventListener("click", event => {
  const diaryLink = event.target.closest("[data-diary]");
  if (diaryLink) {
    openDiary(diaryLink.dataset.diary, diaryLink);
    return;
  }

  const deadLink = event.target.closest("[data-dead-title]");
  if (deadLink) {
    openDead(deadLink.dataset.deadTitle, deadLink);
    return;
  }

  if (event.target.closest("[data-story-trigger]")) {
    beginStory();
    return;
  }

  const recoveryLink = event.target.closest("[data-recovery]");
  if (recoveryLink) {
    if (state.storyStarted) showPage(8);
    else openDead("账号找回", recoveryLink, "该用户不存在，或没有留下可用的账号恢复记录。");
    return;
  }

  const pageLink = event.target.closest("[data-goto]");
  if (pageLink) {
    const page = Number(pageLink.dataset.goto);
    if (page === 8 && !state.storyStarted) openDead("账号找回", pageLink, "该用户不存在，或没有留下可用的账号恢复记录。");
    else showPage(page);
  }
});

document.addEventListener("submit", event => {
  const form = event.target.closest("[data-recovery-form]");
  if (!form) return;
  event.preventDefault();
  submitRecovery(form);
});

document.querySelector("#closeDiaryTop").addEventListener("click", closeDiary);
document.querySelector("#closeDiaryBottom").addEventListener("click", closeDiary);
document.querySelector("#closeDeadTop").addEventListener("click", closeDead);
document.querySelector("#closeDeadBottom").addEventListener("click", closeDead);

diaryReader.addEventListener("click", event => {
  if (event.target === diaryReader) closeDiary();
});
deadDialog.addEventListener("click", event => {
  if (event.target === deadDialog) closeDead();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeDiary();
    closeDead();
  }
});

document.querySelector("#restartButton").addEventListener("click", () => {
  state = { storyStarted: false, recoveryStep: 0 };
  saveState();
  recoveryForms.forEach(form => {
    form.reset();
    form.querySelector(".recovery-feedback").textContent = "";
  });
  showPage(0);
});

window.addEventListener("popstate", event => {
  const page = Number.isInteger(Number(event.state?.page)) ? Number(event.state.page) : pageFromHash();
  showPage(page, false);
});

const initialPage = pageFromHash();
if (initialPage > 0) {
  state.storyStarted = true;
  saveState();
}
document.querySelector("#nowStamp").textContent = stamp();
history.replaceState({ page: initialPage }, "", initialPage ? `#page-${initialPage}` : location.pathname + location.search);
showPage(initialPage, false);
