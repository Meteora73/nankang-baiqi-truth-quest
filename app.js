const cases = [
  {
    label: "档案一 · 2004 年专栏",
    question: "恢复出的最早书评写着：“白起的狐狸终于回来了。”这条 2004 年记录至少能说明什么？",
    options: ["故事里确实存在一个持续创作的作者账号", "它能证明所有后来的传闻", "书评来自 2015 年伪造"],
    answer: 0,
    result: "你恢复了八部作品的目录。页面能证明这个虚构世界里曾有持续创作的账号，却无法替后来的死亡故事作证。屏幕右下角闪过一句不属于页面的文字：“先让你相信他存在。”",
    tags: ["取材：同期创作痕迹", "恢复率 17%", "陌生文本 +1"]
  },
  {
    label: "档案二 · 十五天",
    question: "死亡帖写“3 月 9 日离开，3 月 27 日找到，漂流十五天”。哪处异常最直接？",
    options: ["3 月没有 27 日", "两个日期实际相隔 18 天", "十五是偶数"],
    answer: 1,
    result: "15 和 18 同时出现在页面缓存中。你删除“十五”，它会在下一行重新出现；你删除日期，页面却保持沉默。系统似乎更在意一个好记的数字，而不是能对上的时间。",
    tags: ["取材：15/18 天矛盾", "恢复率 33%", "自动回填"]
  },
  {
    label: "档案三 · 某网友",
    question: "2009 年页面开头只有一句：“以下摘自某网友的回贴。”要判断“旺仔”是否为直接证人，最缺少什么？",
    options: ["更悲伤的文笔", "原账号、日期、楼层和原帖链接", "更多转发数量"],
    answer: 1,
    result: "你搜索了整台服务器，没有找到那位“某网友”。每个引用都指向另一个引用，最终绕回当前页面。此时页面昵称栏短暂显示为你的访客编号。",
    tags: ["取材：二手转述结构", "恢复率 50%", "引用闭环"]
  },
  {
    label: "档案四 · 共用密码",
    question: "泄露库显示六个纪念账号使用同一密码。最合理的调查动作是什么？",
    options: ["直接认定六人是同一个人", "只把它视为账号关联线索，继续查注册与登录时间", "用密码登录所有账号"],
    answer: 1,
    result: "注册时间排成一条诡异的队列：它们都在死亡帖之后出现。你没有尝试登录，但服务器弹出提示：“密码正确。”输入框里已经有十二个圆点。",
    tags: ["取材：关联账号同密码", "恢复率 67%", "未输入的密码"]
  },
  {
    label: "档案五 · 零命中",
    question: "地方新闻存档连续四天共 344 条，找不到传闻中的打捞消息。最稳妥的结论是？",
    options: ["传闻绝对不可能发生", "公开报道证据缺位，故事链不能靠它坐实", "344 条新闻都被同一人删除"],
    answer: 1,
    result: "你不能从零命中推出绝对不存在，但能确认：完整故事并没有它声称拥有的新闻支撑。第 345 条新闻忽然出现，标题是《档案修复员失踪》，发布日期显示为今天。",
    tags: ["取材：地方媒体零命中", "恢复率 83%", "第 345 条"]
  },
  {
    label: "档案六 · 注销后的登录",
    question: "账号已注销，却在 2009 年留下“登录过”的页面。结合全部档案，哪种虚构解释最能串起异常？",
    options: ["账号本人从河中登录", "一个利用共用密码和旧文本自我复制的叙事程序", "所有时间戳都没有意义"],
    answer: 1,
    result: "最后一份文件解密成功。程序以作品目录确认“人物存在”，以匿名悼文生成“人物结局”，再用共用密码召回纪念账号。它最擅长把无法核实的空白，补成人人都会记住的细节。",
    tags: ["虚构真相", "恢复率 100%", "访客已收录"]
  }
];

const boundaries = [
  { mark: "实", title: "现实资料中的结构", note: "2004 年创作痕迹、2008 年帖子、2009 年登录讨论、2015 年公开追查等时间节点来自所提供材料。" },
  { mark: "实", title: "可转化的矛盾", note: "“十五天”与日期实际相隔十八天、地方新闻档案零命中、二手引文缺少原帖，来自资料中的核查问题。" },
  { mark: "实", title: "账号关联线索", note: "多个相关账号曾被记录为使用相同密码。游戏不会展示或保存任何真实密码。" },
  { mark: "虚", title: "会复制故事的程序", note: "完全虚构。现实资料没有证明存在任何自动生成悼文或操控账号的系统。" },
  { mark: "虚", title: "访客被系统记住", note: "完全虚构。页面只用 localStorage 保存游戏进度，不收集姓名、账号、摄像头或麦克风信息。" },
  { mark: "虚", title: "恐怖文本与最终结局", note: "所有弹窗、系统对白、人物动机、因果关系和“第 345 条新闻”都是为游戏创作的情节。" }
];

const caseList = document.querySelector("#caseList");
const progressBar = document.querySelector("#progressBar");
const progressText = document.querySelector("#progressText");
const headerProgress = document.querySelector("#headerProgress");
const verdict = document.querySelector("#verdict");
const sourceList = document.querySelector("#sourceList");
const sourcesDialog = document.querySelector("#sourcesDialog");
const fictionGate = document.querySelector("#fictionGate");
const gameShell = document.querySelector("#gameShell");
let solved = Number.parseInt(localStorage.getItem("nkHorrorSolved") || "0", 10);
if (!Number.isFinite(solved) || solved < 0 || solved > cases.length) solved = 0;

function enterGame() {
  document.body.classList.remove("gate-open");
  fictionGate.classList.add("is-dismissed");
  gameShell.setAttribute("aria-hidden", "false");
  window.setTimeout(() => document.querySelector("#top").scrollIntoView(), 260);
}

function renderCases() {
  caseList.innerHTML = cases.map((item, index) => {
    const isSolved = index < solved;
    const isActive = index === solved;
    const state = isSolved ? "is-solved" : isActive ? "is-active" : "is-locked";
    const controls = (isSolved || isActive)
      ? `<div class="options" role="group" aria-label="选择答案">${item.options.map((option, optionIndex) => `<button class="option${isSolved && optionIndex === item.answer ? " correct" : ""}" type="button" data-case="${index}" data-option="${optionIndex}" ${isSolved ? "disabled" : ""}>${option}</button>`).join("")}</div>`
      : `<p class="locked-message"><span aria-hidden="true">⊘</span> 上一份档案尚未恢复</p>`;
    return `<article class="case-card ${state}" data-case-card="${index}">
      <div class="case-index"><span>FILE</span><strong>${String(index + 1).padStart(2, "0")}</strong><small>${isSolved ? "已恢复" : isActive ? "读取中" : "损坏"}</small></div>
      <div class="case-content">
        <div class="case-type">${item.label}</div>
        <h3>${item.question}</h3>
        ${controls}
        <div class="case-result${isSolved ? " show" : ""}" aria-live="polite">
          <strong>${isSolved ? "✓ 文件恢复完成" : ""}</strong>
          <p>${isSolved ? item.result : ""}</p>
          ${isSolved ? item.tags.map(tag => `<span class="evidence-tag">${tag}</span>`).join("") : ""}
        </div>
      </div>
    </article>`;
  }).join("");
  updateProgress();
}

function answerCase(button) {
  const caseIndex = Number(button.dataset.case);
  const optionIndex = Number(button.dataset.option);
  if (caseIndex !== solved) return;
  const card = button.closest(".case-card");
  const result = card.querySelector(".case-result");
  card.querySelectorAll(".option").forEach(option => option.classList.remove("incorrect"));
  if (optionIndex !== cases[caseIndex].answer) {
    button.classList.add("incorrect");
    card.classList.add("glitch-once");
    result.classList.add("show");
    result.querySelector("strong").textContent = "文件拒绝了这个答案";
    result.querySelector("p").textContent = caseIndex === 5
      ? "屏幕显示：不要把传闻当成超自然解释。真正可怕的是一个故事如何借人群继续存在。"
      : "再检查时间、出处或论证边界。错误答案不会锁死档案。";
    window.setTimeout(() => card.classList.remove("glitch-once"), 520);
    return;
  }
  button.classList.add("correct");
  card.querySelectorAll(".option").forEach(option => option.disabled = true);
  result.classList.add("show");
  result.querySelector("strong").textContent = "✓ 文件恢复完成";
  result.querySelector("p").textContent = cases[caseIndex].result;
  result.insertAdjacentHTML("beforeend", cases[caseIndex].tags.map(tag => `<span class="evidence-tag">${tag}</span>`).join(""));
  solved += 1;
  localStorage.setItem("nkHorrorSolved", String(solved));
  updateProgress();
  window.setTimeout(() => {
    renderCases();
    const nextTarget = solved === cases.length ? verdict : document.querySelector(`[data-case-card="${solved}"]`);
    nextTarget?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (solved === cases.length) runEnding();
  }, 820);
}

function runEnding() {
  const line = document.querySelector("#terminalLine");
  const messages = [
    "正在把访客加入纪念账号列表…",
    "检测到访客拒绝共用密码。",
    "上传失败。",
    "你暂时仍是你。"
  ];
  let index = 0;
  const timer = window.setInterval(() => {
    index += 1;
    if (index >= messages.length) return window.clearInterval(timer);
    line.textContent = messages[index];
  }, 1250);
}

function updateProgress() {
  const percent = Math.round((solved / cases.length) * 100);
  progressBar.style.width = `${percent}%`;
  progressText.textContent = `${solved} / ${cases.length}`;
  headerProgress.textContent = solved === 0 ? "访客模式" : solved === cases.length ? "访客_00035" : `已恢复 ${solved} / ${cases.length}`;
  verdict.hidden = solved !== cases.length;
}

function renderBoundaries() {
  sourceList.innerHTML = boundaries.map(item => `<article class="source-item">
    <span class="grade ${item.mark === "实" ? "grade-b" : "grade-d"}">${item.mark}</span>
    <div><strong>${item.title}</strong><p>${item.note}</p></div>
  </article>`).join("");
}

document.querySelector("#enterGame").addEventListener("click", enterGame);
document.addEventListener("click", event => {
  const option = event.target.closest(".option");
  if (option) answerCase(option);
  if (event.target.closest("[data-open-sources]")) sourcesDialog.showModal();
});
document.querySelector("#closeSources").addEventListener("click", () => sourcesDialog.close());
document.querySelector("#closeSourcesBottom").addEventListener("click", () => sourcesDialog.close());
sourcesDialog.addEventListener("click", event => { if (event.target === sourcesDialog) sourcesDialog.close(); });
document.querySelector("#restartButton").addEventListener("click", () => {
  solved = 0;
  localStorage.removeItem("nkHorrorSolved");
  renderCases();
  document.querySelector("#cases").scrollIntoView({ behavior: "smooth" });
});

renderBoundaries();
renderCases();
