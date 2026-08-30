const screens = [...document.querySelectorAll(".screen")];
history.scrollRestoration = "manual";
const pageCounter = document.querySelector("#pageCounter");
const tickerText = document.querySelector("#tickerText");
const tickers = [
  "2008 年旧帖镜像恢复完成，请勿重复登录已注销账号。",
  "帖子时间为 2008-03-27 20:34，部分楼层仍在恢复。",
  "搜索结果来自 3 月 26 日至 29 日共 344 条新闻目录。",
  "原回复未找到。转述内容不等于原始记录。",
  "系统检测到已注销账号在 2009 年重新上线。",
  "安全提示：泄露凭据已经隐藏，请勿尝试登录任何账号。",
  "加密日记《那个人》曾在密码重置后短暂解锁。",
  "本页有一条回复的时间晚于网页存档时间。",
  "恢复完成。请关闭页面，不要继续刷新。"
];
let currentPage = 0;
let locked = false;

function pad(value) {
  return String(value).padStart(2, "0");
}

function stamp(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
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
  const answer = event.target.closest("[data-answer]");
  if (answer) handleAnswer(answer);
  if (event.target.closest("[data-next]")) showPage(1);
});

document.querySelector("#restartButton").addEventListener("click", () => {
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
