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
