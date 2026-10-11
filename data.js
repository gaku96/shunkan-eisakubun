// 動画「ネイティブが毎日使う『英会話の型』30選」の構文データ
// 各構文の最初の例文は動画内の例文、残りは追加の練習用例文です。
window.PARTS = [
  { id: 1, name: "Part① 断定を避ける構文" },
  { id: 2, name: "Part② 自分について語れる構文" },
  { id: 3, name: "Part③ 感情をリアルに伝えられる構文" },
  { id: 4, name: "Part④ 会話を広げられる構文" },
  { id: 5, name: "Part⑤ 一歩差がつく構文" },
];

window.PATTERNS = [
  // ---------- Part 1 ----------
  {
    id: 1, part: 1, en: "I'd say ~", ja: "〜くらいかな",
    note: "数字や割合などをざっくり見積もって、保険をかけながら伝える。",
    examples: [
      { ja: "大体80%は在宅で仕事してるかな。", en: "I'd say 80% of the time I'm working from home." },
      { ja: "彼は30歳くらいかな。", en: "I'd say he's around 30." },
      { ja: "駅まで歩いて10分くらいかな。", en: "I'd say it's about a 10-minute walk to the station." },
      { ja: "この映画は10点中7点ってとこかな。", en: "I'd say this movie is a 7 out of 10." },
    ],
  },
  {
    id: 2, part: 1, en: "It depends on ~", ja: "〜によるかな",
    note: "即答を避け、条件によって変わることを示す。",
    examples: [
      { ja: "時間がどれだけあるかによるかな。", en: "It depends on how much time we have." },
      { ja: "天気によるね。", en: "It depends on the weather." },
      { ja: "値段によるかな。", en: "It depends on the price." },
      { ja: "誰が来るかによるな。", en: "It depends on who's coming." },
    ],
  },
  {
    id: 3, part: 1, en: "~ and stuff like that", ja: "〜とか、そんな感じ",
    note: "stuff＝物・事。文末に置いて具体例をぼかし、会話をスムーズにする。",
    examples: [
      { ja: "音楽とか映画とか、そんな感じのことを話したよ。", en: "We talked about music, movies and stuff like that." },
      { ja: "週末は掃除とか洗濯とかしてるよ。", en: "On weekends I do cleaning, laundry and stuff like that." },
      { ja: "彼女はヨガとか、そういうのにハマってる。", en: "She's into yoga and stuff like that." },
      { ja: "ペンとかノートとか、そういうのを買わなきゃ。", en: "I need to buy pens, notebooks and stuff like that." },
    ],
  },
  {
    id: 4, part: 1, en: "Just because ~ doesn't mean ~", ja: "〜だからといって〜とは限らない",
    note: "一面的な判断をピシャリと否定する。",
    examples: [
      { ja: "お金持ちだからって幸せとは限らない。", en: "Just because he's rich doesn't mean he's happy." },
      { ja: "高いからって良いとは限らないよ。", en: "Just because it's expensive doesn't mean it's good." },
      { ja: "日本人だからって寿司が好きとは限らない。", en: "Just because I'm Japanese doesn't mean I like sushi." },
      { ja: "彼が笑ってるからって怒ってないとは限らない。", en: "Just because he's smiling doesn't mean he's not angry." },
    ],
  },
  {
    id: 5, part: 1, en: "not necessarily", ja: "必ずしも〜とは限らない",
    note: "含みを持たせてマイルドに反論する、大人の表現。",
    examples: [
      { ja: "一番高いものが一番良いとは限らない。", en: "The most expensive option is not necessarily the best." },
      { ja: "（「英語って難しいよね？」に対して）必ずしもそうとは限らないよ。", en: "Not necessarily." },
      { ja: "速ければ良いとは限らない。", en: "Faster isn't necessarily better." },
      { ja: "有名なレストランが美味しいとは限らない。", en: "Famous restaurants aren't necessarily good." },
    ],
  },

  // ---------- Part 2 ----------
  {
    id: 6, part: 2, en: "I have a ~ brain / body", ja: "〜な体質・性格なんだ",
    note: "自分の体質や性質を「そういう脳・体を持っている」と表現する。",
    examples: [
      { ja: "私はアイデアを出すのが得意なんだ。（クリエイティブな脳）", en: "I have a creative brain." },
      { ja: "私は太りやすい体質なんだ。", en: "I have a body that gains weight easily." },
      { ja: "私はお酒に弱い体質なんだ。", en: "I have a body that can't handle alcohol." },
      { ja: "私は朝のほうが頭が働くタイプなんだ。", en: "I have a brain that works best in the morning." },
    ],
  },
  {
    id: 7, part: 2, en: "I was like, ~", ja: "〜って感じだったんだよ",
    note: "当時の感情やトーンを丸ごと再現する。実際に口に出していなくてもOK。",
    examples: [
      { ja: "「え、何言ってんの？」って感じだったよ。", en: "I was like, \"What are you saying?\"" },
      { ja: "「マジで？」って感じだった。", en: "I was like, \"Seriously?\"" },
      { ja: "「もう無理！」って感じだったよ。", en: "I was like, \"I can't do this anymore!\"" },
      { ja: "「これ最高じゃん！」って感じだった。", en: "I was like, \"This is amazing!\"" },
    ],
  },
  {
    id: 8, part: 2, en: "I can't function without ~", ja: "〜がないと無理",
    note: "人を機械に例えて「これがないと体や頭が動かない」と言う。",
    examples: [
      { ja: "朝のコーヒーがないと無理。", en: "I can't function without my morning coffee." },
      { ja: "スマホがないと何もできない。", en: "I can't function without my phone." },
      { ja: "8時間寝ないとダメなんだ。", en: "I can't function without eight hours of sleep." },
      { ja: "仕事中は音楽がないと無理。", en: "I can't function without music when I work." },
    ],
  },
  {
    id: 9, part: 2, en: "I used to ~, but now ~", ja: "昔は〜だったけど、今は〜",
    note: "used to＋動詞の原形。昔と今を比較して変化を語る。",
    examples: [
      { ja: "昔は肉をよく食べてたけど、今はヴィーガンなんだ。", en: "I used to eat meat, but now I'm vegan." },
      { ja: "昔は東京に住んでたけど、今は大阪に住んでる。", en: "I used to live in Tokyo, but now I live in Osaka." },
      { ja: "昔は野菜が嫌いだったけど、今は大好き。", en: "I used to hate vegetables, but now I love them." },
      { ja: "昔はタバコを吸ってたけど、今はやめた。", en: "I used to smoke, but now I've quit." },
    ],
  },
  {
    id: 10, part: 2, en: "I'm used to ~ing", ja: "〜するのに慣れている",
    note: "be used to＋〜ing（名詞）。I used to と混同しないようチャンクで覚える。",
    examples: [
      { ja: "朝5時に起きるのには慣れてるよ。", en: "I'm used to waking up at 5 a.m." },
      { ja: "満員電車には慣れてる。", en: "I'm used to crowded trains." },
      { ja: "一人暮らしには慣れてるよ。", en: "I'm used to living alone." },
      { ja: "まだ英語で話すのに慣れてないんだ。", en: "I'm not used to speaking English yet." },
    ],
  },

  // ---------- Part 3 ----------
  {
    id: 11, part: 3, en: "I can't wait to / for ~", ja: "〜が楽しみで仕方ない",
    note: "I'm looking forward to をカジュアルに熱くした表現。",
    examples: [
      { ja: "週末が待ちきれない。", en: "I can't wait for the weekend." },
      { ja: "早く君に会いたい！", en: "I can't wait to see you!" },
      { ja: "新しいゲームをやるのが楽しみすぎる。", en: "I can't wait to play the new game." },
      { ja: "夏休みが待ち遠しい。", en: "I can't wait for summer vacation." },
    ],
  },
  {
    id: 12, part: 3, en: "I can't stand ~", ja: "〜は耐えられない",
    note: "stand＝耐える。激しく嫌がる「嫌い」の最上級。",
    examples: [
      { ja: "夏の暑さには耐えられない。", en: "I can't stand the heat in summer." },
      { ja: "満員電車は本当に無理。", en: "I can't stand crowded trains." },
      { ja: "嘘をつく人には我慢できない。", en: "I can't stand people who lie." },
      { ja: "待たされるのは耐えられない。", en: "I can't stand waiting." },
    ],
  },
  {
    id: 13, part: 3, en: "I don't feel like ~ing", ja: "〜する気分じゃない",
    note: "自分のテンションを伝える。日常会話は気分で話すことが多い。",
    examples: [
      { ja: "今日は出かける気分じゃない。", en: "I don't feel like going out today." },
      { ja: "今夜は料理する気分じゃない。", en: "I don't feel like cooking tonight." },
      { ja: "今は話す気分じゃないんだ。", en: "I don't feel like talking right now." },
      { ja: "今日は勉強する気になれない。", en: "I don't feel like studying today." },
    ],
  },
  {
    id: 14, part: 3, en: "I can't help ~ing", ja: "思わず〜してしまう",
    note: "help＝避ける・抑える。感情や行動を抑えきれないとき。",
    examples: [
      { ja: "思わず笑っちゃう。", en: "I can't help laughing." },
      { ja: "彼のことを考えずにはいられない。", en: "I can't help thinking about him." },
      { ja: "ついお菓子を食べちゃうんだ。", en: "I can't help eating snacks." },
      { ja: "泣かずにはいられなかった。", en: "I couldn't help crying." },
    ],
  },
  {
    id: 15, part: 3, en: "It was so ~ that ~", ja: "すごく〜だったから〜した",
    note: "感情と行動をセットで伝える大げさな表現。",
    examples: [
      { ja: "美味しすぎて食べるのが止まらなかった。", en: "It was so good that I couldn't stop eating." },
      { ja: "そのコーヒーは美味しすぎて飲むのが止まらなかった。", en: "The coffee was so good that I couldn't stop drinking it." },
      { ja: "その映画は面白すぎて2回観た。", en: "The movie was so good that I watched it twice." },
      { ja: "疲れすぎてすぐ寝ちゃった。", en: "I was so tired that I fell asleep right away." },
    ],
  },

  // ---------- Part 4 ----------
  {
    id: 16, part: 4, en: "I'm supposed to ~", ja: "〜することになってる",
    note: "ルールや予定でそう決まっている。義務感や言い訳を伝える。",
    examples: [
      { ja: "大事な試合に行くことになってるんだ。", en: "I'm supposed to be at the big game." },
      { ja: "今日はバイトに入ることになってるんだ。", en: "I'm supposed to work today." },
      { ja: "6時までに帰ることになってる。", en: "I'm supposed to be home by six." },
      { ja: "ここではタバコを吸っちゃいけないことになってるよ。", en: "You're not supposed to smoke here." },
    ],
  },
  {
    id: 17, part: 4, en: "How about + 主語 + 動詞?", ja: "〜するのはどう？",
    note: "How about の後ろに普通の文（平叙文）をそのまま付けて提案する。",
    examples: [
      { ja: "今夜ピザを頼むのはどう？", en: "How about we order pizza tonight?" },
      { ja: "明日にするのはどう？", en: "How about we do it tomorrow?" },
      { ja: "駅で会うのはどう？", en: "How about we meet at the station?" },
      { ja: "ちょっと休憩するのはどう？", en: "How about we take a short break?" },
    ],
  },
  {
    id: 18, part: 4, en: "I'm willing to ~", ja: "必要なら喜んで〜する／〜する覚悟がある",
    note: "頼もしく前向きな意思を示す、できる大人の表現。",
    examples: [
      { ja: "私が責任を取る覚悟があります。", en: "I'm willing to take responsibility." },
      { ja: "必要なら手伝うよ。", en: "I'm willing to help if you need me." },
      { ja: "もっと払ってもいいよ。", en: "I'm willing to pay more." },
      { ja: "引っ越してもいいと思ってる。", en: "I'm willing to move." },
    ],
  },
  {
    id: 19, part: 4, en: "Let me know when ~", ja: "〜の時に教えてね",
    note: "Please tell me よりマイルドで柔らかい。",
    examples: [
      { ja: "暇なとき教えてね。", en: "Let me know when you're free." },
      { ja: "着いたら教えて。", en: "Let me know when you get there." },
      { ja: "準備ができたら教えてね。", en: "Let me know when you're ready." },
      { ja: "終わったら教えて。", en: "Let me know when you're done." },
    ],
  },
  {
    id: 20, part: 4, en: "Are you down for ~?", ja: "〜やる？乗る？",
    note: "down＝そっちに向かっている。気軽な誘い文句。返事は I'm down.",
    examples: [
      { ja: "後で夜ごはん行かない？", en: "Are you down for grabbing dinner later?" },
      { ja: "今夜カラオケどう？", en: "Are you down for karaoke tonight?" },
      { ja: "週末ハイキング行く？", en: "Are you down for a hike this weekend?" },
      { ja: "（誘いに対して）乗った！", en: "I'm down!" },
    ],
  },

  // ---------- Part 5 ----------
  {
    id: 21, part: 5, en: "What I like about ~ is ~", ja: "〜の好きなところは、ズバリ〜",
    note: "特定の推しポイントを強調して伝える。",
    examples: [
      { ja: "この街の好きなところは食文化なんだ。", en: "What I like about this city is the food culture." },
      { ja: "彼の好きなところは正直なところ。", en: "What I like about him is that he's honest." },
      { ja: "この仕事の好きなところは、いろんな人に会えること。", en: "What I like about this job is that I get to meet lots of people." },
      { ja: "このお店の好きなところは雰囲気なんだ。", en: "What I like about this place is the atmosphere." },
    ],
  },
  {
    id: 22, part: 5, en: "I ended up ~ing", ja: "結局〜することになった",
    note: "紆余曲折あったけど、最終的にそうなった。",
    examples: [
      { ja: "結局一日中家にいることになった。", en: "I ended up staying home all day." },
      { ja: "結局タクシーで帰ることになった。", en: "I ended up taking a taxi home." },
      { ja: "結局3時間も話しちゃった。", en: "We ended up talking for three hours." },
      { ja: "結局彼と付き合うことになった。", en: "I ended up dating him." },
    ],
  },
  {
    id: 23, part: 5, en: "I found it ~", ja: "やってみたら〜だった",
    note: "find＝感じる・気づく。I think より客観的で大人っぽい感想。",
    examples: [
      { ja: "英語を学ぶのは難しいと感じた。", en: "I found it difficult to learn English." },
      { ja: "その本、読んでみたらすごく面白かった。", en: "I found the book really interesting." },
      { ja: "彼の説明はわかりやすかった。", en: "I found his explanation easy to understand." },
      { ja: "早起きするのはつらかった。", en: "I found it hard to wake up early." },
    ],
  },
  {
    id: 24, part: 5, en: "It takes (時間) to ~", ja: "〜するのに（時間）かかる",
    note: "主語を It にする基本チャンク。",
    examples: [
      { ja: "そこへ行くのに30分かかる。", en: "It takes 30 minutes to get there." },
      { ja: "慣れるのには時間がかかる。", en: "It takes time to get used to it." },
      { ja: "この料理を作るのに1時間かかる。", en: "It takes an hour to make this dish." },
      { ja: "英語がペラペラになるには何年もかかる。", en: "It takes years to become fluent in English." },
    ],
  },
  {
    id: 25, part: 5, en: "I gotta ~", ja: "〜しなきゃ",
    note: "I have to より軽い。「やべ、もう行かなきゃ」のノリ。",
    examples: [
      { ja: "もう行かなきゃ。", en: "I gotta go." },
      { ja: "そろそろ寝なきゃ。", en: "I gotta go to bed." },
      { ja: "これ今日中に終わらせなきゃ。", en: "I gotta finish this today." },
      { ja: "母に電話しなきゃ。", en: "I gotta call my mom." },
    ],
  },
  {
    id: 26, part: 5, en: "kind of", ja: "なんか、ちょっと",
    note: "断定を避ける魔法のクッション。",
    examples: [
      { ja: "なんか疲れた。", en: "I'm kind of tired." },
      { ja: "ちょっとお腹すいた。", en: "I'm kind of hungry." },
      { ja: "それ、なんかいいね。", en: "That's kind of cool." },
      { ja: "ちょっと緊張してる。", en: "I'm kind of nervous." },
    ],
  },
  {
    id: 27, part: 5, en: "What's your take on ~?", ja: "〜をどう捉えた？",
    note: "take＝捉え方・解釈。What do you think より知的。",
    examples: [
      { ja: "これについてどう思う？", en: "What's your take on this?" },
      { ja: "新しい計画についてどう思う？", en: "What's your take on the new plan?" },
      { ja: "あの映画の結末、どう解釈した？", en: "What's your take on the ending of that movie?" },
      { ja: "在宅勤務についてどう思う？", en: "What's your take on working from home?" },
    ],
  },
  {
    id: 28, part: 5, en: "I respect that.", ja: "それもアリだね（尊重するよ）",
    note: "自分とは違う選択でも、相手の考えを尊重する。",
    examples: [
      { ja: "旅行するために仕事を辞めるの？それもアリだね。", en: "You're quitting your job to travel? I respect that." },
      { ja: "ヴィーガンなんだ？いいね、尊重するよ。", en: "You're vegan? I respect that." },
      { ja: "私は賛成じゃないけど、尊重するよ。", en: "I don't agree, but I respect that." },
      { ja: "正直に言ってくれてありがとう。そういうところ尊敬する。", en: "Thanks for being honest. I respect that." },
    ],
  },
  {
    id: 29, part: 5, en: "I'd rather (not) ~", ja: "どちらかというと〜したい（したくない）",
    note: "I don't want to より角が立たない、大人の断り方。",
    examples: [
      { ja: "今夜はどちらかというと家にいたいな。", en: "I'd rather stay home tonight." },
      { ja: "できればその話はしたくないな。", en: "I'd rather not talk about it." },
      { ja: "どちらかというと行きたくないかな。", en: "I'd rather not go." },
      { ja: "名前は言わないでおきたいな。", en: "I'd rather not say." },
    ],
  },
  {
    id: 30, part: 5, en: "At the end of the day, ~", ja: "結局のところ〜",
    note: "いろいろあったけど最終的には…と話をビシッとまとめる決めゼリフ。",
    examples: [
      { ja: "結局、家族が一番大事だよ。", en: "At the end of the day, family is the most important." },
      { ja: "結局は君が決めることだよ。", en: "At the end of the day, it's your decision." },
      { ja: "結局、健康が一番だよね。", en: "At the end of the day, health comes first." },
      { ja: "結局、大事なのは結果だ。", en: "At the end of the day, results are what matter." },
    ],
  },
];

// ==========================================
// 🎓 TEDプレゼン・知的思考編（GRIT 30選）
// ==========================================
window.GRIT_PARTS = [
  { id: 1, name: "Part① キャリア・日常の描写（引き込み）" },
  { id: 2, name: "Part② 難易度の承認と可能性の確信（譲歩と主張）" },
  { id: 3, name: "Part③ 仮説の提示と調査・問いの立て方" },
  { id: 4, name: "Part④ 本質の定義とデータの裏付け（キラー定義）" },
  { id: 5, name: "Part⑤ 科学的知見と行動へのコミットメント（結び）" },
];

window.GRIT_PATTERNS = [
  {
    "id": 1,
    "part": 1,
    "en": "I left a ~ job in A for a job that was even more ~: B",
    "ja": "Aでの〜な仕事を辞め、さらに〜なBの仕事に就いた",
    "note": "キャリアの転換と、次の挑戦の過酷さを対比させて伝える。",
    "examples": [
      {
        "tag": "原典",
        "ja": "経営コンサルタントの仕事を辞め、さらに責任の重い教師になった。",
        "en": "I left a very demanding job in management consulting for a job that was even more demanding: teaching."
      },
      {
        "tag": "ビジネス",
        "ja": "大手企業の安定した仕事を辞め、さらに挑戦的なスタートアップに入社した。",
        "en": "I left a stable job at a big corporation for a job that was even more challenging: a tech startup."
      },
      {
        "tag": "日常",
        "ja": "忙しい営業の仕事を辞め、さらに時間のかかる子育てに専念した。",
        "en": "I left a busy job in sales for a role that was even more demanding: full-time parenting."
      }
    ]
  },
  {
    "id": 2,
    "part": 1,
    "en": "Like any ~, I did A, and when B, I did C",
    "ja": "他の〜と同じようにAをし、BのときにはCをした",
    "note": "日常のルーティンを淡々と語り、相手に親近感とリアリティを持たせる。",
    "examples": [
      {
        "tag": "原典",
        "ja": "他の教師と同じようにテストを作り、課題が返ってきたら成績をつけた。",
        "en": "And like any teacher, I made quizzes and tests, and when the work came back, I calculated grades."
      },
      {
        "tag": "ビジネス",
        "ja": "他の営業と同じように商談をし、契約書が届いたら処理を進めた。",
        "en": "Like any salesperson, I held meetings, and when contracts arrived, I processed them."
      },
      {
        "tag": "日常",
        "ja": "他の親と同じように朝ご飯を作り、子どもたちが帰ってきたら宿題を手伝った。",
        "en": "Like any parent, I made breakfast, and when the kids came back, I helped with homework."
      }
    ]
  },
  {
    "id": 3,
    "part": 1,
    "en": "What struck me was that ~",
    "ja": "ハッとさせられた／驚かされたのは〜だった",
    "note": "常識の盲点を突き、聞き手を自分の発見にグッと引き込む最重要構文。",
    "examples": [
      {
        "tag": "原典",
        "ja": "驚かされたのは、優秀な生徒とそうでない生徒の違いはIQだけではなかったことだ。",
        "en": "What struck me was that IQ was not the only difference between my best and my worst students."
      },
      {
        "tag": "ビジネス",
        "ja": "驚いたのは、最も売れる商品が最も安い商品ではなかったことだ。",
        "en": "What struck me was that the bestselling product was not the cheapest one."
      },
      {
        "tag": "日常",
        "ja": "ハッとさせられたのは、彼が困難な状況でも一切言い訳をしなかったことだ。",
        "en": "What struck me was that he never made any excuses even during tough times."
      }
    ]
  },
  {
    "id": 4,
    "part": 1,
    "en": "~ is not the only difference between A and B",
    "ja": "AとBの違いは〜だけではない（それだけで差がつくわけではない）",
    "note": "単一の要因（才能や学歴など）に頼った固定観念を崩す。",
    "examples": [
      {
        "tag": "原典",
        "ja": "知能指数だけが、優秀な生徒と最も成績の悪い生徒の違いではなかった。",
        "en": "IQ was not the only difference between my best and my worst students."
      },
      {
        "tag": "ビジネス",
        "ja": "スキルだけが、一流のエンジニアと並のエンジニアの違いではない。",
        "en": "Technical skills are not the only difference between top engineers and average ones."
      },
      {
        "tag": "日常",
        "ja": "運だけが、成功する人と途中で諦める人の違いではない。",
        "en": "Luck is not the only difference between those who succeed and those who give up."
      }
    ]
  },
  {
    "id": 5,
    "part": 1,
    "en": "Some of my strongest performers did not have ~",
    "ja": "最も優秀な成果を出した人の中にさえ、〜を持たない人がいた",
    "note": "通説の「必須条件」を覆す、強いコントラストを生む表現。",
    "examples": [
      {
        "tag": "原典",
        "ja": "最も優秀な成績を収めた生徒の中にさえ、桁外れに高いIQを持たない者がいた。",
        "en": "Some of my strongest performers did not have stratospheric IQ scores."
      },
      {
        "tag": "ビジネス",
        "ja": "トップ営業マンの中にも、豊富な人脈を持っていなかった人がいた。",
        "en": "Some of our top performers did not have extensive personal connections."
      },
      {
        "tag": "日常",
        "ja": "最も上達した学習者の中にも、特別な語学の才能を持っていなかった人がいる。",
        "en": "Some of our best learners did not have any special talent for languages."
      }
    ]
  },
  {
    "id": 6,
    "part": 1,
    "en": "Some of my [best people] weren't doing so well",
    "ja": "最も優秀なはずの者の中に、あまり成果が出ていない人がいた",
    "note": "「地頭の良さ＝成功」ではないという現実のリアルを突く。",
    "examples": [
      {
        "tag": "原典",
        "ja": "私の生徒の中で特に優秀な子たちの中に、成績があまり良くない子もいた。",
        "en": "Some of my smartest kids weren't doing so well."
      },
      {
        "tag": "ビジネス",
        "ja": "最も経験豊富なメンバーの中に、新しい環境で苦戦している人がいた。",
        "en": "Some of our most experienced members weren't doing so well."
      },
      {
        "tag": "日常",
        "ja": "テストの点が一番高かった人の中に、実際の会話で苦労している人がいた。",
        "en": "Some of the people with the highest test scores weren't doing so well in real conversation."
      }
    ]
  },
  {
    "id": 7,
    "part": 2,
    "en": "And that got me thinking",
    "ja": "そして、それが深く考えるきっかけになった",
    "note": "問題意識が芽生えた瞬間を自然につなぎ、次の展開へ橋渡しする。",
    "examples": [
      {
        "tag": "原典",
        "ja": "そして、それが私に深く考えさせるきっかけとなった。",
        "en": "And that got me thinking."
      },
      {
        "tag": "ビジネス",
        "ja": "顧客からの率直なフィードバックが、商品を見直すきっかけになった。",
        "en": "That customer feedback really got me thinking about our product strategy."
      },
      {
        "tag": "日常",
        "ja": "彼のその一言が、自分の時間の使い方を考え直すきっかけになった。",
        "en": "What he said really got me thinking about how I spend my time."
      }
    ]
  },
  {
    "id": 8,
    "part": 2,
    "en": "The kinds of things you need to ~, sure, they're hard, but they're not impossible",
    "ja": "やるべきこと、確かに難しい。だが不可能なわけではない",
    "note": "課題の厳しさを認めた上で、ポジティブな可能性を力強く提示する。",
    "examples": [
      {
        "tag": "原典",
        "ja": "学ぶ必要がある内容は確かに難しいが、不可能なものではない。",
        "en": "The kinds of things you need to learn, sure, they're hard, but they're not impossible."
      },
      {
        "tag": "ビジネス",
        "ja": "このプロジェクトで達成すべき目標、確かに厳しいが、不可能なわけではない。",
        "en": "The goals we need to hit, sure, they're tough, but they're not impossible."
      },
      {
        "tag": "日常",
        "ja": "英語を流暢に話すこと、確かに大変だが、不可能なことではない。",
        "en": "Speaking fluent English, sure, it's hard, but it's not impossible."
      }
    ]
  },
  {
    "id": 9,
    "part": 2,
    "en": "I was firmly convinced that ~ if they worked hard and long enough",
    "ja": "十分長く懸命に努力しさえすれば、〜できると固く確信していた",
    "note": "努力と時間に対する揺るぎない信頼を伝える表現。",
    "examples": [
      {
        "tag": "原典",
        "ja": "十分な時間と努力をかければ、生徒全員が内容を習得できると確信していた。",
        "en": "I was firmly convinced that every student could learn the material if they worked hard and long enough."
      },
      {
        "tag": "ビジネス",
        "ja": "粘り強く検証を続ければ、必ず解決策が見つかると確信していた。",
        "en": "I was firmly convinced that we could find a solution if we worked hard and long enough."
      },
      {
        "tag": "日常",
        "ja": "諦めずに毎日続ければ、誰でも上達できると確信している。",
        "en": "I'm firmly convinced that anyone can improve if they practice hard and long enough."
      }
    ]
  },
  {
    "id": 10,
    "part": 2,
    "en": "After several more years of ~, I came to the conclusion that ~",
    "ja": "さらに数年間〜を経験した後、…という結論に至った",
    "note": "長期の実践を経てたどり着いた、重みのある見解を示す。",
    "examples": [
      {
        "tag": "原典",
        "ja": "さらに数年間教鞭を執った後、教育に必要なのは〜だという結論に至った。",
        "en": "After several more years of teaching, I came to the conclusion that what we need is a better understanding."
      },
      {
        "tag": "ビジネス",
        "ja": "数年現場で働いた後、本当に重要なのは仕組み化だという結論に至った。",
        "en": "After several more years in the industry, I came to the conclusion that systems matter more than talent."
      },
      {
        "tag": "日常",
        "ja": "何年も英語を学んだ後、一番大切なのは毎日の習慣だという結論に至った。",
        "en": "After several years of studying, I came to the conclusion that daily habits are everything."
      }
    ]
  },
  {
    "id": 11,
    "part": 2,
    "en": "What we need is a much better understanding of ~ from a ~ perspective",
    "ja": "必要なのは、〜の観点から…をより深く理解することだ",
    "note": "議論の視座（パースペクティブ）を切り替え、根本解決を促す。",
    "examples": [
      {
        "tag": "原典",
        "ja": "必要なのは、動機づけや心理学の観点から学習をより深く理解することだ。",
        "en": "What we need is a much better understanding of learning from a motivational and psychological perspective."
      },
      {
        "tag": "ビジネス",
        "ja": "必要なのは、顧客体験の観点から自社のサービスをより深く理解することだ。",
        "en": "What we need is a much better understanding of our product from a customer perspective."
      },
      {
        "tag": "日常",
        "ja": "必要なのは、継続性の観点から自分の生活リズムを理解することだ。",
        "en": "What we need is a much better understanding of our daily habits from a long-term perspective."
      }
    ]
  },
  {
    "id": 12,
    "part": 2,
    "en": "The one thing we know how to measure best is ~",
    "ja": "私たちが最も正確に測定できると分かっている唯一のものは〜だ",
    "note": "「測りやすいもの」と「本当に大切なもの」のギャップを浮き彫りにする。",
    "examples": [
      {
        "tag": "原典",
        "ja": "教育において、私たちが最も正確に測れる唯一のものはIQだ。",
        "en": "In education, the one thing we know how to measure best is IQ."
      },
      {
        "tag": "ビジネス",
        "ja": "マーケティングで私たちが最も簡単に測定できるのはクリック数だ。",
        "en": "In marketing, the one thing we know how to measure best is clicks."
      },
      {
        "tag": "日常",
        "ja": "健康管理で私たちが最も簡単に測れるのは体重だ。",
        "en": "In fitness, the one thing we know how to measure best is body weight."
      }
    ]
  },
  {
    "id": 13,
    "part": 3,
    "en": "What if ~ depends on much more than ~?",
    "ja": "もし〜が、…以上のものにかかっているとしたら？",
    "note": "従来の前提を覆す、非常に知的な仮説提示のキラー構文。",
    "examples": [
      {
        "tag": "原典",
        "ja": "もし人生で成功することが、素早く簡単に学ぶ能力以上のものにかかっているとしたら？",
        "en": "What if doing well in school and in life depends on much more than your ability to learn quickly and easily?"
      },
      {
        "tag": "ビジネス",
        "ja": "もし事業の成功が、資金の多さ以上のものにかかっているとしたら？",
        "en": "What if business success depends on much more than having a huge budget?"
      },
      {
        "tag": "日常",
        "ja": "もし語学の上達が、生まれつきの才能以上のものにかかっているとしたら？",
        "en": "What if language learning depends on much more than natural talent?"
      }
    ]
  },
  {
    "id": 14,
    "part": 3,
    "en": "So I left A, and I went to B to become C",
    "ja": "だから私はAを去り、CになるためにBへ進んだ",
    "note": "自分の信念を行動に変えた大きな決断を力強く語る。",
    "examples": [
      {
        "tag": "原典",
        "ja": "それで私は教室を離れ、心理学者になるために大学院に進学した。",
        "en": "So I left the classroom, and I went to graduate school to become a psychologist."
      },
      {
        "tag": "ビジネス",
        "ja": "だから私は大企業を辞め、起業家になるためにシリコンバレーへ渡った。",
        "en": "So I left my corporate job, and I went to Silicon Valley to become an entrepreneur."
      },
      {
        "tag": "日常",
        "ja": "だから私は快適な環境を離れ、英語を話せるようになるために留学した。",
        "en": "So I left my comfort zone, and I went abroad to become fluent in English."
      }
    ]
  },
  {
    "id": 15,
    "part": 3,
    "en": "In every study, my question was: who is successful here and why?",
    "ja": "どの調査でも私の問いは常に「ここで成功しているのは誰で、なぜか？」だった",
    "note": "自分の研究やビジネスにおける一貫したコアの問いを提示する。",
    "examples": [
      {
        "tag": "原典",
        "ja": "どの研究でも私の疑問は「ここで成功しているのは誰で、なぜなのか？」ということだった。",
        "en": "In every study my question was, who is successful here and why?"
      },
      {
        "tag": "ビジネス",
        "ja": "どの市場調査でも私たちの問いは「誰がこの商品を買ってくれて、なぜなのか？」だった。",
        "en": "In every project our question was, who is buying our product and why?"
      },
      {
        "tag": "日常",
        "ja": "どの分野でも私の疑問は「誰が結果を出し続けていて、なぜなのか？」だった。",
        "en": "In every field my question was, who consistently gets results and why?"
      }
    ]
  },
  {
    "id": 16,
    "part": 3,
    "en": "We tried to predict which ~ would stay and which would drop out",
    "ja": "誰が最後まで残り、誰が途中で脱落するかを予測しようと試みた",
    "note": "定着率や継続性の検証を語るときの王道パターン。",
    "examples": [
      {
        "tag": "原典",
        "ja": "どの士官候補生が訓練に残り、誰が脱落するかを予測しようとした。",
        "en": "We tried to predict which cadets would stay in military training and which would drop out."
      },
      {
        "tag": "ビジネス",
        "ja": "どの新規ユーザーがアプリを使い続け、誰が離脱するかを予測しようとした。",
        "en": "We tried to predict which users would stay active and which would churn."
      },
      {
        "tag": "日常",
        "ja": "誰がジム通いを習慣化でき、誰が3日坊主でやめるかを分析した。",
        "en": "We tried to see who would stick with the gym and who would drop out after a week."
      }
    ]
  },
  {
    "id": 17,
    "part": 3,
    "en": "asking who will be the most effective at improving [outcomes] for ~",
    "ja": "〜の成果を高める上で、誰が最も効果的なのかと問いを立てた",
    "note": "表面的な実績ではなく、本質的な改善インパクトに焦点を当てる。",
    "examples": [
      {
        "tag": "原典",
        "ja": "生徒の学習成果を向上させる上で、誰が最も効果的な教師なのかを問うた。",
        "en": "We asked who will be the most effective at improving learning outcomes for their students."
      },
      {
        "tag": "ビジネス",
        "ja": "チームの売上を伸ばす上で、誰が最も効果的なマネージャーなのかを検証した。",
        "en": "We asked who will be the most effective at driving sales for the team."
      },
      {
        "tag": "日常",
        "ja": "健康状態を改善する上で、どの習慣が最も効果的かを調べた。",
        "en": "We asked which habits are the most effective at improving overall health."
      }
    ]
  },
  {
    "id": 18,
    "part": 3,
    "en": "In all those very different contexts, one characteristic emerged as a significant predictor of ~",
    "ja": "全く異なるすべての状況において、ある1つの要素が〜の決定的な予測因子として浮上した",
    "note": "多種多様なデータから共通の成功法則を導き出す際の決め台詞。",
    "examples": [
      {
        "tag": "原典",
        "ja": "全く異なる状況において、成功を予測する重要な1つの特徴が浮かび上がった。",
        "en": "In all those very different contexts, one characteristic emerged as a significant predictor of success."
      },
      {
        "tag": "ビジネス",
        "ja": "すべての業界において、スピードが企業の成長を予測する最大の要因として浮上した。",
        "en": "Across very different industries, speed emerged as a significant predictor of growth."
      },
      {
        "tag": "日常",
        "ja": "あらゆる学習者において、毎日の継続が成果を予測する決定的な要因として浮上した。",
        "en": "Across different learners, consistency emerged as a significant predictor of fluency."
      }
    ]
  },
  {
    "id": 19,
    "part": 4,
    "en": "It wasn't A. It wasn't B, and it wasn't C. It was X",
    "ja": "Aでもなく、Bでもなく、Cでもなかった。それはXだった",
    "note": "三段否定からの真因提示。聴衆に最も強い印象を残すレトリック。",
    "examples": [
      {
        "tag": "原典",
        "ja": "容姿の良さでもなく、健康状態でもなく、IQでもなかった。それはグリット（やり抜く力）だった。",
        "en": "It wasn't good looks, physical health, and it wasn't IQ. It was grit."
      },
      {
        "tag": "ビジネス",
        "ja": "資金力でもなく、広告量でもなく、人脈でもなかった。それは製品の品質だった。",
        "en": "It wasn't huge funding, massive ads, and it wasn't connections. It was product quality."
      },
      {
        "tag": "日常",
        "ja": "教科書の質でもなく、先生の腕でもなかった。差を分けたのは練習量だった。",
        "en": "It wasn't the textbooks, and it wasn't the teachers. It was daily practice."
      }
    ]
  },
  {
    "id": 20,
    "part": 4,
    "en": "~ is passion and perseverance for very long-term goals",
    "ja": "〜とは、非常に長期的な目標に対する情熱と忍耐力のことである",
    "note": "概念を洗練された一文でズバリ定義する、GRITの中心命題。",
    "examples": [
      {
        "tag": "原典",
        "ja": "グリットとは、極めて長期的な目標に対する情熱と忍耐力のことだ。",
        "en": "Grit is passion and perseverance for very long-term goals."
      },
      {
        "tag": "ビジネス",
        "ja": "ビジョンとは、目の前の困難に負けない長期的な信念のことだ。",
        "en": "A real vision is commitment and persistence toward very long-term goals."
      },
      {
        "tag": "日常",
        "ja": "真の自信とは、日々の地道な積み重ねから生まれる静かな強さのことだ。",
        "en": "Real confidence is patience and steady practice for long-term growth."
      }
    ]
  },
  {
    "id": 21,
    "part": 4,
    "en": "~ is sticking with your future, day in, day out, not just for A, but for B",
    "ja": "〜とは、単にAだけでなく、何年も何年も日々Xと粘り強く向き合い続けることだ",
    "note": "「day in, day out（毎日毎日）」の圧倒的な継続のリフレイン。",
    "examples": [
      {
        "tag": "原典",
        "ja": "グリットとは、単に1週間や1ヶ月だけでなく、何年も日々自分の未来と粘り強く向き合うことだ。",
        "en": "Grit is sticking with your future, day in, day out, not just for the week, not just for the month, but for years."
      },
      {
        "tag": "ビジネス",
        "ja": "成功とは、単に初期の数ヶ月だけでなく、何年も顧客と真摯に向き合い続けることだ。",
        "en": "Building a brand is sticking with your customers, day in, day out, not just for a quarter, but for years."
      },
      {
        "tag": "日常",
        "ja": "語学習得とは、試験前だけでなく、何年も毎日欠かさず触れ続けることだ。",
        "en": "Mastering English is sticking with your goals, day in, day out, not just for a few days, but for years."
      }
    ]
  },
  {
    "id": 22,
    "part": 4,
    "en": "~ is living life like it's a marathon, not a sprint",
    "ja": "〜とは、人生を短距離走ではなくマラソンのように生きることだ",
    "note": "ペース配分と長期戦の重要性を誰もが直感できるメタファー。",
    "examples": [
      {
        "tag": "原典",
        "ja": "グリットとは、人生を短距離走ではなくマラソンのように生きることだ。",
        "en": "Grit is living life like it's a marathon, not a sprint."
      },
      {
        "tag": "ビジネス",
        "ja": "スタートアップの経営は、短距離走ではなくマラソンのように取り組むべきだ。",
        "en": "Running a startup is like running a marathon, not a sprint."
      },
      {
        "tag": "日常",
        "ja": "キャリアの構築は、100メートル走ではなくマラソンだ。",
        "en": "Building a successful career is a marathon, not a sprint."
      }
    ]
  },
  {
    "id": 23,
    "part": 4,
    "en": "Turns out that ~ were significantly more likely to ~",
    "ja": "調べてみると（フタを開けてみたら）、〜の方が…する可能性が著しく高いことが分かった",
    "note": "意外な検証結果や発見をサラッと知的に報告する日常＆学術の超頻出構文。",
    "examples": [
      {
        "tag": "原典",
        "ja": "調べてみると、粘り強い子どもたちの方が卒業する確率が著しく高かった。",
        "en": "Turns out that grittier kids were significantly more likely to graduate."
      },
      {
        "tag": "ビジネス",
        "ja": "フタを開けてみたら、初期に小さく失敗したチームの方が大成功する確率が高かった。",
        "en": "Turns out that teams that failed early were significantly more likely to succeed later."
      },
      {
        "tag": "日常",
        "ja": "実際にやってみると、朝15分だけ勉強した人の方が長続きする可能性がはるかに高かった。",
        "en": "Turns out that people who study 15 minutes a morning are significantly more likely to stick with it."
      }
    ]
  },
  {
    "id": 24,
    "part": 4,
    "en": "even when I matched them on every characteristic I could measure, things like ~",
    "ja": "測定できるあらゆる条件（〜など）を揃えて比較した場合でさえも",
    "note": "他の変数を排除し、自分の主張の強固さを証明する科学的ロジック。",
    "examples": [
      {
        "tag": "原典",
        "ja": "年収や学力テスト、安心感など、測定可能な全条件を揃えて比較した場合でさえもだ。",
        "en": "even when I matched them on every characteristic I could measure, things like family income and test scores."
      },
      {
        "tag": "ビジネス",
        "ja": "予算やチーム規模、開発期間など、あらゆる条件を揃えて比較した場合でさえもだ。",
        "en": "even when we matched them on every factor we could measure, things like budget and team size."
      },
      {
        "tag": "日常",
        "ja": "勉強時間や教材のレベルなど、あらゆる条件を揃えて比較した場合でさえもそうだ。",
        "en": "even when we matched them on study hours and learning materials."
      }
    ]
  },
  {
    "id": 25,
    "part": 5,
    "en": "It's not just in A that ~ matters. It's also in B, especially for C",
    "ja": "〜が重要なのは単にAだけではない。Bにおいても、特にCにとって極めて重要だ",
    "note": "発見の適用範囲を特殊な現場から普遍的な社会全体へ広げる。",
    "examples": [
      {
        "tag": "原典",
        "ja": "粘り強さが大事なのは軍隊だけではない。学校でも、特に中退の危機にある子に重要だ。",
        "en": "It's not just in military training that grit matters. It's also in school, especially for kids at risk of dropping out."
      },
      {
        "tag": "ビジネス",
        "ja": "スピードが重要なのは営業だけではない。エンジニアリングでも、特に初期開発で不可欠だ。",
        "en": "It's not just in sales that speed matters. It's also in engineering, especially for early-stage development."
      },
      {
        "tag": "日常",
        "ja": "継続が大事なのはスポーツだけではない。英語学習でも、特に忙しい社会人にこそ重要だ。",
        "en": "It's not just in sports that consistency matters. It's also in language learning, especially for busy adults."
      }
    ]
  },
  {
    "id": 26,
    "part": 5,
    "en": "To me, the most shocking thing about ~ is how little we know about ~",
    "ja": "私にとって最も衝撃的なのは、〜について私たちがいかに無知かということだ",
    "note": "人類の知識の限界を率直に認め、探求への参加を促す。",
    "examples": [
      {
        "tag": "原典",
        "ja": "私にとって最も衝撃的なのは、粘り強さを育む方法について科学がいかに何も知らないかということだ。",
        "en": "To me, the most shocking thing about grit is how little science knows about building it."
      },
      {
        "tag": "ビジネス",
        "ja": "最も衝撃的なのは、これだけデータがありながら顧客の本音について私たちがどれほど無知かということだ。",
        "en": "To me, the most shocking thing is how little we truly understand about our customers' real needs."
      },
      {
        "tag": "日常",
        "ja": "最も驚くべきは、毎日使っている脳のメカニズムについて私たち自身がどれほど知らないかということだ。",
        "en": "To me, the most shocking thing is how little we know about our own habits and motivations."
      }
    ]
  },
  {
    "id": 27,
    "part": 5,
    "en": "What I do know is that [talent] doesn't make you [gritty]",
    "ja": "一つ確実に言えるのは、才能があるからといって〜になれるわけではないということだ",
    "note": "「分からないこと」を認めた直後に、たった一つの確実な真実を言い切る対比の美。",
    "examples": [
      {
        "tag": "原典",
        "ja": "私が確実に知っているのは、才能があるからといって粘り強くなれるわけではないということだ。",
        "en": "What I do know is that talent doesn't make you gritty."
      },
      {
        "tag": "ビジネス",
        "ja": "一つ確実に言えるのは、良いアイデアがあるからといって成功できるわけではないということだ。",
        "en": "What I do know is that a great idea alone doesn't make you successful."
      },
      {
        "tag": "日常",
        "ja": "一つ確実に言えるのは、教材をたくさん持っているからといって話せるようになるわけではないということだ。",
        "en": "What I do know is that buying lots of textbooks doesn't make you fluent."
      }
    ]
  },
  {
    "id": 28,
    "part": 5,
    "en": "Our data show very clearly that there are many talented people who simply do not follow through on their commitments",
    "ja": "私たちのデータは、才能がありながらも自分の目標を最後までやり抜かない人が多いことを明確に示している",
    "note": "「follow through on commitments（約束や目標を最後まで遂行する）」の実用表現。",
    "examples": [
      {
        "tag": "原典",
        "ja": "データは、才能がありながらも自らの目標を最後までやり抜かない人が多いことを明確に示している。",
        "en": "Our data show very clearly that there are many talented individuals who simply do not follow through on their commitments."
      },
      {
        "tag": "ビジネス",
        "ja": "データは、スキルが高くても納期や約束を守り抜けない人が少なくないことを示している。",
        "en": "Our data show clearly that having skill doesn't guarantee people will follow through on their commitments."
      },
      {
        "tag": "日常",
        "ja": "現実は、大きな新年の抱負を立てても最後までやり抜けない人がほとんどであることを示している。",
        "en": "Experience shows clearly that many people make ambitious goals but simply do not follow through on them."
      }
    ]
  },
  {
    "id": 29,
    "part": 5,
    "en": "In fact, in our data, A is usually unrelated or even inversely related to B",
    "ja": "実際、データ上ではAはBと無関係か、あるいは逆相関ですらある",
    "note": "直感に反する分析結果をロジカルに提示する、知的な議論の最高峰フレーズ。",
    "examples": [
      {
        "tag": "原典",
        "ja": "実際、私たちのデータでは、やり抜く力は才能の指標とは無関係か、むしろ逆相関にある。",
        "en": "In fact, in our data, grit is usually unrelated or even inversely related to measures of talent."
      },
      {
        "tag": "ビジネス",
        "ja": "実際データ上では、会議の多さは生産性と無関係か、むしろ逆相関にある。",
        "en": "In fact, in our data, meeting time is unrelated or even inversely related to actual productivity."
      },
      {
        "tag": "日常",
        "ja": "実際、完璧主義は幸福度と無関係か、むしろ逆相関にあることが多い。",
        "en": "In fact, perfectionism is often unrelated or even inversely related to personal happiness."
      }
    ]
  },
  {
    "id": 30,
    "part": 5,
    "en": "We have to be willing to fail, to be wrong, and to start over again with lessons learned",
    "ja": "失敗を恐れず、間違いを認め、教訓を活かして再びやり直す覚悟を持たねばならない",
    "note": "失敗の受容と再起の覚悟を力強く宣言し、聴衆に行動を呼びかける大団円。",
    "examples": [
      {
        "tag": "原典",
        "ja": "私たちは失敗を恐れず、間違いを受け入れ、教訓と共に再挑戦する覚悟を持たねばならない。",
        "en": "We have to be willing to fail, to be wrong, and to start over again with lessons learned."
      },
      {
        "tag": "ビジネス",
        "ja": "イノベーションを起こすには、失敗を恐れず、得られた教訓から素早くやり直す覚悟が必要だ。",
        "en": "To innovate, we have to be willing to fail, to be wrong, and to start over again with lessons learned."
      },
      {
        "tag": "日常",
        "ja": "英語を話せるようになるには、間違えることを恐れず、恥をかきながら学び続ける覚悟が必要だ。",
        "en": "To master English, we have to be willing to make mistakes and start over again with lessons learned."
      }
    ]
  }
];
