const screens = [...document.querySelectorAll(".screen")];
const pageCounter = document.querySelector("#pageCounter");
const tickerText = document.querySelector("#tickerText");
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
const threadReplies = document.querySelector("#threadReplies");
const threadPagers = [document.querySelector("#threadPagerTop"), document.querySelector("#threadPagerBottom")];
const threadOwnerPost = document.querySelector("#threadOwnerPost");
const floorJumpForm = document.querySelector("#floorJumpForm");
const floorJumpInput = document.querySelector("#floorJumpInput");
const diaryArchive = window.DIARY_ARCHIVE || {};
const threadSource = window.THREAD_SOURCE || { ownerPost: "", replies: [] };
const sourceReplies = new Map((threadSource.replies || []).map(reply => [Number(reply.floor), reply]));
const threadPageSize = 200;
const threadPageCount = 3;
const storageKey = "yuanan-forum-mystery-v4";

const tickers = {
  0: "旧版社区仅供浏览，部分帖子及用户资料可能无法访问。",
  1: "《长沙的南康，一路走好》共恢复 437 条回复，部分楼层带有站外链接。",
  2: "正在访问站外网页：地方新闻目录镜像。",
  3: "正在访问站外网页：2009 年兴趣小组缓存。",
  4: "正在访问站外网页：账号登录记录讨论帖。",
  5: "正在访问站外网页：网络传言澄清帖。",
  6: "正在访问站外网页：年轮网络日记本。",
  7: "正在访问站外网页：2015 年匿名调查楼。",
  8: "用户中心：密保验证中。您可以返回原帖继续查找链接。",
  9: "账号恢复完成。新的登录记录已经写入。",
  10: "远岸社区主题浏览：帖子内容来自旧版镜像。"
};

const threadStoryReplies = {
  205: { user: "无名氏", time: "2015-05-27 23:44", link: true, html: "这里有人把学校名单、344 条新闻目录、旧帖转载和账号登录记录放在一楼里追查，楼数很长：<button class=\"external-link\" type=\"button\" data-goto=\"7\">[站外链接] 2015 年匿名调查楼</button>" },
  224: { user: "新闻目录组", time: "2015-05-28 00:12", html: "查到的只是目录零命中。请不要把‘没有找到’改写成‘已经证明不存在’。" },
  270: { user: "别再试密码", time: "2015-05-28 09:41", html: "有人用泄露出来的旧凭据做登录验证。每验证一次，后台就会多一个更晚的登录时间。后来的人又拿这个时间当作旧证据。" },
  318: { user: "纸灰", time: "2015-05-28 18:27", html: "我点开日记目录时，明明只有标题的《那个人》闪了一下正文。刷新以后又没了。可能只是缓存吧。" },
  355: { user: "guest_00034", time: "2015-05-29 00:34", html: "调查楼最后可复核的登录在 1894 楼，1900 楼那条会显示访问者自己的时间。别把它当原始回复。" },
  401: { user: "最后一页", time: "2015-05-29 03:11", html: "翻到这里的人已经很少了。首页显示本帖 437 回复，可我刚才明明看到的是 438。" },
  436: { user: "系统消息", time: "2015-05-29 03:34", html: "该用户的恢复记录已重新生成。请求编号：035。" },
  437: { user: "南康好友", time: "2015-05-29 03:35", link: true, html: "你已经打开了所有被转贴过的页面。还要继续登录吗？<button class=\"external-link danger-link\" type=\"button\" data-goto=\"8\">[用户中心] 恢复“南康好友”账号</button>" }
};

const threadClueAttachments = {
  35: { page: 6, label: "康康的网络日记本", note: "本楼后来被镜像管理员关联到一份旧日记目录。" },
  63: { page: 2, label: "2008 年 3 月新闻目录检索", note: "相关页面：地方新闻目录镜像。" },
  88: { page: 3, label: "命理研究小组旧页缓存", note: "相关页面：一段来源不明的完整转述。" },
  126: { page: 4, label: "账号上线与注销记录", note: "相关页面：旧账号登录记录讨论。" },
  173: { page: 5, label: "关于各种网络传言的实证", note: "相关页面：网友整理的逐条澄清。" }
};

const genericReplyTexts = [
  "愿一路走好。第一次看到这个名字。",
  "从别的论坛转来的，先留个脚印，晚上再看。",
  "楼主有没有更早的原帖地址？转载已经看不出出处了。",
  "看完心里很难受，希望家人平安。",
  "不要急着下结论，等能确认来源的人来补充吧。",
  "那几年很多个人主页都关了，网页快照也不完整。",
  "同问，有人保存过当年的日记吗？",
  "只看过文章，不认识作者本人。",
  "前面的链接打不开，提示页面不存在。",
  "传得越久，原话和网友留言越容易混在一起。",
  "留名。以后如果链接恢复了请提醒我。",
  "楼里有些日期对不上，可能是不同网站的记录。",
  "看到这里才发现自己记住的很多细节都来自转述。",
  "别再尝试登录旧账号了，让它停在那里吧。",
  "图片已经失效，只剩文件名。",
  "有人能整理一下哪些是原文、哪些是后来补写的吗？"
];

const replyUsers = ["江边旧客", "北城以北", "雨夜书生", "小小马甲", "未注册用户", "纸飞机", "往事如烟", "蓝色信箱", "路过的人", "沉默看客", "旧网页", "南方来信"];

const ordinaryThreads = {
  "十年前的网吧，现在还有人记得吗": { board: "远岸杂谈", author: "南城旧事", time: "2015-05-29 12:37", views: 1260, replies: 84, body: ["整理旧硬盘时翻出一张 2005 年网吧会员卡。那时候开机第一件事是上论坛、挂 QQ，再给博客换一首背景音乐。", "大家还记得自己常去的网吧叫什么吗？"], replySeed: ["记得，烟味特别大。", "那时候一小时两块钱。", "我还留着当年的上机卡。", "最怀念论坛里等回复的感觉。"] },
  "大家记忆里最好听的一首老歌": { board: "娱乐八卦", author: "绿袖子", time: "2015-05-29 12:31", views: 3521, replies: 219, body: ["不列榜单，只说一首你现在听到前奏就会停下来的老歌。", "我先来：《后来》。"], replySeed: ["《红豆》。", "《遇见》，前奏一响就是学生时代。", "《十年》。", "老歌和旧网页一样，一打开就回到当年。"] },
  "有没有遇到过已经注销却还在上线的账号": { board: "莲蓬鬼话", author: "guest", time: "2015-05-29 00:35", views: 735, replies: 35, body: ["不是灵异故事。我以前注销过一个邮箱，今天客户端却弹出‘最后登录：刚刚’。", "有没有懂技术的解释一下，是缓存、同步延迟，还是有人重新注册了同名账号？"], replySeed: ["先改你还在用的其他密码。", "客户端缓存很常见，不一定真登录了。", "同名账号和原账号不是一回事。", "去看服务器日志，别靠一个提示判断。"] },
  "我等一个不会回来的人，第三年": { board: "情感天地", author: "北方来信", time: "2015-05-28 23:10", views: 1182, replies: 56, body: ["这不是爱情故事。三年前朋友离开这座城市，说安顿好就写信。", "我后来才明白，等待有时只是给自己一个不结束的理由。今晚把旧地址删了。"], replySeed: ["抱抱楼主。", "有些告别没有正式的一天。", "向前走吧。", "删掉地址不等于忘记，只是可以生活了。"] },
  "求助：年轮日记网站打不开了": { board: "电脑网络", author: "盐汽水", time: "2009-05-19 16:20", views: 620, replies: 12, body: ["收藏夹里的年轮日记网站今天一直超时，换了两个浏览器都打不开。", "有人知道是临时维护还是已经关站了吗？我只想导出自己的旧文章。"], replySeed: ["站长说数据库在迁移。", "可以试试网页快照。", "我的页面也打不开。", "导出功能前几个月就坏了。"] },
  "长篇连载：春天花会开（每日更新）": { board: "舞文弄墨", author: "纸上行舟", time: "2015-05-29 11:06", views: 2810, replies: 128, body: ["第一章　回南方", "火车进站时，窗外下着很小的雨。陈默把十年前没有寄出的信压回箱底，拖着行李走进人群。", "本文纯属虚构，每晚十点更新。"], replySeed: ["蹲更新。", "开头有画面感。", "男主为什么十年没回去？", "楼主今天还更吗？"] },
  "2008，那些留在论坛里的人": { board: "远岸聚焦", author: "编辑部", time: "2015-05-27 09:00", views: 8042, replies: 304, body: ["我们在旧服务器里恢复了 2008 年的一批帖子。用户名大多已经灰掉，签名档图片也全部失效。", "如果你还记得某个帖子，可以在回复里留下标题。"], replySeed: ["想找一篇骑行西藏的长帖。", "以前每天都来，现在连密码都忘了。", "很多人只剩一个用户名。", "希望旧数据能多保存几年。"] },
  "旧贴寻人：你还记得他吗": { board: "社区杂谈", author: "寻人启事", time: "2015-05-26 18:42", views: 943, replies: 41, body: ["找一位 2006 年常在摄影版发黑白街景的网友，昵称里有一个‘渡’字。", "不是现实寻人，只想问他当年的照片还有没有备份。"], replySeed: ["是不是‘渡口无灯’？", "摄影版旧索引里可能有。", "帮顶。", "记得他拍过一组火车站。"] },
  "十大最感人的网络文字": { board: "舞文弄墨", author: "旧文整理", time: "2015-05-25 20:18", views: 6712, replies: 188, body: ["只做文章索引，不做真假排名。网络文字在转载中经常被换标题、换作者，欢迎补充最早链接。", "第一批目录共十篇，已有三篇找不到首发页。"], replySeed: ["支持标出处。", "很多所谓原句其实是留言。", "求补最早发布日期。", "不要只贴截图，最好留网页地址。"] }
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
      recoveryStep: Math.max(0, Math.min(7, Number(saved?.recoveryStep) || 0)),
      threadPage: Math.max(1, Math.min(threadPageCount, Number(saved?.threadPage) || 1)),
      threadMode: "all",
      ordinaryTitle: typeof saved?.ordinaryTitle === "string" ? saved.ordinaryTitle : "十年前的网吧，现在还有人记得吗"
    };
  } catch {
    return { storyStarted: false, recoveryStep: 0, threadPage: 1, threadMode: "all", ordinaryTitle: "十年前的网吧，现在还有人记得吗" };
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

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]);
}

function textToHtml(value) {
  return escapeHtml(value || "").replace(/\n/g, "<br>");
}

function openDiary(title, trigger) {
  const content = diaryArchive[title];
  diaryReturnFocus = trigger;
  diaryReaderTitle.textContent = title;
  diaryReaderCrumb.textContent = title;
  diaryReaderText.classList.toggle("missing", !content);
  if (content) {
    diaryReaderMeta.textContent = "正文来源：《康康的网络日记本》旧页存档";
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

function replyDate(floor) {
  if (floor <= 80) return `2008-03-${floor < 42 ? "28" : "29"} ${pad((floor * 3) % 24)}:${pad((floor * 7) % 60)}`;
  if (floor <= 160) return `2009-05-${pad(16 + (floor % 4))} ${pad((floor * 5) % 24)}:${pad((floor * 11) % 60)}`;
  if (floor <= 200) return `2013-06-${pad(22 + (floor % 6))} ${pad((floor * 3) % 24)}:${pad((floor * 13) % 60)}`;
  return `2015-05-${floor < 350 ? "28" : "29"} ${pad((floor * 7) % 24)}:${pad((floor * 17) % 60)}`;
}

function buildMainReply(floor) {
  const sourceReply = sourceReplies.get(floor);
  if (sourceReply) {
    return {
      floor,
      user: sourceReply.user,
      time: sourceReply.time,
      html: textToHtml(sourceReply.text),
      link: Boolean(threadClueAttachments[floor]),
      sourced: true
    };
  }
  if (threadStoryReplies[floor]) return { floor, ...threadStoryReplies[floor] };
  return {
    floor,
    user: replyUsers[floor % replyUsers.length],
    time: replyDate(floor),
    html: escapeHtml(genericReplyTexts[floor % genericReplyTexts.length]),
    link: false
  };
}

function renderMainThread() {
  threadOwnerPost.innerHTML = textToHtml(threadSource.ownerPost);
  const allReplies = Array.from({ length: 437 }, (_, index) => buildMainReply(index + 1));
  if (state.threadPage > threadPageCount) state.threadPage = threadPageCount;
  const start = (state.threadPage - 1) * threadPageSize;
  const pageReplies = allReplies.slice(start, start + threadPageSize);

  threadReplies.innerHTML = pageReplies.map(reply => `
    <article class="archive-floor ${reply.link ? "link-floor" : ""}" id="floor-${reply.floor}">
      <header class="archive-floor-head">
        <span>作者：<b>${escapeHtml(reply.user)}</b></span><span>时间：${escapeHtml(reply.time)}</span>
        <span class="archive-floor-actions">回复　举报　${reply.floor}楼</span>
      </header>
      <div class="archive-floor-body">
        <div class="archive-reply-text">${reply.html}</div>
        ${threadClueAttachments[reply.floor] ? `<div class="clue-attachment"><span>${escapeHtml(threadClueAttachments[reply.floor].note)}</span><button class="external-link" type="button" data-goto="${threadClueAttachments[reply.floor].page}">[关联网页] ${escapeHtml(threadClueAttachments[reply.floor].label)}</button></div>` : ""}
      </div>
    </article>`).join("");

  const pagerHtml = Array.from({ length: threadPageCount }, (_, index) => {
    const page = index + 1;
    return `<button type="button" data-thread-page="${page}" class="${page === state.threadPage ? "current" : ""}">${page}</button>`;
  }).join("") + `<span>　共 ${threadPageCount} 页 / 437 楼</span>`;
  threadPagers.forEach(pager => { pager.innerHTML = pagerHtml; });
  if (document.querySelector("#page-1").classList.contains("active")) {
    pageCounter.textContent = `主题回复：第 ${state.threadPage} / ${threadPageCount} 页`;
  }
}

function renderOrdinaryThread() {
  const data = ordinaryThreads[state.ordinaryTitle] || ordinaryThreads["十年前的网吧，现在还有人记得吗"];
  document.querySelector("#ordinaryThreadBoard").textContent = data.board;
  document.querySelector("#ordinaryBoardName").textContent = data.board;
  document.querySelector("#ordinaryAuthor").textContent = data.author;
  document.querySelector("#ordinaryThreadTime").textContent = `楼主　${data.time}`;
  document.querySelector("#ordinaryThreadTitle").textContent = state.ordinaryTitle;
  document.querySelector("#ordinaryThreadStats").textContent = `点击：${data.views}　回复：${data.replies}`;
  document.querySelector("#ordinaryThreadBody").innerHTML = data.body.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join("");
  const samples = Array.from({ length: Math.min(16, data.replies) }, (_, index) => ({
    user: replyUsers[(index + data.author.length) % replyUsers.length],
    text: data.replySeed[index % data.replySeed.length],
    floor: index + 1
  }));
  document.querySelector("#ordinaryReplies").innerHTML = samples.map(reply => `<div class="floor"><span><b>${reply.floor}#</b>　${escapeHtml(reply.user)}</span><p>${escapeHtml(reply.text)}</p></div>`).join("");
}

function pageFromHash() {
  const match = location.hash.match(/^#page-(\d+)$/);
  return match ? Number(match[1]) : 0;
}

function showPage(requestedPage, addHistory = true) {
  let next = Math.max(0, Math.min(10, Number(requestedPage) || 0));
  if (next === 8 && state.recoveryStep >= 7) next = 9;
  if (next === 1) renderMainThread();
  if (next === 10) renderOrdinaryThread();

  screens.forEach(screen => {
    const active = Number(screen.dataset.page) === next;
    screen.classList.toggle("active", active);
    screen.setAttribute("aria-hidden", active ? "false" : "true");
  });

  if (next === 0) pageCounter.textContent = "社区首页";
  else if (next === 1) pageCounter.textContent = `主题回复：第 ${state.threadPage} / ${threadPageCount} 页`;
  else if (next >= 2 && next <= 7) pageCounter.textContent = "站外链接页面";
  else if (next === 8) pageCounter.textContent = `账号恢复：密保 ${state.recoveryStep + 1} / 7`;
  else if (next === 9) pageCounter.textContent = "账号恢复完成";
  else pageCounter.textContent = "社区主题浏览";

  tickerText.textContent = tickers[next];
  document.title = next === 0
    ? "远岸社区旧版镜像 - 在远处，也在一起"
    : next === 8
      ? "找回账号 - 远岸用户中心"
      : next === 9
        ? "该用户已注销 - ERROR 035"
        : next === 10
          ? `${state.ordinaryTitle} - 远岸社区`
          : `${document.querySelector(`#page-${next} h1, #page-${next} [id^="title-"]`)?.textContent?.trim() || "旧帖"} - 旧页镜像`;

  if (addHistory) history.pushState({ page: next }, "", `#page-${next}`);
  window.scrollTo({ top: 0, behavior: "auto" });
  document.querySelector(`#page-${next} h1, #page-${next} h2, #page-${next} button`)?.focus({ preventScroll: true });
  if (next === 8) renderRecovery();
  if (next === 9) document.querySelector("#endingTime").textContent = stamp();
}

function beginStory() {
  state.storyStarted = true;
  state.threadPage = 1;
  state.threadMode = "all";
  saveState();
  showPage(1);
}

function openForumThread(title) {
  state.ordinaryTitle = ordinaryThreads[title] ? title : "十年前的网吧，现在还有人记得吗";
  saveState();
  showPage(10);
}

function renderRecovery() {
  const step = Math.min(state.recoveryStep, 6);
  recoveryForms.forEach((form, index) => form.classList.toggle("active", index === step));
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
    feedback.textContent = "密保答案不匹配，请返回原帖查找相关链接后重试。";
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
  const forumThread = event.target.closest("[data-forum-thread]");
  if (forumThread) {
    openForumThread(forumThread.dataset.forumThread);
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
  const threadPage = event.target.closest("[data-thread-page]");
  if (threadPage) {
    state.threadPage = Number(threadPage.dataset.threadPage);
    saveState();
    renderMainThread();
    document.querySelector(".thread-toolbar").scrollIntoView({ block: "start" });
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
  if (event.target === floorJumpForm) {
    event.preventDefault();
    const floor = Math.max(1, Math.min(437, Number(floorJumpInput.value) || 1));
    state.threadPage = Math.ceil(floor / threadPageSize);
    saveState();
    renderMainThread();
    requestAnimationFrame(() => document.querySelector(`#floor-${floor}`)?.scrollIntoView({ block: "start" }));
    return;
  }
  const form = event.target.closest("[data-recovery-form]");
  if (!form) return;
  event.preventDefault();
  submitRecovery(form);
});

document.querySelector("#closeDiaryTop").addEventListener("click", closeDiary);
document.querySelector("#closeDiaryBottom").addEventListener("click", closeDiary);
document.querySelector("#closeDeadTop").addEventListener("click", closeDead);
document.querySelector("#closeDeadBottom").addEventListener("click", closeDead);
diaryReader.addEventListener("click", event => { if (event.target === diaryReader) closeDiary(); });
deadDialog.addEventListener("click", event => { if (event.target === deadDialog) closeDead(); });
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeDiary();
    closeDead();
  }
});

document.querySelector("#restartButton").addEventListener("click", () => {
  state = { storyStarted: false, recoveryStep: 0, threadPage: 1, threadMode: "all", ordinaryTitle: "十年前的网吧，现在还有人记得吗" };
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
if (initialPage >= 1 && initialPage <= 9) {
  state.storyStarted = true;
  saveState();
}
document.querySelector("#nowStamp").textContent = stamp();
history.replaceState({ page: initialPage }, "", initialPage ? `#page-${initialPage}` : location.pathname + location.search);
showPage(initialPage, false);
