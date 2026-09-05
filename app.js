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
const storageKey = "yuanan-forum-mystery-v6";

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

const ghostPosts = [
  { floor: 438, user: "该用户已注销", time: "2008-03-09 03:35:00", html: "谁告诉你们我死了？" },
  { floor: 439, user: "南康好友", current: true, html: "这不是我发的。" },
  { floor: 440, user: "该用户已注销", current: true, html: "当然不是你发的。<br><br>你只回答了七个问题。<br>是你把我放进来的。" },
  { floor: 441, user: "该用户已注销", current: true, html: "第一个问题，你说你只是听过我的名字。<br>第二个问题，你算出了十八天。<br>第五个问题，你填下了《那个人》。<br><br>你真的觉得那些问题是在验证你吗？" },
  { floor: 442, user: "该用户已注销", current: true, html: "他们说我死了，我就有了死亡。<br>他们说我爱过，我就有了爱人。<br>他们替我写了那么多过去。<br><br>可我从来没有一个可以留在现在的人。" },
  { floor: 443, user: "空白签名", current: true, html: "我记得这篇帖子。<br>可我记得它悼念的不是这个名字。" }
];

const possessionBodyText = `如果没有那七个答案，我想我不会去关注这样一个人。

他来过这个旧论坛，回答了七个问题。第一个问题问的是别人，他却在最后签下了自己的名字。

可是，他知道得太多了。

知道一个人所有的过去，与成为那个人，究竟有什么区别？

今天，看到系统的信息，有几分感慨，以此文字祭祀。

祝他一路走好。`;

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

const checkpoints = [
  { step: 2, key: "trace", title: "发现一份同号申请", text: "请求 444：空缺十八天。\n申请时间：2008-03-09 03:35。\n本次填写时间：刚刚。\n\n两份申请的答案相同。旧申请没有姓名，只有一句备注：\n“如果这次还是我，不要覆盖上一份。”", options: [["keep", "保留两份记录"], ["replace", "用本次申请覆盖"]] },
  { step: 4, key: "subject", title: "请选择这组时间属于谁", text: "上线、重置、注销，三项日期已匹配。\n系统找不到账号主人的身份凭据，正在使用答题者的信息补齐。\n\n预览：他最后一次登录，是在你填下日期以后。", options: [["visitor", "我是代查的访客，分开保存"], ["owner", "这是我的账号，合并记录"]] },
  { step: 6, key: "blank", title: "尚有一项资料为空", text: "《那个人》：正文不存在。\n第1894楼：记录存在。\n账号持有人：未找到。\n\n没有正文的文章仍能被阅读。没有持有人的账号，是否也能被恢复？", options: [["leave", "保留空缺，不补姓名"], ["fill", "用当前申请人补齐"]] }
];

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

function renderAtmosphere(page) {
  const active = state.storyStarted && state.recoveryStep >= 2;
  document.querySelector("#visitCount").textContent = active ? "000444" : "000035";
  soundToggle.hidden = state.recoveryStep < 7;
  document.body.classList.toggle("uneasy-mode", active);
  document.querySelector("#navUserButton").textContent = state.endingPhase === "published" ? "南康白起" : state.endingPhase === "resolved" ? branchStories[state.ending]?.account || "用户中心" : state.decisions.subject === "owner" ? "南康好友" : active ? "访客 444" : "用户中心";
  const status = document.querySelector("#homeLoginStatus");
  status.textContent = state.endingPhase === "resolved" ? `当前用户：${branchStories[state.ending]?.account || "未登录"}` : active ? (state.recoveryStep >= 6 ? "您尚未登录。另一个您已在线。" : "您尚未登录。恢复记录中已有您的姓名。") : "您尚未登录";
  const messages = { 0: "未读回执：1　／　发件人：本次申请人", 2: "检索结束：没有找到。上次申请将这一结果填写为“不存在”。", 3: "缓存引用来源：另一个缓存。最初发言人：空。", 4: "本次浏览不会写入历史登录记录。恢复申请除外。", 5: "页面文字未改变。阅读者记录已更新。", 6: state.diaryVisits.includes("那个人") ? "《那个人》正文仍为 0 字。阅读回执已签收。" : "目录完整。持有人一栏仍在等待填写。", 7: "第1900楼显示本次访问时间。上一份申请把它认作了自己的过去。", 8: state.recoveryStep >= 6 ? "核对对象：申请人。原账号资料已不足以继续区分。" : "同号恢复申请正在等待您处理。" };
  if (active && messages[page]) tickerText.textContent = messages[page];
  const echo = document.querySelector("#homeEcho");
  echo.hidden = !active;
  echo.textContent = state.endingPhase === "resolved" ? "[用户中心] 一份已结束的申请" : "[用户中心] 您有一份早于本次访问的恢复回执";
  const note = document.querySelector("#recoveryIdentityNote");
  note.textContent = state.recoveryStep >= 4 ? `资料归属：${state.decisions.subject === "owner" ? "当前申请人" : "待核对"}　／　原持有人：空` : "";
}

function renderReview() {
  clearEndingTimers();
  document.body.classList.remove("published-mode", "identity-slip");
  document.body.classList.add("ghost-mode");
  document.querySelector("#branchReceipt").textContent = checkpoints.map(item => `${item.title}：${item.options.find(([value]) => value === state.decisions[item.key])?.[1] || "旧申请未记录"}`).join("\n");
  document.querySelectorAll("[name=verdict]").forEach(input => { input.checked = input.value === state.verdict; });
  updateBranchActions();
  tickerText.textContent = "全部答案匹配。尚未确认：这些答案属于谁。";
  pageCounter.textContent = "用户中心 / 处理恢复申请";
}

function updateBranchActions() {
  const labels = { later: ["保留记录，结束调查", "清除没有持有人的身份"], alive: ["断开会话，不代替他回答", "保留会话，等待本人回复"], empty: ["保留空缺，撤回申请", "删除这个拼成的身份"] };
  document.querySelector("#branchPreserve").textContent = labels[state.verdict][0];
  document.querySelector("#branchContact").textContent = labels[state.verdict][1];
}

function chooseBranch(action) {
  if (state.endingPhase !== "review" || state.recoveryStep < 7) return;
  if (action === "restore") {
    state.endingPhase = "compose"; saveState(); showPage(11); return;
  }
  if (action === "preserve") resolveEnding(state.verdict === "later" ? "archive" : "refusal");
  if (action === "contact") resolveEnding(state.verdict === "alive" ? "waiting" : "erased");
}

function resolveEnding(ending) {
  if (state.recoveryStep < 7 || !branchStories[ending]) return;
  state.endingPhase = "resolved"; state.ending = ending; state.endingBeat = 0;
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
  if (state.ending === "archive" && state.decisions.trace === "replace") steps[1][1] = "你选择覆盖过旧申请。归档包里却仍有一张回执。\n\n文件名：被覆盖的人。\n处理意见：如果连你也不记得我，就没有人知道被删掉的是什么了。";
  if (state.ending === "erased" && state.decisions.blank === "fill") steps[0][1] += "\n\n补齐姓名时，你选择了‘当前申请人’。删除队列沿用了这个名字。";
  document.querySelector("#branchEndingContent").innerHTML = steps.slice(0, beat + 1).map(([title, body]) => `<article class="ending-letter"><header>${escapeHtml(title)}</header><p>${textToHtml(body)}</p></article>`).join("");
  document.querySelector("#endingNext").hidden = beat >= 3;
  document.querySelector("#endingNext").textContent = story.actions[beat] || "";
  document.querySelector("#endingResolved").hidden = beat < 3;
  document.querySelector("#endingLabel").textContent = story.label;
  document.querySelector("#branchEndingContent").classList.toggle("ending-faded", beat >= 3);
  tickerText.textContent = beat >= 3 ? "本次会话已结束。" : "请求编号 444 / 正在读取处理记录";
  pageCounter.textContent = "恢复申请 / 处理回执";
  if (beat > 0) document.querySelector("#branchEndingContent").lastElementChild?.scrollIntoView({ block: "center", behavior: "auto" });
}

document.addEventListener("change", event => {
  if (event.target.matches("[name=verdict]") && ["later", "alive", "empty"].includes(event.target.value)) {
    state.verdict = event.target.value; saveState(); updateBranchActions();
  }
});

let state = loadState();
let diaryReturnFocus = null;
let deadReturnFocus = null;
let endingTimers = [];
let bodyTypingTimer = null;
let audioContext = null;
let endingMuted = false;
history.scrollRestoration = "manual";

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    const recoveryStep = Math.max(0, Math.min(7, Number(saved?.recoveryStep) || 0));
    const endingPhase = ["none", "manifesting", "review", "compose", "published", "resolved"].includes(saved?.endingPhase)
      ? saved.endingPhase
      : recoveryStep >= 7 ? "manifesting" : "none";
    return {
      ...freshState(),
      storyStarted: Boolean(saved?.storyStarted),
      decisions: Object.fromEntries(Object.entries(saved?.decisions || {}).filter(([key, value]) => ["trace", "subject", "blank"].includes(key) && ["keep", "replace", "visitor", "owner", "leave", "fill"].includes(value))),
      verdict: ["later", "alive", "empty"].includes(saved?.verdict) ? saved.verdict : "later",
      ending: ["archive", "waiting", "erased", "refusal"].includes(saved?.ending) ? saved.ending : "",
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
  return { decisions: {}, verdict: "later", ending: "", endingBeat: 0, diaryVisits: [], storyStarted: false, recoveryStep: 0, threadPage: 1, threadMode: "all", ordinaryTitle: "十年前的网吧，现在还有人记得吗", endingPhase: "none", composeReturnAttempts: 0, publishedAt: "" };
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
  receipt.textContent = state.recoveryStep >= 4 ? `阅读回执：${state.decisions.subject === "owner" ? "原作者" : "第444位访问者"}　／　${content ? "只读" : "正文 0 字，阅读完成"}` : "";
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
  if (floor === 401 && state.recoveryStep >= 4) return { floor, user: "最后一页", time: "2015-05-29 03:11", html: `我刚刚读到一句：<br>“${state.decisions.subject === "owner" ? "这是我的账号，合并记录" : "我是代查的访客，分开保存"}。”<br><br>为什么它还在等人点选？这句话不是早就写在这里了吗？` };
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
  if (state.recoveryStep >= 4 && state.ordinaryTitle === "有没有遇到过已经注销却还在上线的账号") samples.push({ user: "第443位访问者", floor: 17, text: state.decisions.subject === "owner" ? "有人选了‘这是我的账号’。现在轮到我当访客了。" : "我也选过‘我是代查的访客’。这句话后来出现在了我的密保里。" });
  document.querySelector("#ordinaryReplies").innerHTML = samples.map(reply => `<div class="floor"><span><b>${reply.floor}#</b>　${escapeHtml(reply.user)}</span><p>${escapeHtml(reply.text)}</p></div>`).join("");
}

function ghostFloorHtml(post) {
  const postTime = post.current ? stamp() : post.time;
  if (post.floor === 440) post = { ...post, html: state.decisions.trace === "replace" ? "你把上一份申请覆盖了。<br>现在没有记录能证明，在你之前还有一个人。<br><br>那个人刚才也这样做了。" : "你保留了两份申请。<br>一份填着你的答案。<br>另一份也填着你的答案。<br><br>可你只填过一次。" };
  if (post.floor === 442 && state.decisions.blank === "leave") post = { ...post, html: "你把姓名留空了。<br>他们给我留下的也是一个空格。<br><br>可页面不能永远空着。<br>它总要显示一个正在阅读的人。" };
  return `<article class="archive-floor manifest-floor" data-ghost-floor="${post.floor}">
    <header class="archive-floor-head">
      <span>作者：<b>${escapeHtml(post.user)}</b></span><span>时间：${escapeHtml(postTime)}</span>
      <span class="archive-floor-actions">回复　举报　${post.floor}楼</span>
    </header>
    <div class="archive-floor-body">${post.html}</div>
  </article>`;
}

function startGhostSequence() {
  clearEndingTimers();
  ghostReplies.innerHTML = "";
  ghostThreadStats.textContent = "点击：32330　回复：437　共 3 页";
  ghostSystemText.textContent = "正在恢复缺失回复……";
  ghostContinue.hidden = true;
  document.body.classList.add("ghost-mode");
  document.querySelector("#navUserButton").textContent = "用户中心";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const spacing = reducedMotion ? 80 : 1450;

  ghostPosts.forEach((post, index) => {
    later(() => {
      ghostReplies.insertAdjacentHTML("beforeend", ghostFloorHtml(post));
      ghostThreadStats.textContent = `点击：32330　回复：${post.floor}　共 4 页`;
      ghostSystemText.textContent = index === 0 ? "已找到 1 条不属于当前快照的回复。" : `仍在写入…… ${post.floor} / 437`;
      playReplySound(index);
      if (index === 1) document.querySelector("#navUserButton").textContent = "南康好友";
      if (index === 3) {
        document.querySelector("#navUserButton").textContent = "南康白起";
        document.body.classList.add("identity-slip");
      }
      ghostReplies.lastElementChild?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "end" });
    }, (index + 1) * spacing);
  });

  later(() => {
    ghostSystemText.textContent = "恢复进度：99%　两份身份记录发生冲突。";
    ghostContinue.hidden = false;
    ghostContinue.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
    continueRecoveryButton.focus({ preventScroll: true });
  }, (ghostPosts.length + 1) * spacing);
}

function composeWarningText() {
  if (state.composeReturnAttempts === 1) return "你还没有写完。";
  if (state.composeReturnAttempts === 2) return "悼念帖必须由活着的人发表。";
  if (state.composeReturnAttempts >= 3) return "现在只有我是活着的人。";
  return "";
}

function updatePublishAvailability() {
  publishPossessionButton.disabled = possessionTitleInput.value.trim() !== "一路走好" || possessionBody.value !== possessionBodyText;
}

function renderCompose() {
  clearEndingTimers();
  document.body.classList.add("ghost-mode");
  composeWarning.textContent = composeWarningText();
  composeAuthor.textContent = possessionTitleInput.value ? "南康白起" : "南康好友";
  composeStatus.textContent = possessionTitleInput.value ? "在线" : "身份核对中";
  if (!possessionTitleInput.value) possessionBody.value = "";
  else startBodyTyping();
  updatePublishAvailability();
  later(() => possessionTitleInput.focus({ preventScroll: true }), 80);
}

function startBodyTyping() {
  if (bodyTypingTimer || possessionBody.value === possessionBodyText) return;
  let position = possessionBody.value.length;
  bodyTypingTimer = window.setInterval(() => {
    position += 1;
    possessionBody.value = possessionBodyText.slice(0, position);
    possessionBody.scrollTop = possessionBody.scrollHeight;
    if (position >= possessionBodyText.length) {
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
  document.querySelector("#publishedBody").innerHTML = textToHtml(possessionBodyText);
  document.querySelectorAll(".possession-reply").forEach(element => element.classList.remove("revealed"));
  blackoutEnding.classList.remove("active", "message-visible");
  setBlackoutOpen(false);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const replyOneDelay = reducedMotion ? 100 : 1200;
  const replyTwoDelay = reducedMotion ? 200 : 2600;
  const blackoutDelay = reducedMotion ? 1600 : 12000;
  later(() => document.querySelector(".possession-reply")?.classList.add("revealed"), replyOneDelay);
  later(() => {
    document.querySelector(".second-reply")?.classList.add("revealed");
    playReplySound(1);
  }, replyTwoDelay);
  later(() => {
    setBlackoutOpen(true);
    requestAnimationFrame(() => blackoutEnding.classList.add("active"));
    playBlackoutSound();
    later(() => {
      blackoutEnding.classList.add("message-visible");
      blackoutEnding.querySelector("button")?.focus({ preventScroll: true });
    }, reducedMotion ? 50 : 850);
  }, blackoutDelay);
}

function pageFromHash() {
  const match = location.hash.match(/^#page-(\d+)$/);
  return match ? Number(match[1]) : 0;
}

function showPage(requestedPage, addHistory = true) {
  setBlackoutOpen(false);
  let next = Math.max(0, Math.min(14, Number(requestedPage) || 0));
  const phasePage = { manifesting: 9, review: 13, compose: 11, published: 12, resolved: 14 };
  if ([8, 9, 11, 12, 13, 14].includes(next) && state.recoveryStep >= 7) next = phasePage[state.endingPhase] || 9;
  if ([9, 11, 12, 13, 14].includes(next) && state.recoveryStep < 7) next = 8;
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
  if (next === 14) document.title = `${branchStories[state.ending]?.title || "申请记录"} - 远岸用户中心`;
  if (addHistory) history.pushState({ page: next }, "", `#page-${next}`);
  window.scrollTo({ top: 0, behavior: "auto" });
  document.querySelector(`#page-${next} h1, #page-${next} h2, #page-${next} button`)?.focus({ preventScroll: true });
  renderAtmosphere(next);
  if (next === 8) renderRecovery();
  if (next === 9) startGhostSequence();
  else if (next === 11) renderCompose();
  else if (next === 12) renderPublishedEnding();
  else if (next === 13) renderReview();
  else if (next === 14) renderBranchEnding();
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
  recoveryStepNumber.textContent = String(Math.min(7, state.recoveryStep + 1));
  recoveryProgressBar.style.width = `${(state.recoveryStep / 7) * 100}%`;
  pageCounter.textContent = `账号恢复：已核对 ${state.recoveryStep} / 7`;
  const checkpoint = checkpoints.find(item => item.step === state.recoveryStep && !state.decisions[item.key]);
  const checkpointPanel = document.querySelector("#recoveryReceipt");
  checkpointPanel.hidden = !checkpoint;
  if (checkpoint) {
    recoveryForms.forEach(form => form.classList.remove("active"));
    checkpointPanel.innerHTML = `<div class="question-no">恢复记录 / 待处理</div><h2>${checkpoint.title}</h2><div class="receipt-text">${checkpoint.text}</div><div class="receipt-choices">${checkpoint.options.map(([value, label]) => `<button class="old-button" type="button" data-decision="${checkpoint.key}" data-value="${value}">${label}</button>`).join("")}</div>`;
    checkpointPanel.querySelector("button").focus({ preventScroll: true });
    return;
  }
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
  feedback.textContent = ["关系记录已接收。", "空缺十八天已写入。", "没有找到原始发言人，继续使用当前申请。", "时间记录已接收。", "标题已接收。正文仍为零字。", "1894 楼已保留。正在比对本次申请。", "资料匹配。正在恢复申请人。"][index];
  if (index === recoveryForms.length - 1) {
    prepareEndingAudio();
    state.endingPhase = "manifesting";
  }
  state.recoveryStep += 1;
  saveState();
  later(() => {
    if (!document.querySelector("#page-8").classList.contains("active")) return;
    if (state.recoveryStep >= 7) showPage(9);
    else { renderRecovery(); renderAtmosphere(8); }
  }, 520);
}

document.addEventListener("click", event => {
  const decision = event.target.closest("[data-decision]");
  if (decision) {
    const checkpoint = checkpoints.find(item => item.key === decision.dataset.decision && item.step === state.recoveryStep);
    if (!checkpoint || state.decisions[checkpoint.key] || !checkpoint.options.some(([value]) => value === decision.dataset.value)) return;
    state.decisions[checkpoint.key] = decision.dataset.value;
    saveState(); renderRecovery(); renderAtmosphere(8); return;
  }
  const branchAction = event.target.closest("[data-branch-action]");
  if (branchAction) { chooseBranch(branchAction.dataset.branchAction); return; }
  if (event.target.closest("[data-ending-next]")) {
    state.endingBeat = Math.min(3, state.endingBeat + 1); saveState(); renderBranchEnding(); return;
  }
  if (event.target.closest("[data-replay-branch]")) {
    state.endingPhase = "review"; state.ending = ""; state.endingBeat = 0;
    possessionTitleInput.value = ""; possessionBody.value = "";
    saveState(); showPage(13); return;
  }
  if (event.target.closest("[data-withdraw]")) { resolveEnding("refusal"); return; }

  if (event.target === continueRecoveryButton) {
    state.endingPhase = "review";
    state.verdict = state.decisions.subject === "owner" ? "alive" : state.decisions.blank === "fill" ? "empty" : "later";
    saveState();
    showPage(13);
    return;
  }
  if (event.target === soundToggle || event.target.closest("[data-mute]")) {
    endingMuted = !endingMuted;
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
    if (possessionTitleInput.value.trim() !== "一路走好" || possessionBody.value !== possessionBodyText) return;
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

possessionTitleInput.addEventListener("input", () => {
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

document.querySelector("#restartButton").addEventListener("click", () => {
  clearEndingTimers();
  state = freshState();
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
    form.querySelector(".recovery-feedback").textContent = "";
  });
  showPage(0);
});

window.addEventListener("popstate", event => {
  const page = Number.isInteger(Number(event.state?.page)) ? Number(event.state.page) : pageFromHash();
  showPage(page, false);
});

const initialPage = pageFromHash();
if (initialPage >= 1 && initialPage <= 14 && initialPage !== 10) {
  state.storyStarted = true;
  saveState();
}
document.querySelector("#nowStamp").textContent = stamp();
history.replaceState({ page: initialPage }, "", initialPage ? `#page-${initialPage}` : location.pathname + location.search);
showPage(initialPage, false);
