const rules = window.QUEST_RULES;
document.querySelector("#recoveryQuestions").innerHTML = rules.questions.map((q, index) => `<form class="recovery-question" data-recovery-form data-key="${q.key}"><div class="question-no">密保问题 ${index + 1}</div><h2>${escapeHtml(q.title)}</h2><fieldset class="answer-options"><legend class="sr-only">选择一项答案</legend>${q.options.map(([value, label]) => `<label><input type="radio" name="${q.key}" value="${escapeHtml(value)}"> ${escapeHtml(label)}</label>`).join("")}</fieldset><button class="old-button verify-button" type="submit">${index === 6 ? "完成验证" : "提交答案"}</button><p class="recovery-feedback" aria-live="polite"></p></form>`).join("");
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
const ghostReplies = document.querySelector("#ghostReplies");
const ghostThreadStats = document.querySelector("#ghostThreadStats");
const ghostSystemText = document.querySelector("#ghostSystemText");
const ghostContinue = document.querySelector("#ghostContinue");
const continueRecoveryButton = document.querySelector("#continueRecoveryButton");
const soundToggle = document.querySelector("#soundToggle");
const possessionPostForm = document.querySelector("#possessionPostForm");
const possessionTitleInput = document.querySelector("#possessionTitleInput");
const possessionBody = document.querySelector("#possessionBody");
const publishPossessionButton = document.querySelector("#publishPossessionButton");
const composeReturnButton = document.querySelector("#composeReturnButton");
const composeWarning = document.querySelector("#composeWarning");
const composeAuthor = document.querySelector("#composeAuthor");
const composeStatus = document.querySelector("#composeStatus");
const blackoutEnding = document.querySelector("#blackoutEnding");
const diaryArchive = window.DIARY_ARCHIVE || {};
const threadSource = window.THREAD_SOURCE || { ownerPost: "", replies: [] };
const sourceReplies = new Map((threadSource.replies || []).map(reply => [Number(reply.floor), reply]));
const threadPageSize = 200;
const threadPageCount = 3;
const storageKey = "yuanan-forum-mystery-v7";

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
  9: "正在恢复缺失回复。请勿关闭当前页面。",
  10: "远岸社区主题浏览：帖子内容来自旧版镜像。",
  11: "账号恢复尚未完成。请验证主题发表权限。",
  12: "主题发表成功。当前登录用户：南康白起。"
};

const threadStoryReplies = {
  205: { user: "无名氏", time: "2015-05-27 23:44", link: true, html: "这里有人把学校名单、344 条新闻目录、旧帖转载和账号登录记录放在一楼里追查，楼数很长：<button class=\"external-link\" type=\"button\" data-goto=\"7\">[站外链接] 2015 年匿名调查楼</button>" },
  247: { user: "空白签名", time: "2015-05-28 03:12", html: "有人问我为什么一直保存这个帖子。<br>我怕哪天忘了，自己是看帖的那个人。" },
  293: { user: "半封回信", time: "2015-05-28 12:07", html: "别人的密保为什么是公开文章里的句子？<br>我申请找回自己的号，系统给我的却是他的提问。<br>客服说：资料越完整，误认的可能越小。" },
  382: { user: "未寄到", time: "2015-05-29 01:08", html: "我把昨天的页面打印出来了。纸上明明写着‘你只是访客’。<br>今天打开同一个页面，它问我：‘你为什么还不承认？’<br>纸我还留着。只是签收人不见了。" },
  224: { user: "新闻目录组", time: "2015-05-28 00:12", html: "查到的只是目录零命中。请不要把‘没有找到’改写成‘已经证明不存在’。" },
  270: { user: "别再试密码", time: "2015-05-28 09:41", html: "有人用泄露出来的旧凭据做登录验证。每验证一次，后台就会多一个更晚的登录时间。后来的人又拿这个时间当作旧证据。" },
  318: { user: "纸灰", time: "2015-05-28 18:27", html: "《那个人》没有正文。我点了返回，浏览器却问我要不要保存修改。<br>我明明什么都没写。" },
  355: { user: "guest_00034", time: "2015-05-29 00:34", html: "调查楼最后可复核的登录在 1894 楼，1900 楼那条会显示访问者自己的时间。别把它当原始回复。" },
  401: { user: "最后一页", time: "2015-05-29 03:11", html: "翻到这里的人已经很少了。首页显示本帖 437 回复，可我刚才明明看到的是 438。" },
  436: { user: "系统消息", time: "2015-05-29 03:34", html: "该用户的恢复记录已重新生成。请求编号：035。<br>上次申请人：第443位访问者。<br>处理结果：原账号仍在线；申请人已不在用户表中。" },
  437: { user: "南康好友", time: "2015-05-29 03:35", link: true, html: "所有链接都回到这里。还要继续登录吗？<button class=\"external-link danger-link\" type=\"button\" data-goto=\"8\">[用户中心] 恢复“南康好友”账号</button>" }
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

const branchStories = {
  archive: { title: "申请已归档", label: "结局一 · 留档", account: "未登录", steps: [
    ["处理回执 / 444", "你保留了原记录，把后来的登录标为后来人的行为。没有人为缺失的正文补写一句话。\n\n账号恢复已取消。社区恢复了熟悉的蓝色。"],
    ["旧附件 / 申请前", "归档包里多了一张回执。时间早于你第一次答题。\n\n申请人选择：保留空缺。\n处理意见：不要把没有找到的人，补成自己。"],
    ["回执背面", "下面还有一行，被划掉了：\n\n“这一次，他终于没有替我写完。”\n\n你不能确定这句话是在感谢谁。"],
    ["会话已结束", "当前在线：0。\n未完成的恢复申请：1。\n\n你没有打开那一份。"] ], actions: ["查看归档附件", "翻到回执背面", "结束本次会话"] },
  waiting: { title: "等待账号主人回复", label: "结局二 · 他还活着", account: "第444位访问者", steps: [
    ["站内信 / 南康好友", "你选择把这组记录交还给仍然活着的账号主人。\n\n对方回复：\n“谢谢。终于有人没有替我写悼文。”"],
    ["同一封信", "“不过，页面说我们用的是同一个账号。”\n\n“你退出一下。我想看看我能不能留下来。”\n\n附件：在线名单，共 1 人。"],
    ["在线名单", "南康白起：在线。\n第444位访问者：等待退出。\n\n你还没操作，对方又发来一句：\n“你上一次也是停在这里。”"],
    ["对方正在输入", "正在输入……\n\n没有新消息。\n\n会话记录却多出一条来自你的回复：\n“好。这次我先走。”"] ], actions: ["读取下一段", "查看在线名单", "等待回复"] },
  erased: { title: "空白身份已删除", label: "结局三 · 查无此人", account: "该用户不存在", steps: [
    ["删除结果", "你认为这个身份是由转述和重复填写拼成的。系统删除了没有原始持有人的账号条目。\n\n原帖还在，文章还在。只有“当前用户”一栏变成空白。"],
    ["用户检索", "南康白起：1 条记录。\n第444位访问者：0 条记录。\n\n删除队列：第444位访问者。\n匹配理由：没有历史，只有本次浏览。"],
    ["申诉预览", "你点开申诉。系统要求提供一段早于进入这个页面的站内记录。\n\n你没有。\n\n页面底部已经替你填好了申诉内容：\n“我不是从这里才开始存在的。”"],
    ["申诉被退回", "同样的内容，已由第443位访问者提交。\n\n退回原因：重复身份。\n\n如果记录比你更早说过这句话，你还拿什么证明它是你的？"] ], actions: ["检索删除结果", "提交身份申诉", "查看处理意见"] },
  refusal: { title: "恢复申请已撤回", label: "结局四 · 留在门外", account: "未登录", steps: [
    ["注销回执", "你拒绝继续替缺失的人填写身份。恢复进度停在 99%。\n\n当前会话已断开。旧帖恢复为 437 楼。"],
    ["未发送草稿", "草稿箱里有一句没发出去的话：\n\n“不要回答最后一个问题。它问的不是谁死了。”\n\n收件人：第445位访问者。\n发件人：第444位访问者。"],
    ["草稿历史", "你没有写过这句话。\n\n上一版本的发件人是第443位访问者。再往前是第442位。\n每个人都撤回了申请。\n每个人都留下了同一封没有发出的信。"],
    ["已离开社区", "你关掉了草稿，没有发表新的悼文。\n\n系统只保留了一条离线签名：\n“我没有进去。请不要把我算在里面。”\n\n在线人数没有减少。"] ], actions: ["查看未发送草稿", "查看草稿历史", "关闭草稿"] }
};

branchStories.reversed = { title:"时间记录修复中", label:"结局 · 先注销的人", account:"离线", steps:[
  ["时间冲突", "系统采用了你选择的顺序。为了使记录成立，它把你的注销排到了登录之前。\n\n退出操作：已完成。操作者：本次申请人。"],
  ["个人空间", "空间里有一篇告别。作者是你，发表时间是昨天。\n\n最后一句：明天如果这个账号又上线，不要相信是我。"],
  ["在线提示", "头像亮了。\n你的旧留言被自动回复：他昨天已经退出了。\n\n你每点击一次，都会给这句话添上一条新的证据。"],
  ["时间已修复", "记录完整。没有剩余的时间能容纳本次申请人。"] ], actions:["查看告别", "查看在线提示"] };
branchStories.replacement = { title:"引用来源已恢复", label:"结局 · 第1900楼", account:"旧帖作者", steps:[
  ["记录替补", "你选的不是最后一条可以复核的登录记录。系统没有找到所需证据，便把你本次访问放进了第1900楼。"],
  ["第1900楼", "作者：第444位访问者。\n时间：2015-05-29 03:35。\n正文：如果有人看到我在线，请帮我把这一楼删掉。\n\n你记得自己还没说过这句话。"],
  ["有人引用了你", "回复：楼主终于又出现了。每隔一阵，他就会说自己只是路过。\n\n引用框里有你刚才的答案。后面还有一行空白，光标正在等。"],
  ["更正记录", "更正也成为了原帖的一部分。现在有了第1901楼。"] ], actions:["打开被引用的楼层", "查看引用回复"] };
branchStories.waiting.label = "结局 · 空出来的那一天";
branchStories.waiting.steps[0] = ["等待记录", "你把两个日期之间的距离算错了。系统把这段无法对上的时间划进了你的账号。\n\n对方发来一句：谢谢你愿意留下来等。"];
branchStories.erased.label = "结局 · 没有来源的人";
branchStories.erased.steps[0] = ["来源记录", "你接受了一种不需要原始发言人的证明。系统按照这个标准，开始整理本次会话。\n\n原帖还在，文字还在。只有正在说话的人不再必要。"];
branchStories.refusal.label = "结局 · 下一位";
branchStories.refusal.steps[0] = ["操作记录", "你的答案没有把后来的验证者算进去。系统因此没有登记你刚才的登录尝试。\n\n你已离开。\n下面还有一句：尚未轮到你离开。"];

const endingNames = { archive: "留档", ...Object.fromEntries(rules.failures.map(route => [route.ending, route.name])) };
const branchTasks = {
  archive: { title: "封存原始记录", body: "七项记录核对完成。缺失的部分依然缺失。你不需要替任何人补齐。", options: [["leave", "保留空白，封存记录"]] },
  waiting: { title: "对方仍在输入", body: "最后一条消息一直没有发完。你想让它知道你还在。", options: [["stay", "我还在。"], ["yield", "我等你。"]] },
  erased: { title: "身份申诉", body: "请选择你能证明自己存在的那一项。", options: [["claim", "本次申请编号：444"], ["voice", "这些字是我刚才亲自选的"]] },
  reversed: { title: "时间修复", body: "你的注销时间早于登录时间。请选择要保留的一项。", options: [["login", "保留这次登录"], ["logout", "保留退出记录"]] },
  replacement: { title: "原帖引用通知", body: "有人把你的这次浏览当成了旧帖证据。", options: [["deny", "这不是当年的记录"], ["remove", "撤回这条引用"]] },
  refusal: { title: "离开前处理草稿", body: "收件人：下一位访问者。\n正文：不要恢复这个账号。\n发件时间：你到来之前。", options: [["unsent", "保留为草稿，离开"], ["send", "把提醒留给下一位访客"]] }
};

function failureRoute() { return rules.failures[state.failedQuestion - 1]; }
function hasOutcome() { return state.failedQuestion > 0 || state.recoveryStep === 7; }
function currentPossessionBody() { return failureRoute()?.body || ""; }
function outcomeRoute() { return failureRoute()?.ending || "archive"; }
function retryQuestion() {
  const step = state.failedQuestion ? state.failedQuestion - 1 : 0;
  const previous = state.answers.slice(0, step);
  const completed = state.completed, muted = state.muted;
  clearEndingTimers();
  state = { ...freshState(), completed, muted, answers: previous, recoveryStep: step, storyStarted: true };
  recoveryForms.forEach(form => { form.reset(); form.querySelector("button").disabled = false; });
  possessionTitleInput.value = ""; possessionBody.value = "";
  saveState(); showPage(8);
}
function enterOutcome() {
  const key = outcomeRoute();
  if (["possession", "diary"].includes(key)) {
    state.endingPhase = "compose"; state.ending = key; saveState(); showPage(11);
  } else resolveEnding(key);
}

function recordEnding(key) {
  if (!endingNames[key]) return;
  const action = ["possession", "diary"].includes(key) ? "publish" : state.branchAction || "read";
  const previous = state.completed[key];
  if (previous?.action === action && previous.failedQuestion === state.failedQuestion && previous.answer === state.answers[state.failedQuestion - 1]) return;
  state.completed[key] = { time: stamp(), failedQuestion: state.failedQuestion, answer: state.answers[state.failedQuestion - 1] || "", action };
  saveState();
  document.querySelectorAll("[data-collection]").forEach(button => { button.hidden = false; });
}

function renderCollection() {
  clearEndingTimers();
  document.body.classList.remove("ghost-mode", "identity-slip", "published-mode");
  document.querySelector("#collectionCount").textContent = `${Object.keys(state.completed).length} / 8`;
  document.querySelector("#collectionList").innerHTML = Object.entries(endingNames).map(([key, name], index) => {
    const item = state.completed[key];
    const q = rules.questions[(item?.failedQuestion || 0) - 1];
    const answer = q?.options.find(([value]) => value === item.answer)?.[1];
    return `<article class="ending-letter"><header>回执 ${index + 1} / ${item ? escapeHtml(item.time) : "尚未归档"}</header><h2>${item ? escapeHtml(name) : "未读取的回执"}</h2>${item ? `<p>${item.failedQuestion ? `记录从第 ${item.failedQuestion} 题发生偏移。<br>当时提交：${escapeHtml(answer || item.answer)}` : "七项密保全部核对正确。"}</p>` : "<p>这份回执尚未写上你的名字。</p>"}</article>`;
  }).join("");
  document.querySelector("#collectionReplay").hidden = !hasOutcome();
  pageCounter.textContent = "用户中心 / 已归档回执";
  tickerText.textContent = "这里只保留你已经读完的回执。";
}

function finishBranch(action) {
  if (state.endingPhase !== "resolved" || state.endingBeat !== 2) return;
  const task = branchTasks[state.ending];
  if (!task?.options.some(([value]) => value === action)) return;
  state.branchAction = action; state.endingBeat = 3;
  recordEnding(state.ending); saveState(); renderBranchEnding();
}

function renderAtmosphere(page) {
  document.querySelectorAll("[data-collection]").forEach(button => { button.hidden = Object.keys(state.completed).length === 0; });
  document.querySelectorAll("[data-replay-branch]").forEach(button => { button.textContent = state.failedQuestion ? `回到第${state.failedQuestion}题重选` : "重新核对七道密保"; });
  const active = state.storyStarted && (state.recoveryStep >= 1 || state.failedQuestion > 0);
  document.querySelector("#visitCount").textContent = active ? "000444" : "000035";
  soundToggle.hidden = !hasOutcome();
  document.body.classList.toggle("uneasy-mode", active);
  document.querySelector("#navUserButton").textContent = state.endingPhase === "published" ? "南康白起" : state.endingPhase === "resolved" ? branchStories[state.ending]?.account || "用户中心" : state.failedQuestion === 1 ? "旧识" : active ? "访客 444" : "用户中心";
  const status = document.querySelector("#homeLoginStatus");
  status.textContent = state.endingPhase === "resolved" ? `当前用户：${branchStories[state.ending]?.account || "未登录"}` : active ? (state.recoveryStep >= 6 ? "您尚未登录。另一个您已在线。" : "您尚未登录。恢复记录中已有您的姓名。") : "您尚未登录";
  const messages = { 0: "未读回执：1　／　发件人：本次申请人", 2: "检索结束：没有找到。上次申请将这一结果填写为“不存在”。", 3: "缓存引用来源：另一个缓存。最初发言人：空。", 4: "本次浏览不会写入历史登录记录。恢复申请除外。", 5: "页面文字未改变。阅读者记录已更新。", 6: state.diaryVisits.includes("那个人") ? "《那个人》正文仍为 0 字。阅读回执已签收。" : "目录完整。持有人一栏仍在等待填写。", 7: "第1900楼显示本次访问时间。上一份申请把它认作了自己的过去。", 8: state.recoveryStep >= 6 ? "核对对象：申请人。原账号资料已不足以继续区分。" : "同号恢复申请正在等待您处理。" };
  if (active && messages[page]) tickerText.textContent = messages[page];
  const echo = document.querySelector("#homeEcho");
  echo.hidden = !active;
  echo.textContent = state.endingPhase === "resolved" ? "[用户中心] 一份已结束的申请" : "[用户中心] 您有一份早于本次访问的恢复回执";
  document.body.classList.toggle("record-drift", state.failedQuestion > 0);
  if (state.failedQuestion) {
    document.querySelector("#homeLoginStatus").textContent = `本次申请：${state.recoveryStep} / 7。系统已经替你写完剩下的部分。`;
    if ([0,2,3,4,5,6,7,8].includes(page)) tickerText.textContent = failureRoute().notice;
  }
  const note = document.querySelector("#recoveryIdentityNote");
  note.textContent = state.recoveryStep >= 4 ? `资料归属：${state.failedQuestion ? "当前申请人" : "待核对"}　／　原持有人：空` : "";
}

function resolveEnding(ending) {
  if (!hasOutcome() || !branchStories[ending] || ending !== outcomeRoute()) return;
  state.endingPhase = "resolved"; state.ending = ending; state.endingBeat = 0; state.branchAction = "";
  saveState(); showPage(14);
}

function renderBranchEnding() {
  clearEndingTimers();
  const story = branchStories[state.ending];
  if (!story) return;
  document.body.classList.remove("published-mode", "identity-slip", "ghost-mode");
  const beat = state.endingBeat;
  document.querySelector("#branchEndingTitle").textContent = story.title;
  const steps = story.steps.map(item => [...item]);
  if (state.failedQuestion) {
    const q = rules.questions[state.failedQuestion - 1];
    const chosen = q.options.find(([value]) => value === state.answers[state.failedQuestion - 1])?.[1] || "";
    steps[0][1] = `接收记录：「${chosen}」。\n\n${steps[0][1]}`;
  }
  if (state.ending === "waiting" && state.branchAction) steps[3] = ["对方停止输入", `你说：${state.branchAction === "stay" ? "我还在。" : "我等你。"}\n\n对方：这句话我已经等了十八天。\n\n你的消息时间变成了2008年3月9日。\n页面上方显示：最后回复，十八天后。`];
  if (state.ending === "erased" && state.branchAction) steps[3] = ["来源校验", "申请 444 已找到。来源：另一份转载。\n\n你的陈述被保存了。发言人一栏被删去。\n\n有人在下面问：这段话有原帖吗？\n你无法回复。系统说，没有找到你。"];
  if (state.ending === "refusal" && state.branchAction === "send") steps[3] = ["信件已投递", "对方已读。\n阅读时间：你进入页面之前。\n\n那句最初劝你不要继续的话，又出现在第一页。\n现在你知道是谁发的了。\n你的账号正在等待下一位访问者。"];
  if (state.ending === "reversed" && state.branchAction) steps[3] = ["已保留记录", state.branchAction === "login" ? "这次登录已保留。为了修复时间顺序，你的注销日期被移到了明天。\n\n日历只剩下今天和明天。\n退出按钮上写着：尚未到期。" : "退出记录已保留。\n你的本次登录被删除。\n\n页面仍然在响应。它说这是注销之前留下的缓存。\n包括你接下来要说的话。"];
  if (state.ending === "replacement" && state.branchAction) steps[3] = ["更正已存档", "你的更正被引用为第1901楼。\n\n“这不是当年的记录。”\n\n回复：每次有人问到1900楼，他都会出来说这句话。\n\n原帖已经给你留好了下一层。"];
  const task = branchTasks[state.ending];
  const taskPanel = document.querySelector("#branchTask");
  taskPanel.hidden = beat !== 2;
  taskPanel.innerHTML = beat === 2 ? `<h2>${task.title}</h2><p>${textToHtml(task.body)}</p><div class="branch-actions">${task.options.map(([value, label]) => `<button class="old-button" data-finish-branch="${value}" type="button">${label}</button>`).join("")}</div>` : "";
  if (beat === 3) recordEnding(state.ending);
  document.querySelector("#branchEndingContent").innerHTML = steps.slice(0, beat + 1).map(([title, body]) => `<article class="ending-letter"><header>${escapeHtml(title)}</header><p>${textToHtml(body)}</p></article>`).join("");
  document.querySelector("#endingNext").hidden = beat >= 2;
  document.querySelector("#endingNext").textContent = story.actions[beat] || "";
  document.querySelector("#endingResolved").hidden = beat < 3;
  document.querySelector("#endingLabel").textContent = story.label;
  document.querySelector("#branchEndingContent").classList.toggle("ending-faded", beat >= 3);
  tickerText.textContent = beat >= 3 ? "本次会话已结束。" : "请求编号 444 / 正在读取处理记录";
  pageCounter.textContent = "恢复申请 / 处理回执";
  if (beat > 0) document.querySelector("#branchEndingContent").lastElementChild?.scrollIntoView({ block: "center", behavior: "auto" });
}

let state = loadState();
let diaryReturnFocus = null;
let deadReturnFocus = null;
let endingTimers = [];
let bodyTypingTimer = null;
let audioContext = null;
let endingMuted = state.muted;
history.scrollRestoration = "manual";

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (!saved) {
      const previous = JSON.parse(localStorage.getItem("yuanan-forum-mystery-v6"));
      return { ...freshState(), muted: Boolean(previous?.muted) };
    }
    const recoveryStep = Math.max(0, Math.min(7, Math.floor(Number(saved?.recoveryStep) || 0)));
    const endingPhase = ["none", "manifesting", "review", "compose", "published", "resolved"].includes(saved?.endingPhase)
      ? saved.endingPhase
      : recoveryStep >= 7 ? "manifesting" : "none";
    return {
      ...freshState(),
      failedQuestion: Math.max(0, Math.min(7, Math.floor(Number(saved?.failedQuestion) || 0))),
      answers: Array.isArray(saved?.answers) ? saved.answers.slice(0,7).map(String) : [],
      completed: Object.fromEntries(Object.entries(saved?.completed || {}).filter(([key, value]) => endingNames[key] && value && typeof value.time === "string")),
      branchAction: typeof saved?.branchAction === "string" ? saved.branchAction : "",
      composeTitle: typeof saved?.composeTitle === "string" ? saved.composeTitle.slice(0, 4) : "",
      composePosition: Math.max(0, Math.min(1000, Math.floor(Number(saved?.composePosition) || 0))),
      muted: Boolean(saved?.muted),
      ghostRead: Math.max(0, Math.min(6, Math.floor(Number(saved?.ghostRead) || 0))),
      blackoutSeen: Boolean(saved?.blackoutSeen),
      storyStarted: Boolean(saved?.storyStarted),
      ending: Object.hasOwn(endingNames, saved?.ending) ? saved.ending : "",
      endingBeat: Math.max(0, Math.min(3, Number(saved?.endingBeat) || 0)),
      diaryVisits: Array.isArray(saved?.diaryVisits) ? saved.diaryVisits.filter(x => typeof x === "string").slice(0, 40) : [],
      recoveryStep,
      threadPage: Math.max(1, Math.min(threadPageCount, Number(saved?.threadPage) || 1)),
      threadMode: "all",
      ordinaryTitle: typeof saved?.ordinaryTitle === "string" ? saved.ordinaryTitle : "十年前的网吧，现在还有人记得吗",
      endingPhase,
      composeReturnAttempts: Math.max(0, Number(saved?.composeReturnAttempts) || 0),
      publishedAt: typeof saved?.publishedAt === "string" ? saved.publishedAt : ""
    };
  } catch {
    return freshState();
  }
}

function freshState() {
  return { failedQuestion: 0, answers: [], ghostRead: 0, blackoutSeen: false, completed: {}, branchAction: "", composeTitle: "", composePosition: 0, muted: false, ending: "", endingBeat: 0, diaryVisits: [], storyStarted: false, recoveryStep: 0, threadPage: 1, threadMode: "all", ordinaryTitle: "十年前的网吧，现在还有人记得吗", endingPhase: "none", composeReturnAttempts: 0, publishedAt: "" };
}

function saveState() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    document.querySelector("#saveStatus").textContent = "本次进度暂存于当前页面，关闭后可能丢失";
  }
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function stamp(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function clearEndingTimers() {
  endingTimers.forEach(timer => window.clearTimeout(timer));
  endingTimers = [];
  if (bodyTypingTimer) window.clearInterval(bodyTypingTimer);
  bodyTypingTimer = null;
}

function later(callback, delay) {
  const timer = window.setTimeout(callback, delay);
  endingTimers.push(timer);
  return timer;
}

function prepareEndingAudio() {
  if (endingMuted) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    audioContext.resume();
  } catch {
    endingMuted = true;
  }
}

function playTone(frequency = 220, duration = 0.09, volume = 0.025, delay = 0) {
  if (endingMuted || !audioContext) return;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const start = audioContext.currentTime + delay;
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

function playReplySound(index) {
  playTone(index < 2 ? 740 : 120 + index * 17, index < 2 ? 0.08 : 0.16, index < 2 ? 0.025 : 0.018);
}

function playBlackoutSound() {
  playTone(150, 1.7, 0.035);
  playTone(103, 2.1, 0.03, 0.08);
  playTone(62, 2.5, 0.025, 0.16);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]);
}

function textToHtml(value) {
  return escapeHtml(value || "").replace(/\n/g, "<br>");
}

function openDiary(title, trigger) {
  const content = diaryArchive[title];
  if (!state.diaryVisits.includes(title)) state.diaryVisits.push(title);
  saveState();
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
  let receipt = document.querySelector("#diaryAccessReceipt");
  if (!receipt) {
    receipt = document.createElement("p");
    receipt.id = "diaryAccessReceipt";
    receipt.className = "access-receipt";
    diaryReaderText.after(receipt);
  }
  receipt.textContent = state.recoveryStep >= 4 ? `阅读回执：${state.failedQuestion === 5 ? "原作者" : "第444位访问者"}　／　${content ? "只读" : "正文 0 字，阅读完成"}` : "";
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
  if (floor === 401 && state.recoveryStep >= 4) return { floor, user: "最后一页", time: "2015-05-29 03:11", html: `我刚刚读到一句：<br>“${escapeHtml(rules.questions[0].options.find(([value]) => value === state.answers[0])?.[1] || "还没有人回答")}。”<br><br>为什么它还在等人点选？这句话不是早就写在这里了吗？` };
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
  if (state.recoveryStep >= 4 && state.ordinaryTitle === "有没有遇到过已经注销却还在上线的账号") samples.push({ user: "第443位访问者", floor: 17, text: "我也答过这些问题。正确答案属于旧帖，错误答案被登记成了我的经历。" });
  document.querySelector("#ordinaryReplies").innerHTML = samples.map(reply => `<div class="floor"><span><b>${reply.floor}#</b>　${escapeHtml(reply.user)}</span><p>${escapeHtml(reply.text)}</p></div>`).join("");
}

function startGhostSequence() {
  clearEndingTimers();
  const route = failureRoute();
  if (!route) { enterOutcome(); return; }
  document.body.classList.add("ghost-mode");
  const count = Math.min(3, state.ghostRead);
  const selected = rules.questions[state.failedQuestion - 1].options.find(([value]) => value === state.answers[state.failedQuestion - 1])?.[1] || "";
  ghostReplies.innerHTML = route.ghosts.slice(0,count).map((text,index) => `<article class="archive-floor manifest-floor"><header class="archive-floor-head"><span>作者：${index === 2 ? "本次申请人" : "未署名"}</span><span>时间：${index === 0 ? "早于本次访问" : "刚刚"}</span><span>${438 + index}楼</span></header><div class="archive-floor-body">${index === 0 ? `<p class="received-answer">申请中写着：${escapeHtml(selected)}</p>` : ""}${textToHtml(text)}</div></article>`).join("");
  ghostThreadStats.textContent = `点击：32330　回复：${437 + count}　共 ${count ? 4 : 3} 页`;
  ghostSystemText.textContent = count === 3 ? "剩余资料已由原账号补齐。" : `恢复队列：${count} / 3　等待读取`;
  document.querySelector("#readGhostReply").hidden = count >= 3;
  ghostContinue.hidden = count < 3;
  if (count > 0) ghostReplies.lastElementChild?.scrollIntoView({ block:"center", behavior:"auto" });
}

function composeWarningText() {
  if (state.composeReturnAttempts === 1) return "你还没有写完。";
  if (state.composeReturnAttempts === 2) return "悼念帖必须由活着的人发表。";
  if (state.composeReturnAttempts >= 3) return "现在只有我是活着的人。";
  return "";
}

function updatePublishAvailability() {
  publishPossessionButton.disabled = !possessionTitleInput.value || possessionBody.value !== currentPossessionBody();
}

function renderCompose() {
  clearEndingTimers();
  document.body.classList.add("ghost-mode");
  possessionTitleInput.value = state.composeTitle;
  possessionBody.value = currentPossessionBody().slice(0, state.composePosition);
  composeWarning.textContent = composeWarningText() || failureRoute()?.notice || "";
  composeAuthor.textContent = possessionTitleInput.value ? "南康白起" : "南康好友";
  composeStatus.textContent = possessionTitleInput.value ? "在线" : "身份核对中";
  if (!possessionTitleInput.value) possessionBody.value = "";
  else startBodyTyping();
  updatePublishAvailability();
  later(() => possessionTitleInput.focus({ preventScroll: true }), 80);
}

function startBodyTyping() {
  if (bodyTypingTimer || possessionBody.value === currentPossessionBody()) return;
  let position = possessionBody.value.length;
  bodyTypingTimer = window.setInterval(() => {
    position += 1;
    possessionBody.value = currentPossessionBody().slice(0, position);
    state.composePosition = position;
    if (position % 20 === 0 || position >= currentPossessionBody().length) saveState();
    possessionBody.scrollTop = possessionBody.scrollHeight;
    if (position >= currentPossessionBody().length) {
      window.clearInterval(bodyTypingTimer);
      bodyTypingTimer = null;
      updatePublishAvailability();
    }
  }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 18);
}

function setBlackoutOpen(open) {
  blackoutEnding.hidden = !open;
  blackoutEnding.setAttribute("aria-hidden", open ? "false" : "true");
  document.querySelectorAll(".masthead, .page-status, footer, #page-12 > :not(#blackoutEnding)").forEach(element => { element.inert = open; });
}

function renderPublishedEnding() {
  clearEndingTimers();
  document.body.classList.add("ghost-mode", "identity-slip", "published-mode");
  document.querySelector("#navUserButton").textContent = "南康白起";
  document.querySelector("#publishedTime").textContent = state.publishedAt || stamp();
  document.querySelectorAll(".reply-now").forEach((element, index) => {
    const date = new Date(Date.now() + (index + 1) * 1000);
    element.textContent = stamp(date);
  });
  document.querySelector("#title-12").textContent = `[左岸文字] 第444位访问者，${state.composeTitle}`;
  document.querySelector("#blackoutEnding h1").textContent = failureRoute()?.dark || "你不该来这里。";
  document.querySelector("#blackoutEnding .blackout-message p").textContent = `结局 · ${endingNames[outcomeRoute()]}`;
  document.querySelector("#publishedBody").innerHTML = textToHtml(currentPossessionBody());
  document.querySelectorAll(".possession-reply").forEach(element => element.classList.remove("revealed"));
  blackoutEnding.classList.remove("active", "message-visible");
  setBlackoutOpen(false);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const replyOneDelay = reducedMotion ? 100 : 1200;
  const replyTwoDelay = reducedMotion ? 200 : 2600;
  document.querySelector("#publishedContinue").hidden = true;
  if (state.blackoutSeen) { revealBlackout(); return; }
  later(() => document.querySelector(".possession-reply")?.classList.add("revealed"), replyOneDelay);
  later(() => {
    document.querySelector(".second-reply")?.classList.add("revealed");
    document.querySelector("#publishedContinue").hidden = false;
    playReplySound(1);
  }, replyTwoDelay);
}

function revealBlackout() {
  clearEndingTimers();
  state.blackoutSeen = true; recordEnding(outcomeRoute()); saveState();
  setBlackoutOpen(true);
  requestAnimationFrame(() => blackoutEnding.classList.add("active"));
  playBlackoutSound();
  later(() => {
    blackoutEnding.classList.add("message-visible");
    blackoutEnding.querySelector("button")?.focus({ preventScroll: true });
  }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 50 : 850);
}

function pageFromHash() {
  const match = location.hash.match(/^#page-(\d+)$/);
  return match ? Number(match[1]) : 0;
}

function showPage(requestedPage, addHistory = true) {
  setBlackoutOpen(false);
  let next = Math.max(0, Math.min(15, Number(requestedPage) || 0));
  const phasePage = { manifesting: 9, review: 9, compose: 11, published: 12, resolved: 14 };
  if ([8, 9, 11, 12, 13, 14].includes(next) && hasOutcome()) next = phasePage[state.endingPhase] || 9;
  if ([9, 11, 12, 13, 14].includes(next) && !hasOutcome()) next = 8;
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
  else if (next === 9) pageCounter.textContent = "主题回复：第 4 页";
  else if (next === 11) pageCounter.textContent = "发表新主题";
  else if (next === 12) pageCounter.textContent = "主题发表成功";
  else if (next >= 13) pageCounter.textContent = "用户中心 / 申请记录";
  else pageCounter.textContent = "社区主题浏览";

  tickerText.textContent = tickers[next] || tickers[0];
  document.title = next === 0
    ? "远岸社区旧版镜像 - 在远处，也在一起"
    : next === 8
      ? "找回账号 - 远岸用户中心"
      : next === 9
        ? "第 4 页 - 长沙的南康，一路走好"
        : next === 10
          ? `${state.ordinaryTitle} - 远岸社区`
          : next === 11
            ? "发表新主题 - 一路同行"
            : next === 12
              ? "主题发表成功 - 远岸社区"
          : `${document.querySelector(`#page-${next} h1, #page-${next} [id^="title-"]`)?.textContent?.trim() || "旧帖"} - 旧页镜像`;

  if (next === 13) document.title = "冲突处理 - 远岸用户中心";
  if (next === 15) document.title = "已归档回执 - 远岸用户中心";
  if (next === 14) document.title = `${branchStories[state.ending]?.title || "申请记录"} - 远岸用户中心`;
  if (addHistory) history.pushState({ page: next }, "", `#page-${next}`);
  window.scrollTo({ top: 0, behavior: "auto" });
  document.querySelector(`#page-${next} h1, #page-${next} h2, #page-${next} button`)?.focus({ preventScroll: true });
  renderAtmosphere(next);
  if (next === 8) renderRecovery();
  if (next === 9) startGhostSequence();
  else if (next === 11) renderCompose();
  else if (next === 12) renderPublishedEnding();
  else if (next === 13) enterOutcome();
  else if (next === 14) renderBranchEnding();
  else if (next === 15) renderCollection();
  else if (next !== 9) {
    clearEndingTimers();
    document.body.classList.remove("ghost-mode", "identity-slip", "published-mode");
  }
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
  const step = Math.min(state.recoveryStep,6);
  recoveryForms.forEach((form,index) => {
    form.classList.toggle("active",index === step);
    form.querySelector("button").disabled = false;
    form.querySelector(".recovery-feedback").textContent = "";
  });
  recoveryStepNumber.textContent = String(step + 1);
  recoveryProgressBar.style.width = `${step / 7 * 100}%`;
  pageCounter.textContent = `账号恢复：密保 ${step + 1} / 7`;
  const receipts = ["", "已保存你的第一项陈述。修改记录：无。", "申请编号444。旧申请也停在这道题之前。", "发言人的来源尚未找到。系统正在等待你给他一个位置。", "这组日期属于另一个账号。当前登录者：你。", "正文仍是空白。页面却把这次阅读记成了重读。", "只剩最后一项。你之前的答案已经出现在另一份申请里。"];
  const panel = document.querySelector("#recoveryReceipt");
  panel.hidden = step === 0;
  panel.textContent = receipts[step];
  recoveryForms[step].querySelector("input")?.focus({preventScroll:true});
}

function submitRecovery(form) {
  const index = recoveryForms.indexOf(form);
  if (index !== state.recoveryStep || hasOutcome()) return;
  const value = form.querySelector("input:checked")?.value;
  const result = rules.evaluateAnswer(index,value);
  const feedback = form.querySelector(".recovery-feedback");
  if (!result.valid) { feedback.textContent = "请选择一项答案。"; return; }
  form.querySelector("button").disabled = true;
  state.answers[index] = value;
  state.recoveryStep = index + 1;
  feedback.textContent = "记录已接收。";
  if (!result.correct) {
    state.failedQuestion = index + 1;
    state.endingPhase = "manifesting";
    state.ghostRead = 0;
    prepareEndingAudio();
  } else if (state.recoveryStep === 7) {
    state.endingPhase = "resolved"; state.ending = "archive";
  }
  saveState();
  later(() => {
    if (!document.querySelector("#page-8").classList.contains("active")) return;
    if (hasOutcome()) showPage(state.failedQuestion ? 9 : 14);
    else { renderRecovery(); renderAtmosphere(8); }
  },650);
}

document.addEventListener("click", event => {
  if (event.target.closest("#readGhostReply") && state.endingPhase === "manifesting") {
    state.ghostRead = Math.min(3, state.ghostRead + 1); saveState(); startGhostSequence(); return;
  }
  if (event.target.closest("#publishedContinue") && state.endingPhase === "published") { prepareEndingAudio(); revealBlackout(); return; }

  if (event.target.closest("[data-collection]")) { showPage(15); return; }
  if (event.target.closest("[data-new-run]")) { restartRun(); return; }
  const finish = event.target.closest("[data-finish-branch]");
  if (finish) { finishBranch(finish.dataset.finishBranch); return; }

  if (event.target.closest("[data-ending-next]")) {
    if (state.endingPhase !== "resolved" || state.endingBeat >= 2) return;
    state.endingBeat = Math.min(2, state.endingBeat + 1); saveState(); renderBranchEnding(); return;
  }
  if (event.target.closest("[data-replay-branch]")) { retryQuestion(); return; }
  if (event.target === continueRecoveryButton) { enterOutcome(); return; }
  if (event.target === soundToggle || event.target.closest("[data-mute]")) {
    endingMuted = !endingMuted;
    state.muted = endingMuted; saveState();
    soundToggle.textContent = endingMuted ? "声音：关" : "声音：开";
    document.querySelector("[data-mute]").textContent = soundToggle.textContent;
    if (endingMuted) audioContext?.suspend();
    else {
      prepareEndingAudio();
      audioContext?.resume();
      playTone(620, 0.08, 0.02);
    }
    return;
  }
  if (event.target === composeReturnButton) {
    state.composeReturnAttempts += 1;
    saveState();
    composeWarning.textContent = composeWarningText();
    composeWarning.classList.remove("warning-flash");
    requestAnimationFrame(() => composeWarning.classList.add("warning-flash"));
    possessionTitleInput.focus();
    return;
  }
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
  if (event.target === possessionPostForm) {
    event.preventDefault();
    if (!possessionTitleInput.value || possessionBody.value !== currentPossessionBody()) return;
    prepareEndingAudio();
    state.endingPhase = "published";
    state.publishedAt = stamp();
    saveState();
    showPage(12);
    return;
  }
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

possessionTitleInput.addEventListener("change", () => {
  state.composeTitle = possessionTitleInput.value; saveState();
  const hasInput = Boolean(possessionTitleInput.value);
  composeAuthor.textContent = hasInput ? "南康白起" : "南康好友";
  composeStatus.textContent = hasInput ? "在线" : "身份核对中";
  updatePublishAvailability();
  document.body.classList.toggle("identity-slip", hasInput);
  if (hasInput) {
    startBodyTyping();
    playTone(90, 0.13, 0.015);
  }
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

function restartRun() {
  clearEndingTimers();
  const completed = state.completed;
  const muted = state.muted;
  state = { ...freshState(), completed, muted };
  saveState();
  possessionTitleInput.value = "";
  possessionBody.value = "";
  composeWarning.textContent = "";
  publishPossessionButton.disabled = true;
  blackoutEnding.classList.remove("active", "message-visible");
  setBlackoutOpen(false);
  document.querySelector("#navUserButton").textContent = "用户中心";
  document.querySelector("#homeLoginStatus").textContent = "您尚未登录";
  document.body.classList.remove("ghost-mode", "identity-slip", "published-mode");
  recoveryForms.forEach(form => {
    form.reset();
    form.querySelector("button").disabled = false;
    form.querySelector(".recovery-feedback").textContent = "";
  });
  showPage(0);
}
document.querySelector("#restartButton").addEventListener("click", restartRun);

window.addEventListener("popstate", event => {
  const page = Number.isInteger(Number(event.state?.page)) ? Number(event.state.page) : pageFromHash();
  showPage(page, false);
});

window.addEventListener("pagehide", saveState);
soundToggle.textContent = endingMuted ? "声音：关" : "声音：开";
document.querySelector("[data-mute]").textContent = soundToggle.textContent;
const initialPage = pageFromHash();
if (initialPage >= 1 && initialPage <= 14 && initialPage !== 10) {
  state.storyStarted = true;
  saveState();
}
document.querySelector("#nowStamp").textContent = stamp();
history.replaceState({ page: initialPage }, "", initialPage ? `#page-${initialPage}` : location.pathname + location.search);
showPage(initialPage, false);
