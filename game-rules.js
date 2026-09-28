(function (root) {
  const questions = [
    { key: 'relation', title: '悼念帖楼主如何说明自己与南康的关系？', answer: 'reader', options: [['classmate','现实中的同学和好友'],['reader','只听过名字、了解一点的网友'],['reporter','负责报道的记者'],['family','受家人委托发布消息的人']] },
    { key: 'days', title: '转述里说 3 月 9 日失去联系，悼念帖发布于 3 月 27 日。两日相隔多少天？', answer: '18', options: [['17','17 天'],['19','19 天'],['18','18 天'],['27','27 天']] },
    { key: 'source', title: '“旺仔”转述作为直接证词，最关键的是缺少什么？', answer: 'missing-source', options: [['missing-source','原账号、原帖日期、楼层与链接'],['photo','一张当事人的照片'],['school','学校名称和班级名单'],['reposts','足够多的转发与相同说法']] },
    { key: 'dates', title: '账号记录中，上线、重置、注销三项的月日依次是什么？', answer: '050705190615', options: [['051905070615','05月19日 → 05月07日 → 06月15日'],['061505190507','06月15日 → 05月19日 → 05月07日'],['050706150519','05月07日 → 06月15日 → 05月19日'],['050705190615','05月07日 → 05月19日 → 06月15日']] },
    { key: 'diary', title: '日记目录中，被加密的那篇日记叫什么？', answer: '那个人', options: [['清晨六点','《清晨六点》'],['那个人','《那个人》'],['浮生六记','《浮生六记》'],['我等你到三十五岁','《我等你到三十五岁》']] },
    { key: 'floor', title: '闲情调查中，最后一条可以复核的登录记录在第几楼？', answer: '1894', options: [['1894','第 1894 楼'],['1900','第 1900 楼'],['437','第 437 楼'],['200','第 200 楼']] },
    { key: 'ghost', title: '是谁不断制造了账号“死后上线”的记录？', answer: 'later-users', options: [['owner','原账号主人'],['admin','新闻网站管理员'],['later-users','后来拿泄露凭据验证传闻的人'],['automatic','无人操作，旧网站自动生成了所有登录记录']] }
  ];
  const failures = [
    { ending:'possession', name:'熟人', notice:'关系已补入。待核对的不是他，是你。', ghosts:['原帖没有记录下见过他的人。现在有了。','既然你认识他，为什么你的注册记录是今天？','你的过去太短了。我有很多，可以给你。'], dark:'你已经替我认识了所有人。', body:'楼主说自己认识他。\n\n系统问他从哪里认识的，他找不到一段属于自己的过去。于是网页把另一个人的日记、留言和告别，全都放进了他的个人空间。\n\n现在每个人都记得他。只是没有人再叫他原来的名字。\n\n以此文字，送别第444位访问者。' },
    { ending:'waiting', name:'空出来的那一天', notice:'日期已收下。等待开始于你离开的那天。', ghosts:['你填的日数和旧帖不一样。系统没有纠正，只把多出来或少掉的那段时间留给了你。','你以为自己只是在算两天的距离。','对方已等待很久。现在轮到你了。'] },
    { ending:'erased', name:'没有来源的人', notice:'证词已接收。发言人的来源不再保留。', ghosts:['没有原始发言人的话，也被你认可了。','所以这条回复不需要一个发言人。','你为什么还坚持说，屏幕前一定有人？'] },
    { ending:'reversed', name:'先注销的人', notice:'时间顺序已采用。旧记录正在按你的答案重排。', ghosts:['日期不能同时成立。系统保留了你提交的版本。','为了让这次登录合法，它需要一位在注销以后仍能操作的人。','你的退出时间已经填好了。比你进入这里更早。'] },
    { ending:'diary', name:'日记的作者', notice:'标题已关联。正文仍然不存在，但作者可以补齐。', ghosts:['你指认了另一篇文章。目录里那个空白并没有消失。','一个没有正文的标题，等到了肯替它署名的人。','不要往前翻。前面的日记已经开始称你为“我”。'], dark:'你没有读到的部分，正在写你。', body:'今天有人点开了日记目录。\n\n他选了一个熟悉的标题，想证明自己来过。目录没有接受那个标题，却接受了他的名字。\n\n下一篇日记写着他如何离开这里。再下一篇已经写完，没有日期。\n\n我不知道他为什么还在读。\n\n如果他把这篇发表出去，别人就会以为这些都是他写的。' },
    { ending:'replacement', name:'第1900楼', notice:'楼层已写入。当前访问将被用作历史记录。', ghosts:['那不是最后一条可以复核的记录。系统用本次访问填补了空位。','刚才还写着“当前时间”的一行，现在被放进了旧帖。','请不要刷新。刷新以后，你就是被引用的那个人。'] },
    { ending:'refusal', name:'下一位', notice:'操作者已确认。你的这次操作没有被计入。', ghosts:['你把后来登录的人，从答案里删掉了。','可你刚刚也在尝试恢复这个账号。','如果这些记录不是后来的人留下的，你准备把自己算作谁？'] }
  ];
  function evaluateAnswer(index, value) {
    const question = questions[index];
    if (!question || !question.options.some(option => option[0] === value)) return { valid:false };
    const correct = value === question.answer;
    return { valid:true, correct, question:index + 1, ending:correct ? (index === 6 ? 'archive' : null) : failures[index].ending };
  }
  const rules = { questions, failures, evaluateAnswer };
  if (typeof module !== 'undefined' && module.exports) module.exports = rules;
  else root.QUEST_RULES = rules;
})(typeof window !== 'undefined' ? window : globalThis);
