// ===== 数据层：localStorage 存储 =====
const STORAGE_KEY = 'study_review_data';
const REVIEW_DAYS = [0, 1, 2, 4, 7, 15, 30];

// 云端备份的错题数据（预装在网站中，首次访问自动加载）
const SEED_DATA = {
  "math": [
    {
      "q": "1+1=？",
      "err": "",
      "ans": "",
      "exp": "",
      "created_time": 1780495061959,
      "review_date": "2026-06-03",
      "mastered": true,
      "review_count": 0
    },
    {
      "q": "8*7",
      "err": "",
      "ans": "",
      "exp": "",
      "created_time": 1780495102876,
      "review_date": "2026-06-03",
      "mastered": true,
      "review_count": 0
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "29+35",
      "err": "6",
      "ans": "64",
      "exp": "",
      "created_time": 1781914613045,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "52+30/5",
      "err": "59",
      "ans": "58",
      "exp": "",
      "created_time": 1781914637544,
      "review_date": "2026-06-20"
    }
  ],
  "chinese": [
    {
      "mastered": false,
      "review_count": 0,
      "q": "骨头",
      "err": "",
      "ans": "",
      "exp": "",
      "created_time": 1781531606700,
      "review_date": "2026-06-15"
    },
    {
      "mastered": false,
      "review_count": 0,
      "q": "猴子",
      "err": "",
      "ans": "",
      "exp": "",
      "created_time": 1781531614597,
      "review_date": "2026-06-15"
    },
    {
      "q": "骨",
      "err": "",
      "ans": "骨",
      "exp": "里面不好写",
      "review_date": "2026-05-29",
      "mastered": true,
      "created_time": 1780000000000,
      "review_count": 0
    },
    {
      "q": "小猴",
      "err": "少写一撇",
      "ans": "",
      "exp": "",
      "created_time": 1780666511716,
      "review_date": "2026-06-05",
      "mastered": false,
      "review_count": 0
    },
    {
      "q": "轮流",
      "err": "轮（留），留是错的",
      "ans": "轮流",
      "exp": "",
      "created_time": 1780666589449,
      "review_date": "2026-06-05",
      "mastered": false,
      "review_count": 0
    },
    {
      "q": "挣脱",
      "err": "不是一声",
      "ans": "读四声",
      "exp": "",
      "created_time": 1780668700552,
      "review_date": "2026-06-05",
      "mastered": false,
      "review_count": 0
    },
    {
      "q": "绿茵",
      "err": "ying后鼻音错误",
      "ans": "yin",
      "exp": "",
      "created_time": 1780668724189,
      "review_date": "2026-06-05",
      "mastered": false,
      "review_count": 0
    },
    {
      "q": "一（）河马",
      "err": "只",
      "ans": "头",
      "exp": "",
      "created_time": 1780668743652,
      "review_date": "2026-06-05",
      "mastered": false,
      "review_count": 0
    },
    {
      "q": "九牛二虎之力",
      "err": "虎写错",
      "ans": "虎",
      "exp": "",
      "created_time": 1780668774951,
      "review_date": "2026-06-05",
      "mastered": false,
      "review_count": 0
    },
    {
      "q": "仿写就像 绿油油的小柏树就像战士一样笔直地站在那里",
      "err": "春风就像剪刀，\n不完整",
      "ans": "",
      "exp": "",
      "created_time": 1780668876068,
      "review_date": "2026-06-05",
      "mastered": false,
      "review_count": 0
    },
    {
      "q": "hang tian yuan",
      "err": "",
      "ans": "",
      "exp": "",
      "created_time": 1780668888452,
      "review_date": "2026-06-05",
      "mastered": false,
      "review_count": 0
    },
    {
      "q": "bo che",
      "err": "",
      "ans": "",
      "exp": "",
      "created_time": 1780668896133,
      "review_date": "2026-06-05",
      "mastered": false,
      "review_count": 0
    },
    {
      "q": "一盏灯的拼音",
      "err": "",
      "ans": "",
      "exp": "",
      "created_time": 1780668922034,
      "review_date": "2026-06-05",
      "mastered": false,
      "review_count": 0
    },
    {
      "q": "补 组词",
      "err": "",
      "ans": "",
      "exp": "",
      "created_time": 1780668933154,
      "review_date": "2026-06-05",
      "mastered": false,
      "review_count": 0
    },
    {
      "q": "接天莲叶",
      "err": "（连）叶  错误",
      "ans": "",
      "exp": "",
      "created_time": 1780668992853,
      "review_date": "2026-06-05",
      "mastered": false,
      "review_count": 0
    },
    {
      "q": "chuan bo",
      "err": "",
      "ans": "船舶",
      "exp": "",
      "created_time": 1780669027919,
      "review_date": "2026-06-05",
      "mastered": false,
      "review_count": 0
    },
    {
      "q": "通 组词",
      "err": "",
      "ans": "",
      "exp": "",
      "created_time": 1780669035837,
      "review_date": "2026-06-05",
      "mastered": false,
      "review_count": 0
    },
    {
      "q": "地窖 拼音",
      "err": "Jao",
      "ans": "Jiao",
      "exp": "",
      "created_time": 1780669082401,
      "review_date": "2026-06-05",
      "mastered": false,
      "review_count": 0
    },
    {
      "q": "笑眯眯",
      "err": "咪",
      "ans": "",
      "exp": "",
      "created_time": 1780669090634,
      "review_date": "2026-06-05",
      "mastered": false,
      "review_count": 0
    },
    {
      "q": "哈密瓜",
      "err": "",
      "ans": "",
      "exp": "",
      "created_time": 1780669122334,
      "review_date": "2026-06-05",
      "mastered": false,
      "review_count": 0
    },
    {
      "q": "diao tou",
      "err": "（调）头",
      "ans": "掉头",
      "exp": "",
      "created_time": 1780669142503,
      "review_date": "2026-06-05",
      "mastered": false,
      "review_count": 0
    },
    {
      "mastered": false,
      "review_count": 0,
      "q": "打量",
      "err": "",
      "ans": "",
      "exp": "",
      "created_time": 1781781541439,
      "review_date": "2026-06-18"
    },
    {
      "mastered": false,
      "review_count": 0,
      "q": "笨拙",
      "err": "础",
      "ans": "",
      "exp": "",
      "created_time": 1781781556807,
      "review_date": "2026-06-18"
    },
    {
      "mastered": false,
      "review_count": 0,
      "q": "仿佛",
      "err": "拂",
      "ans": "",
      "exp": "",
      "created_time": 1781781583093,
      "review_date": "2026-06-18"
    },
    {
      "mastered": false,
      "review_count": 0,
      "q": "羡慕",
      "err": "",
      "ans": "",
      "exp": "",
      "created_time": 1781781594226,
      "review_date": "2026-06-18"
    },
    {
      "mastered": false,
      "review_count": 0,
      "q": "与世隔绝",
      "err": "",
      "ans": "",
      "exp": "",
      "created_time": 1781781630027,
      "review_date": "2026-06-18"
    },
    {
      "mastered": false,
      "review_count": 0,
      "q": "迟疑",
      "err": "",
      "ans": "",
      "exp": "",
      "created_time": 1781781637897,
      "review_date": "2026-06-18"
    },
    {
      "mastered": false,
      "review_count": 0,
      "q": "尽心竭力",
      "err": "",
      "ans": "",
      "exp": "",
      "created_time": 1781781658812,
      "review_date": "2026-06-18"
    },
    {
      "mastered": false,
      "review_count": 0,
      "q": "规律",
      "err": "",
      "ans": "",
      "exp": "",
      "created_time": 1781781670395,
      "review_date": "2026-06-18"
    },
    {
      "mastered": false,
      "review_count": 0,
      "q": "耐心",
      "err": "",
      "ans": "",
      "exp": "",
      "created_time": 1781781678147,
      "review_date": "2026-06-18"
    },
    {
      "mastered": false,
      "review_count": 0,
      "q": "时辰",
      "err": "晨",
      "ans": "",
      "exp": "",
      "created_time": 1781781692114,
      "review_date": "2026-06-18"
    },
    {
      "mastered": false,
      "review_count": 0,
      "q": "灵巧",
      "err": "",
      "ans": "",
      "exp": "",
      "created_time": 1781781700398,
      "review_date": "2026-06-18"
    },
    {
      "mastered": false,
      "review_count": 0,
      "q": "挣脱",
      "err": "",
      "ans": "",
      "exp": "",
      "created_time": 1781781711449,
      "review_date": "2026-06-18"
    },
    {
      "mastered": false,
      "review_count": 0,
      "q": "轻盈",
      "err": "",
      "ans": "",
      "exp": "",
      "created_time": 1781781719415,
      "review_date": "2026-06-18"
    },
    {
      "mastered": false,
      "review_count": 0,
      "q": "色彩斑斓",
      "err": "",
      "ans": "",
      "exp": "",
      "created_time": 1781781727465,
      "review_date": "2026-06-18"
    },
    {
      "mastered": false,
      "review_count": 0,
      "q": "斑斓",
      "err": "",
      "ans": "",
      "exp": "",
      "created_time": 1781781744349,
      "review_date": "2026-06-18"
    },
    {
      "mastered": false,
      "review_count": 0,
      "q": "雾霭",
      "err": "",
      "ans": "",
      "exp": "",
      "created_time": 1781781753121,
      "review_date": "2026-06-18"
    },
    {
      "mastered": false,
      "review_count": 0,
      "q": "生机勃勃",
      "err": "",
      "ans": "",
      "exp": "",
      "created_time": 1781781762490,
      "review_date": "2026-06-18"
    },
    {
      "mastered": false,
      "review_count": 0,
      "q": "羡慕",
      "err": "",
      "ans": "",
      "exp": "",
      "created_time": 1781781777651,
      "review_date": "2026-06-18"
    },
    {
      "mastered": false,
      "review_count": 0,
      "q": "等待",
      "err": "",
      "ans": "",
      "exp": "",
      "created_time": 1781781782985,
      "review_date": "2026-06-18"
    },
    {
      "mastered": false,
      "review_count": 0,
      "q": "元宵",
      "err": "",
      "ans": "",
      "exp": "",
      "created_time": 1781781810554,
      "review_date": "2026-06-18"
    },
    {
      "mastered": false,
      "review_count": 0,
      "q": "牛郎",
      "err": "",
      "ans": "",
      "exp": "",
      "created_time": 1781781822004,
      "review_date": "2026-06-18"
    },
    {
      "mastered": false,
      "review_count": 0,
      "q": "灌溉",
      "err": "",
      "ans": "",
      "exp": "",
      "created_time": 1781781851221,
      "review_date": "2026-06-18"
    },
    {
      "mastered": false,
      "review_count": 0,
      "q": "喝水",
      "err": "",
      "ans": "",
      "exp": "",
      "created_time": 1781781856455,
      "review_date": "2026-06-18"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "hua2 luo4",
      "err": "",
      "ans": "滑落",
      "exp": "",
      "created_time": 1781913172046,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "cha2 jue2",
      "err": "",
      "ans": "察觉",
      "exp": "",
      "created_time": 1781913232527,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "有志者事O成，志当O高远，穷且OO，不O青云之志",
      "err": "间",
      "ans": "有志者事竟成，志当存高远，穷且益坚，不坠青云之志",
      "exp": "",
      "created_time": 1781913356641,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "dai3  zu2",
      "err": "",
      "ans": "傣族",
      "exp": "",
      "created_time": 1781913492125,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "二月O风似剪刀",
      "err": "下面写成了目",
      "ans": "春",
      "exp": "",
      "created_time": 1781913538924,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "长O鹿",
      "err": "",
      "ans": "颈",
      "exp": "",
      "created_time": 1781913623540,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "O种",
      "err": "",
      "ans": "栽",
      "exp": "",
      "created_time": 1781913698241,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "ceng2 经",
      "err": "写成了目字底",
      "ans": "曾经",
      "exp": "",
      "created_time": 1781913758398,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "O时O正，不O晚，O反O物OO，办O",
      "err": "",
      "ans": "及时改正，不算晚，违反事物规律，办糟",
      "exp": "",
      "created_time": 1781914155387,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "又O又小",
      "err": "",
      "ans": "又瘦又小",
      "exp": "",
      "created_time": 1781914285577,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "温（暧）",
      "err": "",
      "ans": "温暖",
      "exp": "",
      "created_time": 1781914316693,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "胳膊（者）痛了",
      "err": "",
      "ans": "胳膊都痛了",
      "exp": "",
      "created_time": 1781914399643,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "O炮",
      "err": "",
      "ans": "鞭跑",
      "exp": "",
      "created_time": 1781914495726,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "章的部首",
      "err": "",
      "ans": "音",
      "exp": "",
      "created_time": 1781914721319,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "麝的部首",
      "err": "",
      "ans": "鹿",
      "exp": "",
      "created_time": 1781914807943,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "翁的拼音",
      "err": "",
      "ans": "weng1",
      "exp": "",
      "created_time": 1781914828331,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "（成）信",
      "err": "",
      "ans": "诚信",
      "exp": "",
      "created_time": 1781914859709,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "服wu4",
      "err": "",
      "ans": "务",
      "exp": "",
      "created_time": 1781914909076,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "yong3 gan3",
      "err": "",
      "ans": "勇敢",
      "exp": "",
      "created_time": 1781915040273,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "xin1 yin3",
      "err": "",
      "ans": "吸引",
      "exp": "",
      "created_time": 1781915131026,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "应该",
      "err": "yin1",
      "ans": "ying1",
      "exp": "",
      "created_time": 1781915212946,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "紧张",
      "err": "jing3",
      "ans": "jin3",
      "exp": "",
      "created_time": 1781915236214,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "山峰",
      "err": "锋",
      "ans": "山峰",
      "exp": "",
      "created_time": 1781915258648,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "平时O帮人，急时有人帮",
      "err": "",
      "ans": "肯帮人",
      "exp": "",
      "created_time": 1781915312000,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "不如雪中送O",
      "err": "炭",
      "ans": "",
      "exp": "",
      "created_time": 1781915334119,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "植",
      "err": "少了一横",
      "ans": "植",
      "exp": "",
      "created_time": 1781915563918,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "眉",
      "err": "下面写成了日",
      "ans": "眉",
      "exp": "",
      "created_time": 1781915583468,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "旁边",
      "err": "傍",
      "ans": "旁",
      "exp": "",
      "created_time": 1781915616687,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "匹",
      "err": "里面没有勾",
      "ans": "匹",
      "exp": "",
      "created_time": 1781915663573,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "津的拼音",
      "err": "",
      "ans": "jin1",
      "exp": "",
      "created_time": 1781915720643,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "乞",
      "err": "",
      "ans": "qi3",
      "exp": "",
      "created_time": 1781915740427,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "yu3 gong4",
      "err": "",
      "ans": "与共",
      "exp": "",
      "created_time": 1781915760511,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "营",
      "err": "",
      "ans": "ying2",
      "exp": "",
      "created_time": 1781915776513,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "ju4 chang3",
      "err": "",
      "ans": "剧场",
      "exp": "",
      "created_time": 1781917036466,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "da1 shu1",
      "err": "上面不是止",
      "ans": "大叔",
      "exp": "",
      "created_time": 1781917066349,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "hua4 妆",
      "err": "画",
      "ans": "化妆",
      "exp": "",
      "created_time": 1781917097517,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "O重",
      "err": "",
      "ans": "尊重",
      "exp": "",
      "created_time": 1781917274698,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "云霭的霭意思",
      "err": "和气",
      "ans": "云气",
      "exp": "",
      "created_time": 1781917329561,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "豹子",
      "err": "多了两个点",
      "ans": "豹子",
      "exp": "",
      "created_time": 1781917364347,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "慌张",
      "err": "没有草字头",
      "ans": "慌张",
      "exp": "",
      "created_time": 1781917926310,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "变成蝴蝶而（以）",
      "err": "以",
      "ans": "而已",
      "exp": "",
      "created_time": 1781918209018,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "新奇",
      "err": "",
      "ans": "",
      "exp": "",
      "created_time": 1781918414199,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "纺织",
      "err": "",
      "ans": "",
      "exp": "",
      "created_time": 1781918425013,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "kan3 刀",
      "err": "",
      "ans": "砍刀",
      "exp": "",
      "created_time": 1781918438883,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "bing4 fei1",
      "err": "",
      "ans": "并非",
      "exp": "",
      "created_time": 1781918454053,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "筋疲力尽",
      "err": "jing1",
      "ans": "jin1",
      "exp": "",
      "created_time": 1781918558476,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "wang4 que4",
      "err": "忘多了一点",
      "ans": "忘却",
      "exp": "",
      "created_time": 1781918591886,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "zhi4 fu2",
      "err": "",
      "ans": "治服",
      "exp": "",
      "created_time": 1781918665523,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "转的第三笔",
      "err": "提",
      "ans": "竖",
      "exp": "",
      "created_time": 1781918695322,
      "review_date": "2026-06-20"
    },
    {
      "mastered": false,
      "interval_index": 0,
      "q": "礼仪祭祀",
      "err": "",
      "ans": "",
      "exp": "",
      "created_time": 1781918716111,
      "review_date": "2026-06-20"
    }
  ],
  "english": [],
  "words": [
    {
      "word": "Dangeous",
      "phon": "",
      "pos": "",
      "mean": "",
      "coll": "",
      "tip": "",
      "review_date": "2026-05-29",
      "mastered": true,
      "created_time": 1780000000000,
      "review_count": 0
    },
    {
      "word": "wash my hands",
      "phon": "",
      "pos": "",
      "mean": "洗手",
      "coll": "",
      "tip": "",
      "created_time": 1781620198618,
      "review_date": "2026-06-16",
      "mastered": false,
      "review_count": 0
    },
    {
      "word": "say good night",
      "phon": "",
      "pos": "",
      "mean": "说晚安",
      "coll": "",
      "tip": "",
      "created_time": 1781620214404,
      "review_date": "2026-06-16",
      "mastered": false,
      "review_count": 0
    },
    {
      "word": "Robot",
      "phon": "o发音跟ago一样， 不是hot的o",
      "pos": "",
      "mean": "机器人",
      "coll": "",
      "tip": "",
      "created_time": 1781914588259,
      "review_date": "2026-06-20",
      "mastered": false,
      "interval_index": 0,
      "review_count": 0
    }
  ],
  "stars": 438,
  "last_login": "2026-06-26"
};

function getDefaultData() {
  // 尝试从 localStorage 读取，如果没有则使用云端备份数据
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  // 首次使用，导入云端备份
  const copy = JSON.parse(JSON.stringify(SEED_DATA));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(copy));
  return copy;
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultData();
    const data = JSON.parse(raw);
    for (const k of ['math','chinese','english','words']) {
      if (!Array.isArray(data[k])) data[k] = [];
    }
    if (typeof data.stars !== 'number') data.stars = 0;
    if (typeof data.last_login !== 'string') data.last_login = '';
    return data;
  } catch(e) {
    console.warn('数据加载失败，重置', e);
    return getDefaultData();
  }
}

function saveData(data, skipCloudSync) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // 本地存完后，自动同步到云端（静默、不阻塞）
    if (!skipCloudSync) {
      autoSyncToCloud(data);
    }
    return true;
  } catch(e) {
    alert('保存失败！浏览器存储空间可能已满。\n请导出数据备份。');
    return false;
  }
}

// 自动静默同步到云端（不阻塞、不弹窗）
let _autoSyncPending = false;
function autoSyncToCloud(data) {
  if (_autoSyncPending) return;
  const config = getCloudConfig();
  if (!config.gistId || !config.token) return;
  _autoSyncPending = true;
  const url = `${GIST_API}/${config.gistId}?access_token=${encodeURIComponent(config.token)}`;
  fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      files: { [GIST_FILENAME]: { content: JSON.stringify(data) } }
    })
  }).then(r => {
    if (!r.ok) console.warn('云端自动同步 HTTP', r.status);
  }).catch(e => {
    console.warn('云端自动同步失败（本地数据已保存，下次打开会自动同步）');
  }).finally(() => {
    _autoSyncPending = false;
  });
}

// 启动时从云端自动加载
async function autoLoadFromCloud() {
  const config = getCloudConfig();
  if (!config.gistId) return;
  try {
    let url = `${GIST_API}/${config.gistId}`;
    if (config.token) url += `?access_token=${encodeURIComponent(config.token)}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const result = await resp.json();
    const content = result.files?.[GIST_FILENAME]?.content;
    if (!content) throw new Error('Gist 中未找到数据');
    const cloudData = JSON.parse(content);
    if (cloudData && typeof cloudData === 'object') {
      const localData = loadData();
      cloudData.stars = Math.max(cloudData.stars || 0, localData.stars || 0);
      if ((cloudData.last_login || '') < (localData.last_login || ''))
        cloudData.last_login = localData.last_login;
      for (const k of ['math','chinese','english','words']) {
        const localMap = new Map();
        for (const item of localData[k] || []) localMap.set(item.created_time, item);
        for (const item of cloudData[k] || []) {
          if (!localMap.has(item.created_time)) localMap.set(item.created_time, item);
        }
        cloudData[k] = Array.from(localMap.values());
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData));
      console.log('☁️ 已从云端自动加载数据');
    }
  } catch(e) {
    console.warn('云端自动加载失败，使用本地数据', e);
  }
}

// 工具函数
function now() { return Date.now(); }
function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

function formatDateShort(ds) {
  if (!ds) return '';
  return ds; // already YYYY-MM-DD
}

function isDue(reviewDate) {
  if (!reviewDate) return true;
  return reviewDate <= today();
}

// 艾宾浩斯遗忘曲线：下次复习日 = 上次复习日 + REVIEW_DAYS[intervalIndex]
// intervalIndex 递增：0→1→2→4→7→15→30 天
function getNextReviewDate(baseDate, intervalIndex) {
  const d = new Date(baseDate || now());
  const days = intervalIndex < REVIEW_DAYS.length ? REVIEW_DAYS[intervalIndex] : 30;
  d.setDate(d.getDate() + days);
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  return `${d.getFullYear()}-${m}-${day}`;
}

// 按日期分组：今日到期 vs 过往过期
function groupDueItems(items) {
  const t = today();
  return {
    todayDue: items.filter(x => x.item.review_date === t),
    overdue: items.filter(x => x.item.review_date < t)
  };
}

// 星星徽章
function starBadge(count) {
  if (count >= 100) return '⭐⭐⭐';
  if (count >= 50) return '⭐⭐';
  if (count >= 10) return '⭐';
  return '☆';
}

// 科目名称
function subjectName(k) {
  return {math:'数学', chinese:'语文', english:'英语', words:'单词'}[k] || k;
}

function subjectTag(k) {
  return {math:'数学', chinese:'语文', english:'英语题', words:'单词'}[k] || k;
}

function itemDisplay(item, k) {
  return k === 'words' ? (item.word || '') : (item.q || '');
}

// ===== 星星系统 =====
function addStars(n) {
  const data = loadData();
  data.stars = (data.stars || 0) + n;
  saveData(data);
  return data.stars;
}

function checkLoginStars() {
  const t = today();
  const data = loadData();
  if (data.last_login !== t) {
    data.stars = (data.stars || 0) + 1;
    data.last_login = t;
    saveData(data);
  }
}

// ===== 导出/导入 =====
function exportData() {
  const data = loadData();
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `复习数据备份_${today()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.math || !data.chinese || !data.english || !data.words) {
        alert('文件格式不正确，请选择正确的备份文件。');
        return;
      }
      saveData(data);
      alert(`✅ 导入成功！\n共 ${data.math.length + data.chinese.length + data.english.length + data.words.length} 条数据`);
      switchView(currentView);
    } catch(e) {
      alert('❌ 文件解析失败，请确认是有效的备份文件。');
    }
  };
  reader.readAsText(file);
}

// ===== Gitee Gist 云端同步（国内可用、支持 CORS） =====
const GIST_API = 'https://gitee.com/api/v5/gists';
const GIST_FILENAME = 'study_review_data.json';

function getCloudConfig() {
  try {
    const raw = localStorage.getItem('cloud_config');
    return raw ? JSON.parse(raw) : { token: '', gistId: '' };
  } catch { return { token: '', gistId: '' }; }
}

function saveCloudConfig(config) {
  localStorage.setItem('cloud_config', JSON.stringify(config));
}

// Gitee 的 token 通过 query param 或者 Bearer header 都行
function gistOpts(method, body) {
  const cfg = getCloudConfig();
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  return opts;
}

function gistUrl(path) {
  const cfg = getCloudConfig();
  let url = path;
  if (cfg.token) url += (url.includes('?') ? '&' : '?') + `access_token=${encodeURIComponent(cfg.token)}`;
  return url;
}

async function gistCreate(data) {
  const cfg = getCloudConfig();
  if (!cfg.token) throw new Error('❌ 需要 Gitee 私人令牌');

  const resp = await fetch(gistUrl(GIST_API), gistOpts('POST', {
    description: 'study_review_data (auto-sync)',
    public: false,
    files: { [GIST_FILENAME]: { content: JSON.stringify(data) } }
  }));
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.message || `创建失败 (${resp.status})`);
  }
  const result = await resp.json();
  return result.id;
}

async function gistRead(gistId) {
  const resp = await fetch(gistUrl(`${GIST_API}/${gistId}`));
  if (!resp.ok) throw new Error(`读取失败 (${resp.status})`);
  const result = await resp.json();
  const content = result.files?.[GIST_FILENAME]?.content;
  if (!content) throw new Error('Gist 中未找到数据文件');
  return JSON.parse(content);
}

async function gistUpdate(gistId, data) {
  const cfg = getCloudConfig();
  if (!cfg.token) throw new Error('❌ 需要 Gitee 私人令牌');

  const resp = await fetch(gistUrl(`${GIST_API}/${gistId}`), gistOpts('PATCH', {
    files: { [GIST_FILENAME]: { content: JSON.stringify(data) } }
  }));
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.message || `更新失败 (${resp.status})`);
  }
  return true;
}

async function syncToCloud() {
  const config = getCloudConfig();
  const data = loadData();
  if (config.gistId) {
    await gistUpdate(config.gistId, data);
    return '✅ 已同步到云端';
  } else {
    const gistId = await gistCreate(data);
    config.gistId = gistId;
    saveCloudConfig(config);
    return `✅ 已创建云端仓库！Gist ID: ${gistId}`;
  }
}

async function syncFromCloud() {
  const config = getCloudConfig();
  if (!config.gistId) throw new Error('请先创建或输入 Gist ID');
  const cloudData = await gistRead(config.gistId);
  saveData(cloudData, true);
  return '✅ 已从云端加载数据';
}

async function syncMergeFromCloud() {
  const config = getCloudConfig();
  if (!config.gistId) throw new Error('请先设置 Gist ID');
  const cloudData = await gistRead(config.gistId);
  const localData = loadData();
  for (const k of ['math','chinese','english','words']) {
    const localMap = new Map();
    for (const item of localData[k]) localMap.set(item.created_time, item);
    for (const item of cloudData[k] || []) localMap.set(item.created_time, item);
    localData[k] = Array.from(localMap.values());
  }
  localData.stars = Math.max(localData.stars || 0, cloudData.stars || 0);
  if ((cloudData.last_login || '') > (localData.last_login || ''))
    localData.last_login = cloudData.last_login;
  saveData(localData, true);
  return '✅ 已合并云端数据（本地+云端）';
}
