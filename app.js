const screens = [...document.querySelectorAll(".screen")];
history.scrollRestoration = "manual";
const pageCounter = document.querySelector("#pageCounter");
const tickerText = document.querySelector("#tickerText");
const diaryReader = document.querySelector("#diaryReader");
const diaryReaderTitle = document.querySelector("#diaryReaderTitle");
const diaryReaderCrumb = document.querySelector("#diaryReaderCrumb");
const diaryReaderMeta = document.querySelector("#diaryReaderMeta");
const diaryReaderText = document.querySelector("#diaryReaderText");
const diaryArchive = window.DIARY_ARCHIVE || {};
const tickers = [
  "2008 年旧帖镜像恢复完成，请勿重复登录已注销账号。",
  "天涯旧帖首页恢复 205 条回复，楼主自述只听过南康的名字。",
  "2015 年调查者检索 344 条地方新闻目录，相关关键词命中为零。",
  "2009 年豆瓣帖恢复完成：‘旺仔’内容来自未署名的二次转述。",
  "贴吧 p/2290449729：登录、重置与注销可能并非同一人所为。",
  "贴吧 p/2409083427：五条网络传言的原始澄清正在载入。",
  "年轮公开日记目录恢复 20 条，加密日记标题仍可辨认。",
  "2015 年闲情旧帖恢复完成：泄露口令字段已永久遮挡。",
  "恢复完成。请关闭页面，不要继续刷新。"
];
let currentPage = 0;
let locked = false;
let diaryReturnFocus = null;

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
    diaryReaderMeta.textContent = "正文来源：天涯《南康的网络日记本》存档　｜　支线阅读不影响答题";
    diaryReaderText.textContent = content;
  } else {
    diaryReaderMeta.textContent = "年轮目录标题已恢复　｜　单篇正文没有留下可读取的存档";
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

function showPage(index, addHistory = true) {
  const next = Math.max(0, Math.min(index, screens.length - 1));
  screens.forEach((screen, i) => {
    screen.classList.toggle("active", i === next);
    screen.setAttribute("aria-hidden", i === next ? "false" : "true");
  });
  currentPage = next;
  locked = false;
  pageCounter.textContent = next === 0 ? "专题首页" : next === 8 ? "恢复完成" : `第 ${next} 页 / 共 7 页`;
  tickerText.textContent = tickers[next];
  document.title = next === 0
    ? "南康白起真相探寻 - 旧页恢复中心"
    : next === 8
      ? "该用户已注销 - ERROR 035"
      : `第 ${next} 页 - 南康白起真相探寻`;
  if (addHistory) history.pushState({ page: next }, "", `#page-${next}`);
  window.scrollTo({ top: 0, behavior: "auto" });
  screens[next].querySelector("h1, h2, button")?.focus({ preventScroll: true });
  if (next === 8) {
    document.querySelector("#endingTime").textContent = stamp();
  }
}

function handleAnswer(button) {
  if (locked || button.disabled) return;
  const quiz = button.closest(".quiz-box");
  const feedback = quiz.querySelector(".feedback");
  if (button.dataset.answer !== "correct") {
    button.classList.add("wrong");
    button.disabled = true;
    feedback.className = "feedback";
    feedback.textContent = "[系统提示] 答案与现有页面记录不符，请重新选择。";
    return;
  }

  locked = true;
  button.classList.add("right");
  quiz.querySelectorAll("[data-answer]").forEach(option => option.disabled = true);
  feedback.className = "feedback ok";
  feedback.textContent = "[验证通过] 正在打开下一份旧页……";
  window.setTimeout(() => showPage(currentPage + 1), 680);
}

document.addEventListener("click", event => {
  const diaryLink = event.target.closest("[data-diary]");
  if (diaryLink) {
    openDiary(diaryLink.dataset.diary, diaryLink);
    return;
  }
  const answer = event.target.closest("[data-answer]");
  if (answer) handleAnswer(answer);
  if (event.target.closest("[data-next]")) showPage(1);
});

document.querySelector("#closeDiaryTop").addEventListener("click", closeDiary);
document.querySelector("#closeDiaryBottom").addEventListener("click", closeDiary);
diaryReader.addEventListener("click", event => {
  if (event.target === diaryReader) closeDiary();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeDiary();
});

document.querySelector("#restartButton").addEventListener("click", () => {
  closeDiary();
  document.querySelectorAll("[data-answer]").forEach(button => {
    button.disabled = false;
    button.classList.remove("wrong", "right");
  });
  document.querySelectorAll(".feedback").forEach(item => {
    item.textContent = "";
    item.className = "feedback";
  });
  showPage(0);
});

window.addEventListener("popstate", event => {
  const page = Number(event.state?.page);
  if (Number.isInteger(page)) showPage(page, false);
});

document.querySelector("#todayText").textContent = stamp().slice(0, 10);
document.querySelector("#nowStamp").textContent = stamp();
history.replaceState({ page: 0 }, "", location.pathname + location.search);
showPage(0, false);
