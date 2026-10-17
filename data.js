// 瞬間パターントレーニング：実戦英会話・口語70構文マスターデータ
// 日常・ビジネス・社交でネイティブが頻出させる実戦英語構文をテーマ別に体系化
window.PARTS = [
  { id: 1, name: "Part① クッション・前置き・断定回避" },
  { id: 2, name: "Part② 意見表明・反論・大人の大局観" },
  { id: 3, name: "Part③ 自己開示・習慣・ライフスタイル" },
  { id: 4, name: "Part④ 感情・衝動・本音のリアル描写" },
  { id: 5, name: "Part⑤ 提案・合意形成・スムーズな行動" },
  { id: 6, name: "Part⑥ 日常・友人との交流・カジュアル雑談" },
  { id: 7, name: "Part⑦ カフェ・買い物・外出移動" },
  { id: 8, name: "Part⑧ ビジネス・業務調整・スマートな依頼" },
  { id: 9, name: "Part⑨ 共感・励まし・大人のスマートな返し" },
];

window.PATTERNS = [
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
    id: 4, part: 2, en: "Just because ~ doesn't mean ~", ja: "〜だからといって〜とは限らない",
    note: "一面的な判断をピシャリと否定する。",
    examples: [
      { ja: "お金持ちだからって幸せとは限らない。", en: "Just because he's rich doesn't mean he's happy." },
      { ja: "高いからって良いとは限らないよ。", en: "Just because it's expensive doesn't mean it's good." },
      { ja: "日本人だからって寿司が好きとは限らない。", en: "Just because I'm Japanese doesn't mean I like sushi." },
      { ja: "彼が笑ってるからって怒ってないとは限らない。", en: "Just because he's smiling doesn't mean he's not angry." },
    ],
  },
  {
    id: 5, part: 2, en: "not necessarily", ja: "必ずしも〜とは限らない",
    note: "含みを持たせてマイルドに反論する、大人の表現。",
    examples: [
      { ja: "一番高いものが一番良いとは限らない。", en: "The most expensive option is not necessarily the best." },
      { ja: "（「英語って難しいよね？」に対して）必ずしもそうとは限らないよ。", en: "Not necessarily." },
      { ja: "速ければ良いとは限らない。", en: "Faster isn't necessarily better." },
      { ja: "有名なレストランが美味しいとは限らない。", en: "Famous restaurants aren't necessarily good." },
    ],
  },
  {
    id: 6, part: 3, en: "I have a ~ brain / body", ja: "〜な体質・性格なんだ",
    note: "自分の体質や性質を「そういう脳・体を持っている」と表現する。",
    examples: [
      { ja: "私はアイデアを出すのが得意なんだ。（クリエイティブな脳）", en: "I have a creative brain." },
      { ja: "私は太りやすい体質なんだ。", en: "I have a body that gains weight easily." },
      { ja: "私はお酒に弱い体質なんだ。", en: "I have a body that can't handle alcohol." },
      { ja: "私は朝のほうが頭が働くタイプなんだ。", en: "I have a brain that works best in the morning." },
    ],
  },
  {
    id: 7, part: 3, en: "I was like, ~", ja: "〜って感じだったんだよ",
    note: "当時の感情やトーンを丸ごと再現する。実際に口に出していなくてもOK。",
    examples: [
      { ja: "「え、何言ってんの？」って感じだったよ。", en: "I was like, \"What are you saying?\"" },
      { ja: "「マジで？」って感じだった。", en: "I was like, \"Seriously?\"" },
      { ja: "「もう無理！」って感じだったよ。", en: "I was like, \"I can't do this anymore!\"" },
      { ja: "「これ最高じゃん！」って感じだった。", en: "I was like, \"This is amazing!\"" },
    ],
  },
  {
    id: 8, part: 3, en: "I can't function without ~", ja: "〜がないと無理",
    note: "人を機械に例えて「これがないと体や頭が動かない」と言う。",
    examples: [
      { ja: "朝のコーヒーがないと無理。", en: "I can't function without my morning coffee." },
      { ja: "スマホがないと何もできない。", en: "I can't function without my phone." },
      { ja: "8時間寝ないとダメなんだ。", en: "I can't function without eight hours of sleep." },
      { ja: "仕事中は音楽がないと無理。", en: "I can't function without music when I work." },
    ],
  },
  {
    id: 9, part: 3, en: "I used to ~, but now ~", ja: "昔は〜だったけど、今は〜",
    note: "used to＋動詞の原形。昔と今を比較して変化を語る。",
    examples: [
      { ja: "昔は肉をよく食べてたけど、今はヴィーガンなんだ。", en: "I used to eat meat, but now I'm vegan." },
      { ja: "昔は東京に住んでたけど、今は大阪に住んでる。", en: "I used to live in Tokyo, but now I live in Osaka." },
      { ja: "昔は野菜が嫌いだったけど、今は大好き。", en: "I used to hate vegetables, but now I love them." },
      { ja: "昔はタバコを吸ってたけど、今はやめた。", en: "I used to smoke, but now I've quit." },
    ],
  },
  {
    id: 10, part: 3, en: "I'm used to ~ing", ja: "〜するのに慣れている",
    note: "be used to＋〜ing（名詞）。I used to と混同しないようチャンクで覚える。",
    examples: [
      { ja: "朝5時に起きるのには慣れてるよ。", en: "I'm used to waking up at 5 a.m." },
      { ja: "満員電車には慣れてる。", en: "I'm used to crowded trains." },
      { ja: "一人暮らしには慣れてるよ。", en: "I'm used to living alone." },
      { ja: "まだ英語で話すのに慣れてないんだ。", en: "I'm not used to speaking English yet." },
    ],
  },
  {
    id: 11, part: 4, en: "I can't wait to / for ~", ja: "〜が楽しみで仕方ない",
    note: "I'm looking forward to をカジュアルに熱くした表現。",
    examples: [
      { ja: "週末が待ちきれない。", en: "I can't wait for the weekend." },
      { ja: "早く君に会いたい！", en: "I can't wait to see you!" },
      { ja: "新しいゲームをやるのが楽しみすぎる。", en: "I can't wait to play the new game." },
      { ja: "夏休みが待ち遠しい。", en: "I can't wait for summer vacation." },
    ],
  },
  {
    id: 12, part: 4, en: "I can't stand ~", ja: "〜は耐えられない",
    note: "stand＝耐える。激しく嫌がる「嫌い」の最上級。",
    examples: [
      { ja: "夏の暑さには耐えられない。", en: "I can't stand the heat in summer." },
      { ja: "満員電車は本当に無理。", en: "I can't stand crowded trains." },
      { ja: "嘘をつく人には我慢できない。", en: "I can't stand people who lie." },
      { ja: "待たされるのは耐えられない。", en: "I can't stand waiting." },
    ],
  },
  {
    id: 13, part: 4, en: "I don't feel like ~ing", ja: "〜する気分じゃない",
    note: "自分のテンションを伝える。日常会話は気分で話すことが多い。",
    examples: [
      { ja: "今日は出かける気分じゃない。", en: "I don't feel like going out today." },
      { ja: "今夜は料理する気分じゃない。", en: "I don't feel like cooking tonight." },
      { ja: "今は話す気分じゃないんだ。", en: "I don't feel like talking right now." },
      { ja: "今日は勉強する気になれない。", en: "I don't feel like studying today." },
    ],
  },
  {
    id: 14, part: 4, en: "I can't help ~ing", ja: "思わず〜してしまう",
    note: "help＝避ける・抑える。感情や行動を抑えきれないとき。",
    examples: [
      { ja: "思わず笑っちゃう。", en: "I can't help laughing." },
      { ja: "彼のことを考えずにはいられない。", en: "I can't help thinking about him." },
      { ja: "ついお菓子を食べちゃうんだ。", en: "I can't help eating snacks." },
      { ja: "泣かずにはいられなかった。", en: "I couldn't help crying." },
    ],
  },
  {
    id: 15, part: 4, en: "It was so ~ that ~", ja: "すごく〜だったから〜した",
    note: "感情と行動をセットで伝える大げさな表現。",
    examples: [
      { ja: "美味しすぎて食べるのが止まらなかった。", en: "It was so good that I couldn't stop eating." },
      { ja: "そのコーヒーは美味しすぎて飲むのが止まらなかった。", en: "The coffee was so good that I couldn't stop drinking it." },
      { ja: "その映画は面白すぎて2回観た。", en: "The movie was so good that I watched it twice." },
      { ja: "疲れすぎてすぐ寝ちゃった。", en: "I was so tired that I fell asleep right away." },
    ],
  },
  {
    id: 16, part: 5, en: "I'm supposed to ~", ja: "〜することになってる",
    note: "ルールや予定でそう決まっている。義務感や言い訳を伝える。",
    examples: [
      { ja: "大事な試合に行くことになってるんだ。", en: "I'm supposed to be at the big game." },
      { ja: "今日はバイトに入ることになってるんだ。", en: "I'm supposed to work today." },
      { ja: "6時までに帰ることになってる。", en: "I'm supposed to be home by six." },
      { ja: "ここではタバコを吸っちゃいけないことになってるよ。", en: "You're not supposed to smoke here." },
    ],
  },
  {
    id: 17, part: 5, en: "How about we ~?", ja: "〜するのはどう？",
    note: "How about の後ろに普通の文（平叙文）をそのまま付けて提案する。",
    examples: [
      { ja: "今夜ピザを頼むのはどう？", en: "How about we order pizza tonight?" },
      { ja: "明日にするのはどう？", en: "How about we do it tomorrow?" },
      { ja: "駅で会うのはどう？", en: "How about we meet at the station?" },
      { ja: "ちょっと休憩するのはどう？", en: "How about we take a short break?" },
    ],
  },
  {
    id: 18, part: 5, en: "I'm willing to ~", ja: "必要なら喜んで〜する／〜する覚悟がある",
    note: "頼もしく前向きな意思を示す、できる大人の表現。",
    examples: [
      { ja: "私が責任を取る覚悟があります。", en: "I'm willing to take responsibility." },
      { ja: "必要なら手伝うよ。", en: "I'm willing to help if you need me." },
      { ja: "もっと払ってもいいよ。", en: "I'm willing to pay more." },
      { ja: "引っ越してもいいと思ってる。", en: "I'm willing to move." },
    ],
  },
  {
    id: 19, part: 5, en: "Let me know when ~", ja: "〜の時に教えてね",
    note: "Please tell me よりマイルドで柔らかい。",
    examples: [
      { ja: "暇なとき教えてね。", en: "Let me know when you're free." },
      { ja: "着いたら教えて。", en: "Let me know when you get there." },
      { ja: "準備ができたら教えてね。", en: "Let me know when you're ready." },
      { ja: "終わったら教えて。", en: "Let me know when you're done." },
    ],
  },
  {
    id: 20, part: 5, en: "Are you down for ~?", ja: "〜やる？乗る？",
    note: "down＝そっちに向かっている。気軽な誘い文句。返事は I'm down.",
    examples: [
      { ja: "後で夜ごはん行かない？", en: "Are you down for grabbing dinner later?" },
      { ja: "今夜カラオケどう？", en: "Are you down for karaoke tonight?" },
      { ja: "週末ハイキング行く？", en: "Are you down for a hike this weekend?" },
      { ja: "（誘いに対して）乗った！", en: "I'm down!" },
    ],
  },
  {
    id: 21, part: 3, en: "What I like about ~ is ~", ja: "〜の好きなところは、ズバリ〜",
    note: "特定の推しポイントを強調して伝える。",
    examples: [
      { ja: "この街の好きなところは食文化なんだ。", en: "What I like about this city is the food culture." },
      { ja: "彼の好きなところは正直なところ。", en: "What I like about him is that he's honest." },
      { ja: "この仕事の好きなところは、いろんな人に会えること。", en: "What I like about this job is that I get to meet lots of people." },
      { ja: "このお店の好きなところは雰囲気なんだ。", en: "What I like about this place is the atmosphere." },
    ],
  },
  {
    id: 22, part: 4, en: "I ended up ~ing", ja: "結局〜することになった",
    note: "紆余曲折あったけど、最終的にそうなった。",
    examples: [
      { ja: "結局一日中家にいることになった。", en: "I ended up staying home all day." },
      { ja: "結局タクシーで帰ることになった。", en: "I ended up taking a taxi home." },
      { ja: "結局3時間も話しちゃった。", en: "We ended up talking for three hours." },
      { ja: "結局彼と付き合うことになった。", en: "I ended up dating him." },
    ],
  },
  {
    id: 23, part: 3, en: "I found it ~", ja: "やってみたら〜だった",
    note: "find＝感じる・気づく。I think より客観的で大人っぽい感想。",
    examples: [
      { ja: "英語を学ぶのは難しいと感じた。", en: "I found it difficult to learn English." },
      { ja: "その本、読んでみたらすごく面白かった。", en: "I found the book really interesting." },
      { ja: "彼の説明はわかりやすかった。", en: "I found his explanation easy to understand." },
      { ja: "早起きするのはつらかった。", en: "I found it hard to wake up early." },
    ],
  },
  {
    id: 24, part: 5, en: "It takes (time) to ~", ja: "〜するのに（時間）かかる",
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
    id: 26, part: 1, en: "kind of", ja: "なんか、ちょっと",
    note: "断定を避ける魔法のクッション。",
    examples: [
      { ja: "なんか疲れた。", en: "I'm kind of tired." },
      { ja: "ちょっとお腹すいた。", en: "I'm kind of hungry." },
      { ja: "それ、なんかいいね。", en: "That's kind of cool." },
      { ja: "ちょっと緊張してる。", en: "I'm kind of nervous." },
    ],
  },
  {
    id: 27, part: 2, en: "What's your take on ~?", ja: "〜をどう捉えた？",
    note: "take＝捉え方・解釈。What do you think より知的。",
    examples: [
      { ja: "これについてどう思う？", en: "What's your take on this?" },
      { ja: "新しい計画についてどう思う？", en: "What's your take on the new plan?" },
      { ja: "あの映画の結末、どう解釈した？", en: "What's your take on the ending of that movie?" },
      { ja: "在宅勤務についてどう思う？", en: "What's your take on working from home?" },
    ],
  },
  {
    id: 28, part: 2, en: "I respect that.", ja: "それもアリだね（尊重するよ）",
    note: "自分とは違う選択でも、相手の考えを尊重する。",
    examples: [
      { ja: "旅行するために仕事を辞めるの？それもアリだね。", en: "You're quitting your job to travel? I respect that." },
      { ja: "ヴィーガンなんだ？いいね、尊重するよ。", en: "You're vegan? I respect that." },
      { ja: "私は賛成じゃないけど、尊重するよ。", en: "I don't agree, but I respect that." },
      { ja: "正直に言ってくれてありがとう。そういうところ尊敬する。", en: "Thanks for being honest. I respect that." },
    ],
  },
  {
    id: 29, part: 2, en: "I'd rather (not) ~", ja: "どちらかというと〜したい（したくない）",
    note: "I don't want to より角が立たない、大人の断り方。",
    examples: [
      { ja: "今夜はどちらかというと家にいたいな。", en: "I'd rather stay home tonight." },
      { ja: "できればその話はしたくないな。", en: "I'd rather not talk about it." },
      { ja: "どちらかというと行きたくないかな。", en: "I'd rather not go." },
      { ja: "名前は言わないでおきたいな。", en: "I'd rather not say." },
    ],
  },
  {
    id: 30, part: 2, en: "At the end of the day, ~", ja: "結局のところ〜",
    note: "いろいろあったけど最終的には…と話をビシッとまとめる決めゼリフ。",
    examples: [
      { ja: "結局、家族が一番大事だよ。", en: "At the end of the day, family is the most important." },
      { ja: "結局は君が決めることだよ。", en: "At the end of the day, it's your decision." },
      { ja: "結局、健康が一番だよね。", en: "At the end of the day, health comes first." },
      { ja: "結局、大事なのは結果だ。", en: "At the end of the day, results are what matter." },
    ],
  },
  {
    id: 31, part: 6, en: "What should I call you?", ja: "挨拶・初対面・名前の確認",
    note: "初対面でスマートに会話を始めるフレーズ。",
    examples: [
      { ja: "お話しするのは初めてですよね。", en: "I think we have never spoken before." },
      { ja: "何とお呼びすればいいですか？", en: "What should I call you?" },
      { ja: "お名前のスペルはどう書きますか？", en: "How do you spell your name?" },
      { ja: "どちらでお勤めですか？", en: "Where do you work?" },
    ],
  },
  {
    id: 32, part: 5, en: "Do you want to ~? / Let's ~", ja: "気軽なお誘い・提案の表現",
    note: "友達をフランクにご飯や遊びに誘う定番。",
    examples: [
      { ja: "一緒に遊ばない？ / 出かけない？", en: "Do you want to hang out?" },
      { ja: "何か軽く食べに行きたいな。", en: "I want to grab something to eat." },
      { ja: "飲みながら積もる話をしようよ。", en: "Let's catch up over drinks." },
      { ja: "何を食べたい（したい）気分？", en: "What are you in the mood for?" },
    ],
  },
  {
    id: 33, part: 6, en: "I'm on my way / be there in ~", ja: "移動・到着予定を伝える表現",
    note: "待ち合わせや移動中に今どこにいるかを伝える。",
    examples: [
      { ja: "今向かっているところだよ。", en: "I'm on my way." },
      { ja: "5分でそっちに行けるよ。", en: "I can be there in 5 minutes." },
      { ja: "あとどれくらいでここに来られる？", en: "How soon can you get here?" },
      { ja: "着いたら電話するね。", en: "I'll call you when I get there." },
    ],
  },
  {
    id: 34, part: 6, en: "Two more will be joining us", ja: "合流・人数の連絡",
    note: "飲み会や食事で追加の参加者を伝えるフレーズ。",
    examples: [
      { ja: "後からもう2人合流します。", en: "Two more will be joining us later." },
      { ja: "男の子？それとも女の子？", en: "Is it he or she?" },
      { ja: "迷わずにここまで来られましたか？", en: "Did you have any problem finding us?" },
      { ja: "あなたは右から2番目です。", en: "You are second from right." },
    ],
  },
  {
    id: 35, part: 3, en: "What did you get up to?", ja: "近況と習慣・休みの過ごし方",
    note: "週末何してた？や体質・日課を共有する。",
    examples: [
      { ja: "何をして過ごしてたの？", en: "What did you get up to?" },
      { ja: "ジムで筋トレ（運動）してきました。", en: "I worked out at the gym." },
      { ja: "私は朝型人間じゃないんだ（朝は苦手）。", en: "I'm not a morning person." },
      { ja: "私はお酒に強いんです（簡単には酔わない）。", en: "I don't get drunk easily." },
    ],
  },
  {
    id: 36, part: 6, en: "It's nice and warm today", ja: "天気・気候の雑談",
    note: "アイスブレイクにぴったりの天気の表現。",
    examples: [
      { ja: "今日は暖かくて気持ちいいね。", en: "It's nice and warm today." },
      { ja: "まだ雨降ってる？", en: "Is it still raining?" },
      { ja: "エアコンをつけてもらえますか？", en: "Turn on the air conditioner, please." },
    ],
  },
  {
    id: 37, part: 6, en: "Don't overdo it", ja: "体調・健康の気遣い",
    note: "くしゃみや風邪、相手の疲労を思いやる言葉。",
    examples: [
      { ja: "くしゃみが止まりません。", en: "I can't stop sneezing." },
      { ja: "風邪は良くなりましたか？", en: "Has your cold gotten better?" },
      { ja: "どうしてそんなに疲れているように見えるの？", en: "Why do you seem so tired?" },
      { ja: "無理しすぎないでね。", en: "Don't overdo it." },
    ],
  },
  {
    id: 38, part: 6, en: "My phone's almost dead", ja: "スマホ・日常のアクシデント",
    note: "日常で誰もが経験するトラブルのとっさの一言。",
    examples: [
      { ja: "スマホの充電（バッテリー）が切れそう。", en: "My phone's almost dead." },
      { ja: "何を言おうとしていたか忘れちゃった。", en: "I forgot what I was going to say." },
      { ja: "ちょっと眠いな。", en: "I'm kind of sleepy." },
      { ja: "本当に危なかった / 間一髪だったよ。", en: "It was really close." },
    ],
  },
  {
    id: 39, part: 6, en: "I should get going", ja: "ちょっとした立ち寄り・移動・離席",
    note: "生活の中のちょっとした行動を英語にする。",
    examples: [
      { ja: "コンビニに立ち寄りました。", en: "I stopped by at the convenience store." },
      { ja: "そろそろ行かなきゃ。", en: "I should get going." },
      { ja: "少し詰めて（席をずれて）いただけますか？", en: "Could you move over, please?" },
      { ja: "通してください。", en: "Let me through." },
    ],
  },
  {
    id: 40, part: 6, en: "Let's call it a day", ja: "別れ際の挨拶・お開き・気遣い",
    note: "別れ際に相手の素敵な1日や知り合いへの伝言を伝える。",
    examples: [
      { ja: "良い一日をお過ごしください。", en: "I hope you have a great day." },
      { ja: "彼によろしく伝えておいてね。", en: "Say hi to him for me." },
      { ja: "今日はここまでにしましょう（お開きにしよう）。", en: "Let's call it a day." },
    ],
  },
  {
    id: 41, part: 7, en: "Do you mind if I sit here?", ja: "席や順番を丁寧に確認する表現",
    note: "混んでいるカフェや電車・行列で使う定番。",
    examples: [
      { ja: "ここに座ってもいいですか？", en: "Do you mind if I sit here?" },
      { ja: "列に並んでいますか？", en: "Are you in line?" },
      { ja: "2人用の席は空いていますか？", en: "Do you have a table for two?" },
      { ja: "待ち時間はどれくらいですか？", en: "How long is the wait?" },
    ],
  },
  {
    id: 42, part: 7, en: "Can I get this to go?", ja: "カフェ・レストランでの注文",
    note: "同じもの、持ち帰り、ドリンクのみなどの注文。",
    examples: [
      { ja: "私も同じものをください。", en: "I'll have the same thing." },
      { ja: "これを持ち帰り（テイクアウト）にできますか？", en: "Can I get this to go?" },
      { ja: "飲み物だけの注文でも大丈夫ですか？", en: "Is it okay to just order drinks?" },
      { ja: "ステーキの焼き加減はいかがなさいますか？", en: "How would you like your steak?" },
    ],
  },
  {
    id: 43, part: 7, en: "This isn't what I ordered", ja: "注文のトラブル・確認",
    note: "頼んだものと違う時や素材を確認したい時。",
    examples: [
      { ja: "これは私が注文したものではありません。", en: "This isn't what I ordered." },
      { ja: "何で作られているのですか？", en: "What's it made with?" },
      { ja: "思っていたよりずっと大きいです。", en: "It's a lot bigger than I thought." },
    ],
  },
  {
    id: 44, part: 7, en: "Could I have a receipt, please?", ja: "お会計・割り勘の確認",
    note: "レジやテーブル会計で焦らず使える表現。",
    examples: [
      { ja: "レシートをいただけますか？", en: "Could I have a receipt, please?" },
      { ja: "だいたいいくらですか？", en: "About how much is it?" },
      { ja: "1人あたり1000円ってこと？", en: "Do you mean 1,000 yen per person?" },
      { ja: "レジ袋はご利用になりますか？", en: "Do you need a plastic bag?" },
    ],
  },
  {
    id: 45, part: 7, en: "I'll treat you", ja: "おごり・支払い・好み",
    note: "食事の支払いや好みをスマートに伝える。",
    examples: [
      { ja: "ご馳走するよ / おごるよ。", en: "I'll treat you." },
      { ja: "家で食べたいな。", en: "I'd rather eat at home." },
      { ja: "あまり好みじゃないな / 得意じゃないな。", en: "It's not my favorite." },
    ],
  },
  {
    id: 46, part: 7, en: "Do you have size ~ in black?", ja: "買い物でのサイズ・在庫・値引き",
    note: "ショッピングで希望のサイズや他の商品を探す時。",
    examples: [
      { ja: "黒の11サイズはありますか？", en: "Do you have size 11 in black?" },
      { ja: "他にどんなものがありますか？", en: "What else do you have?" },
      { ja: "少し値引きしてもらえませんか？", en: "Could you give me a discount?" },
    ],
  },
  {
    id: 47, part: 7, en: "How far is it from here?", ja: "移動・距離・来訪理由",
    note: "道案内や旅先での会話に役立つフレーズ。",
    examples: [
      { ja: "ここからどれくらいの距離ですか？", en: "How far is it from here?" },
      { ja: "どうして東京に来られたのですか？", en: "What brings you to Tokyo?" },
      { ja: "予約をキャンセルしたいのですが。", en: "I would like to cancel my booking." },
    ],
  },
  {
    id: 48, part: 7, en: "That looks good on you", ja: "外見・似合っていることを褒める",
    note: "相手の身につけているものを自然に褒める。",
    examples: [
      { ja: "それ、君によく似合ってるよ。", en: "That looks good on you." },
      { ja: "お褒めの言葉ありがとうございます。", en: "I appreciate the compliment." },
      { ja: "きっと気に入ると思うよ。", en: "I'm sure you'll like it." },
    ],
  },
  {
    id: 49, part: 7, en: "It's almost time", ja: "時間の合図とサロンでの指示",
    note: "開始や終了の合図、サロン等での定番表現。",
    examples: [
      { ja: "そろそろ時間だよ / もうすぐ時間だ。", en: "It's almost time." },
      { ja: "もうすぐ終わるよ。", en: "I'll be done soon." },
      { ja: "うつ伏せになってください。", en: "Please lie on your stomach." },
    ],
  },
  {
    id: 50, part: 8, en: "What can I do for you?", ja: "相手への手助け・サポートの申し出",
    note: "困っていそうな相手に声をかけるビジネス口語。",
    examples: [
      { ja: "何かお手伝いしましょうか？ / ご用件は何ですか？", en: "What can I do for you?" },
      { ja: "喜んでお手伝いしますよ / お役に立てて嬉しいです。", en: "I'm glad to help you." },
      { ja: "どなたか志願（立候補）する方はいませんか？", en: "Any volunteers?" },
    ],
  },
  {
    id: 51, part: 8, en: "Can you take it from here?", ja: "業務の引き継ぎ・依頼",
    note: "同僚にバトンタッチしたり協力を頼む時。",
    examples: [
      { ja: "ここから引き継いでもらえる？", en: "Can you take it from here?" },
      { ja: "ちょっと手伝ってもらえると助かるな。", en: "I could use some help." },
      { ja: "そうしていただけると助かります。", en: "That would be appreciated." },
      { ja: "他の人に聞いてみてください。", en: "Please ask someone else." },
    ],
  },
  {
    id: 52, part: 8, en: "Something came up", ja: "急な予定・手の離せない状況",
    note: "急な予定が入ったり、手一杯な状態を伝える。",
    examples: [
      { ja: "急用ができちゃったんだ。", en: "Something came up." },
      { ja: "今は手が離せないんだ / 忙しいんだ。", en: "I'm tied up right now." },
      { ja: "やることが山積みなんだ / 手一杯なんだ。", en: "I have a lot on my plate." },
      { ja: "今日は遅れるかもしれません。", en: "I may be late today." },
    ],
  },
  {
    id: 53, part: 8, en: "When is a good time for you?", ja: "日程調整・都合の確認",
    note: "ミーティングやアポイントの日程調整の基本。",
    examples: [
      { ja: "いつなら都合がいいですか？", en: "When is a good time for you?" },
      { ja: "明後日はどう？", en: "How about the day after tomorrow?" },
      { ja: "6時に終わることになっているんだ。", en: "I'm supposed to finish at 6." },
    ],
  },
  {
    id: 54, part: 8, en: "Can you call me back later?", ja: "電話での対応・折り返し",
    note: "電話口でのスマートな英語対応フレーズ。",
    examples: [
      { ja: "後でかけ直してもらえますか？", en: "Can you call me back later?" },
      { ja: "間違い電話だと思います。", en: "I think you have the wrong number." },
      { ja: "起こしちゃってないよね？", en: "I didn't wake you, did I?" },
    ],
  },
  {
    id: 55, part: 2, en: "Can I give you my opinion?", ja: "手続き・サイン・意見の表明",
    note: "書類のサイン依頼や、会議で意見を言いたい時。",
    examples: [
      { ja: "ここにサインをいただけますか？", en: "Could you sign here?" },
      { ja: "私の意見を言ってもいいですか？", en: "Can I give you my opinion?" },
      { ja: "質問の答えになっていますでしょうか？", en: "Does that answer your question?" },
    ],
  },
  {
    id: 56, part: 8, en: "I'll see what I can do", ja: "検討・善処・対応の返答",
    note: "即答せずに持ち帰る時や「任せて」と伝える時。",
    examples: [
      { ja: "少し考えさせてください。", en: "Let me think about it." },
      { ja: "何ができるかやってみるよ / 善処します。", en: "I'll see what I can do." },
      { ja: "何とかうまくやれます / 大丈夫です。", en: "I can manage it." },
      { ja: "やってみるよ / 挑戦してみるね。", en: "I'll give it a go." },
    ],
  },
  {
    id: 57, part: 8, en: "I'm sorry to bother you", ja: "お詫び・限界の丁寧な伝達",
    note: "角を立てずに丁寧にお断りやお詫びをする。",
    examples: [
      { ja: "お役に立てず申し訳ありません。", en: "I'm sorry I can't be of any help." },
      { ja: "お邪魔して（お手数をおかけして）すみません。", en: "I'm sorry to bother you." },
      { ja: "私の責任（せい）だと思う。", en: "I guess it's my fault." },
      { ja: "私が知っているのはそれだけです。", en: "That's all I know about it." },
    ],
  },
  {
    id: 58, part: 1, en: "What's your point?", ja: "要点確認・聞き返し",
    note: "会議や議論で論点を確認したい時に使う口語。",
    examples: [
      { ja: "要するに何が言いたいの？", en: "What's your point?" },
      { ja: "それはどういう意味ですか？", en: "What does that mean?" },
      { ja: "えっ、何て言った？ / 何だって？", en: "Say what?" },
      { ja: "求めすぎかな？ / 高望みしすぎかな？", en: "Am I asking too much?" },
    ],
  },
  {
    id: 59, part: 1, en: "Take as long as you need", ja: "相手を急かさない気遣い",
    note: "「時間をかけて大丈夫」と相手を安心させる。",
    examples: [
      { ja: "必要なだけ時間をかけて大丈夫ですよ。", en: "Take as long as you need." },
      { ja: "無理する必要はないよ。", en: "You don't need to push yourself." },
    ],
  },
  {
    id: 60, part: 9, en: "I know how you feel", ja: "共感・理解・味方になる言葉",
    note: "信頼関係を深める温かい共感のフレーズ。",
    examples: [
      { ja: "その気持ち、よく分かるよ。", en: "I know how you feel." },
      { ja: "賛成だよ / 君の味方だよ。", en: "I'm with you." },
      { ja: "言いたいことは分かります。", en: "I see what you mean." },
      { ja: "応援しているよ！", en: "I'm rooting for you." },
    ],
  },
  {
    id: 61, part: 9, en: "I'm sorry to hear that", ja: "お悔やみ・心配・慰め",
    note: "訃報や相手の辛い状況に心を込めて返す。",
    examples: [
      { ja: "それはお気の毒に / 残念ですね。", en: "I'm sorry to hear that." },
      { ja: "ご愁傷様です / お悔やみ申し上げます。", en: "I'm sorry for your loss." },
      { ja: "何が気になっているの？ / 何か悩みでもある？", en: "What's bothering you?" },
      { ja: "悲しくなるよ / それを聞くと悲しいな。", en: "That makes me sad." },
    ],
  },
  {
    id: 62, part: 9, en: "Don't worry, it's fine", ja: "安心させる・励ましの一言",
    note: "失敗やプレッシャーに直面している人を元気づける。",
    examples: [
      { ja: "心配しないで、大丈夫だから。", en: "Don't worry, it's fine." },
      { ja: "よくあることだよ。", en: "It happens a lot." },
      { ja: "慣れれば簡単だよ。", en: "It's easy once you get used to it." },
      { ja: "もうすっかり慣れました。", en: "I've got used to it." },
    ],
  },
  {
    id: 63, part: 9, en: "Why not take a chance?", ja: "挑戦の後押し・エール",
    note: "諦めそうな人や挑戦を迷う人を後押しする。",
    examples: [
      { ja: "思い切ってやってみたら？ / チャンスを掴んでみたら？", en: "Why not take a chance?" },
      { ja: "やってみないと分からないよ。", en: "You never know until you try." },
      { ja: "諦める（白旗を上げる）にはまだ早すぎるよ。", en: "It's too early to throw in the towel." },
      { ja: "もう一度やってみますか？", en: "Do you want to try one more time?" },
    ],
  },
  {
    id: 64, part: 9, en: "That's news to me", ja: "驚き・初耳・強い疑い",
    note: "感情が大きく動いた時のネイティブの反応。",
    examples: [
      { ja: "それは初耳です。", en: "That's news to me." },
      { ja: "それは意外ですね / 驚きですね。", en: "That's surprising." },
      { ja: "そんなの嘘でしょ / 本当のはずがない。", en: "It can't be true." },
      { ja: "どうしてそれを知っていたの？", en: "How did you know that?" },
    ],
  },
  {
    id: 65, part: 4, en: "I can't make up my mind", ja: "迷い・判断・直感",
    note: "優柔不断な時や勘を口にする時のフレーズ。",
    examples: [
      { ja: "決められないよ / 迷っちゃうな。", en: "I can't make up my mind." },
      { ja: "あなた次第だよ / お任せするよ。", en: "It's up to you." },
      { ja: "なんとなくそんな気がするんだ。", en: "I just have a feeling." },
      { ja: "嫌な予感がするな。", en: "I have a bad feeling about this." },
    ],
  },
  {
    id: 66, part: 2, en: "I'd rather not", ja: "角を立てない断り・反論",
    note: "相手を不快にさせずに自分の立場を主張する。",
    examples: [
      { ja: "遠慮しておきます。", en: "I'd rather not." },
      { ja: "言うのは簡単だよ（他人事だから言えるんだ）。", en: "That's easy for you to say." },
      { ja: "それは全然違うよ / まるで別物だよ。", en: "That's totally different." },
      { ja: "気のせいだよ / 思い過ごしだよ。", en: "It's your imagination." },
    ],
  },
  {
    id: 67, part: 1, en: "Don't expect too much", ja: "クッション言葉・前置き",
    note: "自分の言いたいことを柔らかく伝えるクッション。",
    examples: [
      { ja: "あまり期待しすぎないでね。", en: "Don't expect too much." },
      { ja: "言ってる意味伝わるかな？ / 筋が通っていればいいけど。", en: "If that makes sense." },
      { ja: "知らないほうがいいよ（聞かないほうが身のためだよ）。", en: "You don't want to know." },
      { ja: "最後まで話を聞いてよ。", en: "Hear me out." },
    ],
  },
  {
    id: 68, part: 4, en: "That reminds me", ja: "感情の吐露・思い出・後悔",
    note: "心の内を素直に表現する味わい深いフレーズ。",
    examples: [
      { ja: "まるで子供に戻ったような気分だよ。", en: "I feel like I'm a kid again." },
      { ja: "この写真を見ると懐かしい思い出が蘇るよ。", en: "This picture brings back memories." },
      { ja: "それで思い出したよ / そういえば。", en: "That reminds me." },
      { ja: "もっと分かっておくべきだった / 浅はかだった。", en: "I should have known better." },
    ],
  },
  {
    id: 69, part: 9, en: "That would be nice", ja: "素直な気持ち・受け答え",
    note: "会話のテンポを良くするスマートな受け答え。",
    examples: [
      { ja: "そう言っていただけて嬉しいです。", en: "It's so nice of you to say." },
      { ja: "そうなるといいね / そうしてもらえると嬉しいな。", en: "That would be nice." },
      { ja: "どうだった？（結果や感想）", en: "How did it go?" },
      { ja: "気が向いたらやるよ。", en: "I'll do it if I feel like it." },
    ],
  },
  {
    id: 70, part: 9, en: "I don't know what to say", ja: "戸惑い・疑問・理由の問いかけ",
    note: "言葉に詰まった時や感情の理由を深く聞く時。",
    examples: [
      { ja: "何と言っていいか分かりません。", en: "I don't know what to say." },
      { ja: "よく分かりません / はっきりとは言えません。", en: "I'm not sure." },
      { ja: "君ならそうすると思う？", en: "Is that what you would do?" },
      { ja: "どうしてそう思うの？", en: "How come you think so?" },
      { ja: "どうして怒っているの（取り乱しているの）？", en: "Why are you upset?" },
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

// ==========================================
// 💡 ネイティブのニュアンス解説辞書 (全357問・口語70型＋GRIT30型＋個別フレーズ完全対応)
// ==========================================
window.PATTERN_NUANCES = {
  // Part 1〜5: コア構文 1〜30
  1: "「I think ~」よりも控えめで柔らかく、「自分の肌感覚・ざっくりした見積もりでは〜かな」と断定を避けて保険をかけたい時にネイティブが最も好む定番表現です。",
  2: "「ケースバイケース」「〜次第かな」を英語らしく言うスマートな型。即答でYes/Noを言い切らず、条件によって変わることを自然に示す知的なクッションです。",
  3: "具体例を1〜2個挙げた後に「〜とかそんな感じ」と気さくにぼかす最強の口語チャンク。「etc.」や「and so on」よりも圧倒的に日常会話で頻出します。",
  4: "「〜だからといって、必ずしも…とは限らない」と、相手や世間の短絡的な思い込み・決めつけを論理的かつスマートに否定する構文です。",
  5: "「必ずしも〜というわけじゃないよ」と、相手の意見を真っ向から否定せずに「例外もあるよね」と大人の余裕でかわす上品な部分否定です。",
  6: "自分の体質・気質・クセを「そういう脳（brain）や体（body）を持っている」とユーモラスに自己開示する表現。言い訳がましくならず親近感を生みます。",
  7: "「その時『〜！』って感じだったんだよ」と、当時の自分のリアクションや心の声を臨場感たっぷりに再現する超頻出の口語表現。実際に声に出していなくても使えます。",
  8: "自分を機械やシステムに例えて「〜がないと頭や体がまともに動かない（機能しない）」と、欠かせない日課や大好物をユーモアたっぷりに伝える表現です。",
  9: "「昔はよく〜していたけれど、今は…だ」と過去の習慣と現在の変化を鮮やかに対比させる型。自己紹介やライフスタイルの変化を語るのに最適です。",
  10: "「〜することにはもう慣れっこだよ」と現在の適応状態を伝える型。「used to 動詞原形（昔は〜した）」と混同せず「be used to -ing」の塊で口に馴染ませるのがコツです。",
  11: "「I'm looking forward to ~」よりもずっとカジュアルでワクワク感がストレートに溢れる「〜が待ちきれない！楽しみで仕方ない！」という表現です。",
  12: "「stand（我慢する・耐える）」を使い、「どうしても生理的に無理・我慢ならない」という強い嫌悪感や苦手なものをリアルに伝える表現です。",
  13: "「今はちょっと〜する気分（テンション）じゃないんだ」と、体調や気乗りしない気持ちを素直かつ角を立てずに伝える日常会話の必須フレーズです。",
  14: "「help（避ける・抑える）」ができず、「頭では分かっていても、つい〜してしまう・抑えきれない」という人間らしい本音や衝動を表す型です。",
  15: "「あまりに〜だったので、思わず…してしまった」と、強い感情や状況（原因）と、その結果とった行動を一息でドラマチックにつなぐ構文です。",
  16: "「（ルール・約束・予定で）〜することになっている」を表す万能表現。客観的な予定を伝える時にも、やんわり断る口実にする時にも重宝します。",
  17: "「How about we + 普通の文？」の語順で、「〜するのはどう？」と仲間内で対等かつ気軽にアイディアを出す、最も使いやすい提案パターンです。",
  18: "「強制されてではなく、必要なら喜んで〜するよ／〜する覚悟がある」という、前向きな協力姿勢やプロフェッショナルな覚悟を示す頼もしい表現です。",
  19: "「Please tell me」よりも圧倒的に自然で押しつけがましくない「〜になったら教えてね・連絡してね」。日常からビジネスまで毎日使える依頼表現です。",
  20: "「down」は「そっちのプランに乗る・賛成する」というスラング。「〜やらない？乗る？」とフランクに誘い、乗る時は「I'm down!」と即答できます。",
  21: "普通に「I like ~」と言うよりも、「〜の何が一番好きかって言うと、ズバリ…」と聞き手の注目を集めてから推しポイントを強調できるスピーチライクな構文です。",
  22: "「最初は違う予定だったのに、紆余曲折あって最終的に〜することになった」という、予想外の展開やオチを語る時に欠かせないストーリーテリング表現です。",
  23: "「実際にやってみたら（経験してみたら）〜だと感じた・分かった」と、単なる予想（I think）ではなく実体験に基づく客観的な感想を述べる大人の表現です。",
  24: "人を主語にせず「It takes + 時間 + to ~」で「〜するのに（これだけの時間が）かかる」と客観的に所要時間を伝える、英語の最も基本的なリズムです。",
  25: "「I have to ~」がカジュアルに崩れた口語表現。「あ、もう行かなきゃ（I gotta go）」など、日常のちょっとした義務感をテンポよく伝える時に使います。",
  26: "形容詞や動詞の前にポンと置くだけで「なんかちょっと〜」「どちらかと言うと〜」と表現をマイルドにぼかせる、ネイティブが毎分のように使うクッション語です。",
  27: "「What do you think?」よりも一歩踏み込んで、「あなたなりの見解・解釈（take）はどう？」と相手の意見を敬意を持って引き出すスマートな質問です。",
  28: "自分とは違う選択や価値観に対しても、「そういう生き方・考え方も素晴らしいね、尊重するよ」と肯定的に受け止める、懐の深い大人の相槌です。",
  29: "「I don't want to ~」と直接拒絶する代わりに、「どちらかと言えば〜したいな（〜は遠慮しておきたいな）」と品よく希望や断りを伝える表現です。",
  30: "「いろいろ議論や事情はあるけれど、結局のところ一番大切なのは〜だよね」と、会話の最後に本質をビシッとまとめる決めゼリフです。",

  // Part 6〜9: シチュエーション別実践フレーズ 31〜70
  31: "初対面の相手と距離を縮める挨拶・自己紹介の定番。呼び方やスペル、仕事を自然に尋ねて会話をスムーズに広げます。",
  32: "友人や同僚をフランクに食事や遊びに誘う表現。「hang out」「grab」「catch up」などネイティブが好むこなれた動詞が鍵です。",
  33: "待ち合わせや移動中に「今向かってる」「あと何分で着く」とリアルタイムで状況を共有する、日常連絡の必須フレーズです。",
  34: "合流や案内、ちょっとした確認をスマートに伝える表現。その場の状況をシンプルかつ的確な英語で描写します。",
  35: "週末の過ごし方や、自分の日課・体質（朝型・お酒の強さなど）をフランクにシェアして雑談を盛り上げる表現です。",
  36: "天気や室温など、今いる空間の心地よさや空調のお願いを自然に切り出すアイスブレイク・日常表現です。",
  37: "くしゃみや風邪、疲れなど、自分や相手の体調を気遣う温かい表現。「無理しないでね（Don't overdo it）」は定番の思いやりフレーズです。",
  38: "充電切れや度忘れ、眠気やヒヤッとした瞬間など、日常で誰もが経験するちょっとしたハプニングを即座に口にする表現です。",
  39: "コンビニへの立ち寄りや「そろそろ行かなきゃ」、席を詰めてもらう時など、日常の移動・行動に直結するひとことです。",
  40: "別れ際の挨拶や伝言、仕事の「今日はここまでにしよう（Let's call it a day）」など、会話を気持ちよく締めくくる表現です。",
  41: "カフェの空席確認や行列の最後尾確認、レストランでの人数・待ち時間の質問など、外出先で迷わず使える丁寧な確認表現です。",
  42: "「同じものを」「テイクアウトで」「ドリンクだけでもいい？」など、カフェやレストランの注文をスマートにこなす実戦フレーズです。",
  43: "注文と違うものが来た時の冷静な指摘や、料理の食材・ボリュームについての自然なリアクション表現です。",
  44: "レシートのお願いや概算金額・割り勘の確認など、レジやテーブルでの会計をスムーズに済ませる表現です。",
  45: "「ここは私が出すよ」というスマートなおごり表現や、食事の好み・希望を角を立てずに伝えるフレーズです。",
  46: "ショップで希望のサイズ・色があるか尋ねたり、他の選択肢やちょっとした値引きを交渉する買い物フレーズです。",
  47: "目的地までの距離や来訪のきっかけ（「なぜ東京へ？」）、予約のキャンセルなど、移動・旅行シーンの定番表現です。",
  48: "相手の服装や持ち物を「よく似合ってるね！」と自然に褒め、褒められた側もスマートに感謝を返す社交フレーズです。",
  49: "「そろそろ時間だよ」「もうすぐ終わるよ」という時間の合図や、ボディケア等で体勢を案内する実用表現です。",
  50: "困っている相手への声かけや「喜んで手伝うよ」、メンバーから手を挙げてもらう時など、協力を生み出すポジティブな表現です。",
  51: "業務のバトンタッチ（引き継ぎ）や「少し手を貸してほしい」と周囲にスマートに助けを求めるビジネス口語です。",
  52: "「急用が入った」「今ちょっと手が離せない」「仕事が山積み」など、忙しい状況を簡潔に共有する表現です。",
  53: "相手の都合の良い日時を尋ねたり、終了予定時刻を伝えてスムーズにスケジュールを調整するフレーズです。",
  54: "電話の折り返し依頼や間違い電話の指摘、夜遅くや朝早くに相手を気遣う電話応対の定番表現です。",
  55: "サインの依頼や会議での発言許可、自分の回答が相手の疑問に答えられているかを確認する丁寧なビジネス表現です。",
  56: "その場で即答できない時に「少し考えさせて」「善処します」と引き受けたり、「やってみるよ」と前向きに応じる表現です。",
  57: "力になれない時のお詫びや、声をかける際の「お邪魔してすみません」など、礼儀正しく誠実に境界線を伝える表現です。",
  58: "議論の核心（「要するにどういうこと？」）を確認したり、聞き返しや要望の妥当性を尋ねる率直なコミュニケーション表現です。",
  59: "「必要なだけ時間をかけていいよ」「無理しないで」と、相手のペースを尊重してプレッシャーを和らげる一言です。",
  60: "「気持ちはよく分かる」「君の味方だよ」「応援してるよ」と、相手に寄り添い信頼関係を深める共感フレーズです。",
  61: "良くない知らせへの「お気の毒に」や深いお悔やみ、相手の悩みを気遣う繊細で温かい寄り添いの言葉です。",
  62: "「大丈夫だよ」「よくあることさ」「慣れれば簡単だよ」と、不安や失敗を抱える相手をリラックスさせる励まし表現です。",
  63: "「思い切ってやってみたら？」「やってみなきゃ分からないよ」「諦めるのはまだ早い」と挑戦する人の背中を押すエールです。",
  64: "「初耳だよ！」「まさか、信じられない」「なんで知ってるの？」と、驚きのニュースに生き生きと反応する相槌です。",
  65: "「迷って決められない」「あなたに任せるよ」「なんとなく予感がする」など、決断や直感にまつわる日常表現です。",
  66: "やんわりとした辞退や「言うのは簡単だよ」「それは話が別だ」「気のせいだよ」と自分の視点から切り返す口語表現です。",
  67: "「あまり期待しないでね」「言ってる意味伝わるかな？」「最後まで聞いて」と、本題の前後に添えるリアルな会話の潤滑油です。",
  68: "童心に返るワクワク感や写真を見て蘇る記憶、「あ、それで思い出した」「浅はかだったな」と感情をしみじみ語る表現です。",
  69: "褒め言葉への感謝や「だといいね」「どうだった？」「気が向いたらね」など、会話を軽やかに受け流す返答パターンです。",
  70: "言葉に詰まった時の率直な吐露や、「君ならどうする？」「どうしてそう思うの？」と相手の真意を尋ねる表現です。"
};

// 💡 TED・GRIT知的思考編 構文ニュアンス辞書 (1〜30)
window.GRIT_PATTERN_NUANCES = {
  1: "「Aでの〜な仕事を辞め、さらに〜なBへ進んだ」とキャリアの転換を語る際、『even more ~ : B』とコロンで溜めてから職種を明かすことで、聞き手の好奇心を一気に惹きつけるTED流のオープニング技法です。",
  2: "「Like any ~（他のあらゆる〜と同じように）」と自分の日常業務を謙虚かつ具体的に描写することで、特別な人間の話ではなく現場のリアルな体験談として聴衆の共感を呼び込むストーリーテリング表現です。",
  3: "「What struck me was that ~（私の心を強く打ったのは／ハッとさせられたのは〜だ）」は、単なる『I noticed』を超え、常識が覆るような重大な気づきを得た瞬間をドラマチックに切り取る知的プレゼンの必須構文です。",
  4: "「AとBを分ける違いは〜だけではない」と、世間が信じている単一の原因論（才能・資金・学歴など）に穏やかかつ論理的に疑問を投げかけ、議論の視野を広げる知的な否定構文です。",
  5: "「最も優秀な成果を出した人々の中にさえ、〜を持たない人がいた」と、通説の『必須条件』を覆す実例を提示し、聞き手の固定観念を鮮やかに揺さぶる対比表現です。",
  6: "構文5と対をなす「最も優秀（スマート）なはずの人材の中に、思うような成果を出せない人がいた」という逆説。データや現場の観察から『才能＝成功ではない』という核心へ導く布石になります。",
  7: "「And that got me thinking.（そして、その事実が私を深い思考へと駆り立てた）」は、現場での違和感や発見から『本質的な問い・仮説』へと話を展開する、最高にクールなブリッジ（橋渡し）表現です。",
  8: "「確かに難しい（sure, they're hard）。だが不可能ではない（not impossible）」と、最初に相手の苦労や難易度を100%認めて共感した上で、力強く可能性を肯定する説得力抜群のレトリックです。",
  9: "「I was firmly convinced that ~（〜だと固く確信していた）」は、単なる『I believed』よりも信念の深さと情熱が伝わる表現。努力と時間の力を信じるリーダーや教育者の強い意志を体現します。",
  10: "「さらに数年間〜を経験した後、…という結論に至った」と、思いつきではなく長期の実践・観察の積み重ねから導き出された重みのある結論（came to the conclusion）を提示する型です。",
  11: "「今本当に必要なのは、〜の視点（perspective）から…をより深く理解することだ」と、表層的な対策ではなく議論の『視座』そのものを一段引き上げる知的な問題提起です。",
  12: "「私たちが最も正確に測定できる唯一のものは〜だ」と述べることで、『測りやすい数値（IQや短期売上）』ばかりを重視し、本当に重要な本質を見落としていないか？と鋭く問いかける構文です。",
  13: "「What if ~ depends on much more than ...?（もし〜が、…以上のものにかかっているとしたら？）」と疑問形で仮説を投げかけることで、聞き手自身の頭の中で新しい可能性を想像させるキラーフレーズです。",
  14: "「だから私はAを去り、CになるためにBへ進んだ」と、自らの問いを解明するためにキャリアを大きく舵切りした決断を、シンプルで力強い動詞の連鎖で語る表現です。",
  15: "「あらゆる調査において、私の問いは常に一つ、『ここで成功するのは誰で、それはなぜか？』だった」と、複雑な研究やプロジェクトを貫く『たった一つのシンプルな問い』を明示する構文です。",
  16: "「誰が最後まで残り（stay）、誰が途中で脱落するか（drop out）を予測しようとした」と、継続性と定着のメカニズムを検証する際のクリアな対比構造です。",
  17: "単なるスキルや肩書きではなく、「最終的に〜の成果（outcomes）を高める上で誰が最も効果的なのか」と、実質的なインパクトに焦点を当てるプロフェッショナルな評価軸の表現です。",
  18: "「全く異なるあらゆる環境において、たった一つの特性が決定的な予測因子（significant predictor）として浮上した」と、多様な事例から普遍的な法則を導き出すクライマックスの導入表現です。",
  19: "「It wasn't A. It wasn't B, and it wasn't C. It was X.」と、人々が予想する要因を三段否定で次々と切り捨て、最後に真の答え（X）を際立たせる、スピーチで最も聴衆を惹きつける劇的レトリックです。",
  20: "抽象的な概念を「passion and perseverance for very long-term goals（極めて長期的な目標に対する情熱と粘り強さ）」と、誰の記憶にも残る洗練された言葉でズバリ定義する名言構文です。",
  21: "「day in, day out（来る日も来る日も）」「not just for A, but for B（数週間や数ヶ月ではなく、何年もの間）」と時間のスケールを重ねることで、本物の継続の重みを体感させる表現です。",
  22: "「人生を短距離走（sprint）ではなくマラソン（marathon）のように生きることだ」という直感的なメタファーを使うことで、長期的なペース配分と持久力の重要性を一瞬で共有できます。",
  23: "「Turns out (that) ~（調べてみると／フタを開けてみたら〜だと判明した）」は、堅苦しい『It was discovered』を避け、意外なデータや事実を親しみやすく知的に紹介する超頻出表現です。",
  24: "「測定可能なあらゆる条件（〜など）を揃えて比較した場合でさえも」と補足することで、『他の要因のせいではないか？』という反論を先回りして封じる、極めてロジカルな説得表現です。",
  25: "「It's not just in A that ~ matters. It's also in B, especially for C.」という強調構文の展開により、特定の現場での発見をより広い社会全体の課題へとスケールアップさせる構文です。",
  26: "専門家でありながら「最も衝撃的なのは、〜について私たちがいかに無知か（how little we know）ということだ」と率直に認めることで、知的誠実さとさらなる探求の重要性を印象づけます。",
  27: "前の文で「分からないことも多い」と譲歩した直後に、「What I do know is that ~（ただ一つ確実に言えるのは〜だ）」と強調の『do』を使って核心のメッセージを力強く言い切る対比構文です。",
  28: "「follow through on their commitments（自らの約束・目標を最後までやり抜く）」という実務でも超重要なチャンクを使い、才能と実行力のギャップをデータに基づいて冷静に指摘する表現です。",
  29: "「unrelated or even inversely related to ~（〜と無関係、あるいは逆相関ですらある）」という統計・分析の語彙を使い、常識とは真逆のファクトを知的に突きつける表現です。",
  30: "「失敗することを厭わず、間違うことを受け入れ、得られた教訓と共に再び最初からやり直す覚悟を持たねばならない」と、三つの不定詞を重ねて聴衆を勇気づける感動的な結びの構文です。"
};

// 💡 Part 6〜9 (31-0 〜 70-4) 個別フレーズ完全対応ニュアンス辞書
window.CARD_NUANCES = {
  "31-0": "職場やイベントで見かけたことはあるけれど話すのは初めて、という相手に「お話しするのは初めてですよね」と自然に声をかけるスマートなきっかけ作りの一言です。",
  "31-1": "「What's your name?」よりも圧倒的に丁寧でこなれた表現。本名だけでなくニックネームも含めて「何とお呼びすればいいですか？」と尋ねる初対面の必須フレーズです。",
  "31-2": "受付や連絡先交換、オンライン会議などで相手の名前の綴りを確認する定番表現。「How do you spell ~?」はあらゆる単語の確認に応用できます。",
  "31-3": "「どこの会社（またはどのエリア）で働いているんですか？」と尋ねる社交の定番。「What do you do?（職種）」とセットで会話が広がります。",
  "32-0": "「hang out」は特に目的を決めずに「一緒に時間を過ごす・遊ぶ・ブラブラする」というネイティブ最頻出の口語表現です。",
  "32-1": "「eat」ではなく「grab something to eat」と言うことで、「ガッツリ食事というより、サクッと何か食べに行きたいな」という気軽なニュアンスが出ます。",
  "32-2": "「catch up」は「会っていなかった間の近況を話し合って埋める」という意味。「飲みながら積もる話をしようよ！」と旧友や同僚を誘う最高の表現です。",
  "32-3": "「What do you want to eat?」よりもおしゃれで気遣いのある聞き方。「in the mood for ~」で「今どんな気分のもの（料理やジャンル）がいい？」と尋ねられます。",
  "33-0": "待ち合わせ相手に「今そっちに向かっている途中だよ！」と伝える超定番チャンク。メッセージでも電話でも毎日使われます。",
  "33-1": "到着までの残り時間を「in + 時間（〜後に）」でシンプルに伝える表現。「あと5分で着くよ！」と相手を安心させられます。",
  "33-2": "「How soon ~?」で「あとどれくらい（の早さ）でここに来られる？」と、相手の到着見込みを具体的に尋ねる実用フレーズです。",
  "33-3": "未来のことでも「when I get there（着いたら）」と現在形にするのがポイント。待ち合わせの最後に添える定番の一言です。",
  "34-0": "お店のスタッフや同席者に「あとからもう2人合流します」と伝える表現。「join us」を使うことで仲間に入るニュアンスが自然に出ます。",
  "34-1": "赤ちゃんが生まれた報告やペットの写真を見せてもらった時に、「男の子？女の子？」と温かく尋ねる自然な言い回しです。",
  "34-2": "オフィスやお店、待ち合わせ場所に来てくれた相手に「迷わずに来られましたか？」と声をかける、気配り上手な歓迎フレーズです。",
  "34-3": "集合写真を見ながら「右から2番目があなたです」と位置を説明する表現。序数（second）＋from right/left でスッキリ言えます。",
  "35-0": "「What did you do?」よりもこなれた「何して過ごしてたの？」。週末明けや休暇明けの雑談でネイティブがよく使う表現です。",
  "35-1": "ジムでの筋トレやエクササイズ全般を「work out」一語で表現します。休日の健康的な過ごし方を話す時の定番です。",
  "35-2": "「朝が苦手・低血圧」を「I'm not a morning person（朝型人間じゃない）」とユーモラスに表現する、ネイティブ大好きな自己紹介チャンクです。",
  "35-3": "「お酒に強い」を英語らしく「簡単には酔わない（don't get drunk easily）」と表現する型。飲み会の雑談で必ず役立ちます。",
  "36-0": "ただ「warm」と言うだけでなく「nice and warm（心地よく暖かいね）」と並べることで、天気の気持ちよさがぐっと生き生きと伝わります。",
  "36-1": "室内にいながら外の天気を気にして「まだ雨降ってる？」と周りの人に軽く尋ねる、日常の自然な一言です。",
  "36-2": "スイッチや電化製品を「つける」は「turn on」。部屋が暑い・寒い時に「エアコンをつけてもらえますか？」と丁寧にお願いする表現です。",
  "37-0": "花粉症や風邪のひき始めなどで「くしゃみが止まらない！」と状況を伝える表現。「can't stop -ing」で止まらない症状をそのまま言えます。",
  "37-1": "前に風邪をひいていた同僚や友人に「風邪はもう良くなった？」と声をかける、優しい気遣いのフレーズです。",
  "37-2": "元気がない相手に「どうしたの、すごく疲れて見えるよ？」と心配して声をかける表現。「seem（〜のように見える）」が柔らかい響きを作ります。",
  "37-3": "頑張りすぎている相手や体調が万全でない相手に「無理しすぎないでね（やりすぎないでね）」と声をかける必須の思いやり表現です。",
  "38-0": "バッテリーが切れそうな状態を「almost dead（死にかけ）」と擬人化して表現する、ネイティブが毎日使う口語フレーズです。",
  "38-1": "会話の途中で「あれ、何を言おうとしてたんだっけ」と度忘れした時に、気まずくならず自然に場を繋げる一言です。",
  "38-2": "「I'm sleepy」に「kind of」を添えることで、「なんかちょっと眠くなってきたな」と柔らかいトーンで伝えることができます。",
  "38-3": "電車に乗り遅れそうになった時やミスを間一髪で防いだ時に、「本当に危なかった！（ギリギリセーフだった）」と胸をなでおろす表現です。",
  "39-0": "どこかに向かう途中で「ちょっとコンビニに寄ったんだ」と言う時の「stop by（立ち寄る）」。日常の行動説明に欠かせない句動詞です。",
  "39-1": "会話や集まりを切り上げて「そろそろ行かなきゃ（帰らなきゃ）」と角を立てずに席を立つ、大人のスマートな退席フレーズです。",
  "39-2": "ベンチや電車の座席、テーブルなどで「少し横に詰めて（ずれて）いただけますか？」と丁寧にお願いする表現です。",
  "39-3": "混雑した場所や通路で「すみません、ちょっと通してください」と道を開けてもらう時のシンプルで自然な一言です。",
  "40-0": "別れ際やメッセージの結びで「素敵な一日を過ごしてね！」と相手の幸運を願う、明るく爽やかな定番の挨拶です。",
  "40-1": "共通の友人や家族の話題が出た後、別れ際に「彼によろしく伝えておいてね！」と気軽に伝言を頼む定番フレーズです。",
  "40-2": "仕事やミーティング、作業の区切りがついた時に「よし、今日はここまでにしよう（お開きにしよう）！」と声をかける超頻出イディオムです。",
  "41-0": "カフェや電車で空いている席を指して「ここ、座っても構いませんか？」と上品に許可を取る表現。返事は「Not at all / Go ahead」が定番です。",
  "41-1": "レジやお店の行列の最後尾にいる人に「並んでいますか？」と確認する、海外旅行や外出先で必須のひとことです。",
  "41-2": "レストランの入口で「2名ですが席は空いていますか？」と尋ねる最もスマートで自然な表現です。",
  "41-3": "満席のお店や混雑した受付で「待ち時間はどれくらいですか？」とシンプルに確認するフレーズです。",
  "42-0": "一緒に行った人が注文した後に「私も同じものをください」と店員さんに伝える、簡単で粋な注文フレーズです。",
  "42-1": "「テイクアウトにする」はアメリカ英語で「to go」。注文時にも、食べきれず包んでもらう時にもそのまま使えます。",
  "42-2": "カフェやバー、レストランで「食事はせず、飲み物だけの注文でも大丈夫ですか？」と事前に確認する丁寧な表現です。",
  "42-3": "ステーキやハンバーグを注文した際に店員さんから必ず聞かれる「焼き加減はいかがなさいますか？」。聞き取りにも必須の表現です。",
  "43-0": "注文と違う料理や商品が届いた時に、感情的にならず「すみません、これは私が頼んだものではありません」と冷静に伝えるフレーズです。",
  "43-1": "メニューを見てどんな食材やソースが使われているか気になった時に「これは何で作られているんですか？」と尋ねる表現です。",
  "43-2": "海外のレストランなどで予想以上の特大サイズが出てきた時に「思っていたよりずっと大きい！」と驚きを伝える自然な一言です。",
  "44-0": "会計時に「レシートをいただけますか？」と丁寧にお願いする定番フレーズ。「Could I have ~?」で品よく伝わります。",
  "44-1": "正確な金額ではなく「だいたいいくらくらいですか？」と概算を尋ねたい時に、文頭に「About」を置くだけで自然に聞けます。",
  "44-2": "割り勘やセット料金の説明を受けた時に「つまり1人あたり1,000円ということですか？」と誤解がないよう確認する表現です。",
  "44-3": "コンビニやスーパーのレジで必ず聞かれる「レジ袋はご利用ですか？」。旅行先でのリスニングでも頻出します。",
  "45-0": "「ここは私が出すよ（ご馳走するよ）」とスマートにおごる時の定番表現。「It's on me.」と並んでよく使われます。",
  "45-1": "外食の提案に対して「どちらかというと家で食べたいな」と、相手の提案を否定せず自分の希望を柔らかく伝える表現です。",
  "45-2": "「I don't like it（嫌いだ）」と直接言うのを避け、「あまり得意じゃないんだ／ちょっと好みじゃなくて」と上品に伝える大人の表現です。",
  "46-0": "靴や服を試着する際、「サイズ＋in＋色」の順で「黒の11サイズはありますか？」と店員さんに在庫を尋ねる鉄板パターンです。",
  "46-1": "見せてもらった商品以外にも選択肢があるか、「他にはどんなものがありますか？」と尋ねるシンプルで便利な質問です。",
  "46-2": "マーケットやまとめ買いの場面で「少し値引きしてもらえませんか？」と礼儀正しく交渉してみるフレーズです。",
  "47-0": "現在地から目的地まで「ここからどれくらいの距離ですか？」と尋ねる道案内の基本フレーズです。",
  "47-1": "「Why did you come to Tokyo?」よりも圧倒的に自然で好印象な「どういうきっかけ（目的）で東京にいらしたんですか？」という定番表現です。",
  "47-2": "ホテルやレストランに連絡して「予約をキャンセルしたいのですが」と丁寧に申し出る実用フレーズです。",
  "48-0": "服や髪型、アクセサリーなどが「あなたにすごく似合っているね！」と人を褒める時に最も自然で喜ばれる表現です。",
  "48-1": "褒められた時に単なる「Thank you」から一歩進んで、「お褒めいただき光栄です（嬉しいです）」とスマートに返す大人の表現です。",
  "48-2": "おすすめのお店やプレゼント、映画などを紹介する時に「きっと気に入ると思うよ！」と太鼓判を押すポジティブな一言です。",
  "49-0": "出発や会議開始、終了時刻が近づいた時に「そろそろ時間だよ」と周りに声をかけるシンプルで万能な合図です。",
  "49-1": "待たせている相手に「もうすぐ終わるからね（あと少しで片付くよ）」と進捗を伝えて安心させる一言です。",
  "49-2": "マッサージや整体、診察などで「うつ伏せになってください」と案内される（または案内する）時の定型表現です。",
  "50-0": "オフィスや店舗で相手に「何かお手伝いできることはありますか？／ご用件は何でしょうか？」と親切に声をかける表現です。",
  "50-1": "お礼を言われた時や協力を申し出る時に「喜んでお手伝いしますよ／お役に立てて嬉しいです」と温かく返すフレーズです。",
  "50-2": "会議やチーム作業で「誰かやってくれる人（立候補する人）はいませんか？」と明るく募る定番の一言です。",
  "51-0": "自分が途中まで進めた作業を同僚に託す時に「ここから先を引き継いでもらえる？」とバトンタッチを頼む自然なビジネス表現です。",
  "51-1": "「Help me」よりもずっとこなれていて角が立たない「ちょっと手を貸してもらえるとありがたいな」という絶妙な依頼表現です。",
  "51-2": "相手の申し出や提案に対して「そうしていただけると大変助かります」と、ビジネスで品よく感謝を伝える必須フレーズです。",
  "51-3": "自分の担当外や分からないことを聞かれた際に「恐れ入りますが他の人に聞いてみてください」と案内する表現です。",
  "52-0": "「急な用事（トラブル）が降って湧いた」を「Something came up」の3語でスマートに伝える、予定変更時の鉄板フレーズです。",
  "52-1": "「tied up（縛られている）」というイメージから、「今ちょっと別の仕事で手が離せないんだ」と忙しさをリアルに伝える口語表現です。",
  "52-2": "お皿（plate）の上に料理が山盛りになっているイメージで、「今抱えている仕事や課題が山積みなんだ」と伝える頻出イディオムです。",
  "52-3": "交通遅延や前の予定の兼ね合いで「今日は少し遅れるかもしれません」と事前に一報を入れるフレーズです。",
  "53-0": "ミーティングや食事の日程を決める際、「いつがご都合よろしいですか？」と相手の予定を最優先で尋ねる基本表現です。",
  "53-1": "「明後日（the day after tomorrow）はどう？」と具体的な候補日をテンポよく提案するフレーズです。",
  "53-2": "「今日は6時に仕事が終わる予定なんだ」と、自分の退勤・終了見込みを伝えて待ち合わせ時間を調整する表現です。",
  "54-0": "今すぐ電話に出られない、または調べてから話したい時に「後ほどかけ直してもらえますか？」とお願いする電話表現です。",
  "54-1": "知らない番号から別宛ての電話がかかってきた時に「おかけ間違いではないでしょうか」と丁寧に伝える決まり文句です。",
  "54-2": "夜遅くや朝早くに電話・連絡した際、「もしかして起こしちゃった？（起こしてないよね？）」と相手を気遣う一言です。",
  "55-0": "契約書や受付票、宅配の受け取りなどで「こちらにサインをいただけますか？」と丁寧にお願いする表現です。",
  "55-1": "議論の途中でいきなり割り込むのではなく、「少し私の意見を言わせてもらってもいいですか？」とスマートに前置きする表現です。",
  "55-2": "質問に対して一通り説明した後に、「これでご質問の答えになっていますでしょうか？」と相手の納得度を確認するプロフェッショナルな一言です。",
  "56-0": "その場で即決せず「少し考えさせてください（検討させてください）」と一旦持ち帰る時の、最も自然で角が立たない表現です。",
  "56-1": "確約はできないけれど「自分に何ができるか動いてみるよ（善処します）」と誠実な対応を約束する、ビジネス超頻出フレーズです。",
  "56-2": "周囲から心配された時に「大丈夫、自分で何とかやりくりできるよ（対処できます）」と頼もしく答える表現です。",
  "56-3": "「give it a go（または give it a try）」で「うまくいくか分からないけど、とにかく一度やってみるよ！」と軽やかに挑戦する表現です。",
  "57-0": "要望に応えられない時に「お役に立てず申し訳ありません」と、礼儀正しくかつ誠意を持ってお詫びする大人の定型表現です。",
  "57-1": "作業中の同僚に話しかける時や質問を切り出す時に、「お忙しいところ（お邪魔して）すみません」と添える必須のクッション言葉です。",
  "57-2": "ミスや行き違いが起きた際に「たぶん私の落ち度（せい）だと思います」と素直に非を認める表現です。",
  "57-3": "手持ちの情報を伝えた上で「私が把握しているのはこれで全部です」と、それ以上は分からないことを明確に伝える表現です。",
  "58-0": "話が長くなっている相手に「要するに何が言いたいの？（結論は何？）」と論点をストレートに確認する口語表現です。",
  "58-1": "相手の発言の意図や言葉の意味が分からなかった時に「それってどういう意味？」と率直に聞き返す基本表現です。",
  "58-2": "相手の言葉が聞き取れなかった時や、耳を疑うようなことを言われた時に「えっ、今なんて言った？」とカジュアルに聞き返す相槌です。",
  "58-3": "自分の要望や条件を伝えた後に「私、ちょっと求めすぎかな？（無理を言ってるかな？）」と相手の反応を伺う表現です。",
  "59-0": "急がなくていい作業や決断について、「必要なだけいくらでも時間をかけて大丈夫だよ」と相手を安心させる懐の深い表現です。",
  "59-1": "頑張りすぎている人に「自分を追い詰めてまで無理しなくていいんだよ（push yourself しなくていいよ）」と優しく声をかける表現です。",
  "60-0": "落ち込んでいる人や苦労している人に「その気持ち、痛いほどよく分かるよ」と深く共感を示す定番フレーズです。",
  "60-1": "「あなたと一緒にいる＝あなたの意見に大賛成だよ／いつも味方だよ」と、心強い連帯感と支持を伝える短い名フレーズです。",
  "60-2": "相手の説明や主張に対して「なるほど、あなたの言わんとすることはよく分かります」と理解を示す知的な相槌です。",
  "60-3": "「root for ~」はスポーツチームや挑戦する人を「全力で応援する」という意味。「いつも応援してるよ！」と背中を押す温かい表現です。",
  "61-0": "相手の体調不良やトラブル、残念なニュースを聞いた時に「それはお気の毒に／大変でしたね」と瞬時に寄り添う最重要の相槌です。",
  "61-1": "大切な人を亡くされた方に対して「心よりお悔やみ申し上げます（ご愁傷様です）」と深く哀悼の意を伝える定型表現です。",
  "61-2": "浮かない顔をしている友人や同僚に「何か気になること（悩み）でもあるの？」と優しく話を聞くフレーズです。",
  "61-3": "悲しい出来事や理不尽な話を聞いて「それを聞くと私まで悲しくなるよ」と素直な感情で共感を表す一言です。",
  "62-0": "ミスをして落ち込んでいる人や謝っている人に「心配しないで、全然大丈夫だから！」と明るく安心させる一言です。",
  "62-1": "うっかりミスや誰にでも起こりうるトラブルに対して、「よくあることだよ、気にしないで」とフォローする優しい表現です。",
  "62-2": "新しい仕事やツールに戸惑っている人に「最初は難しく見えるけど、一度慣れちゃえば簡単だよ！」と励ます実用フレーズです。",
  "62-3": "新しい環境や生活リズムに対して「もうすっかり慣れました」と順応したことを伝える表現です。",
  "63-0": "迷っている相手に「ダメ元で思い切ってチャンスに賭けてみたら？」と前向きに背中を押す表現です。",
  "63-1": "「やってみなければ結果は誰にも分からないよ！」と、行動する前の不安を吹き飛ばすネイティブ定番の励まし文句です。",
  "63-2": "ボクシングでタオルを投げ入れる比喩（throw in the towel＝降参する）を使い、「諦めるにはまだ早すぎるよ！」と奮い立たせる表現です。",
  "63-3": "うまくいかなかった相手に「もう一回だけやってみる？」と再挑戦を優しく促すフレーズです。",
  "64-0": "「直訳：それは私にとってニュースだ」から、「えっ、それは初耳だよ！（全然知らなかった）」と驚きを伝える超頻出イディオムです。",
  "64-1": "予想外の事実や結果を聞いて「へえ、それは意外だね（驚いたな）」とリアクションする自然な一言です。",
  "64-2": "にわかには信じがたい噂や話を聞いて「まさか、それが本当のはずがないよ（嘘でしょ！）」と強い疑念を表す表現です。",
  "64-3": "まだ話していないことや秘密にしていたことを相手が知っていた時に「えっ、なんでそれを知ってるの！？」と驚くフレーズです。",
  "65-0": "「make up one's mind（心を決める）」の否定形で、選択肢の間で揺れて「どうしても決められない・迷っちゃう」を表す定番表現です。",
  "65-1": "「最終的な決定権はあなたにあるよ＝あなた次第だよ・お任せするよ」と相手に選択を委ねる超頻出チャンクです。",
  "65-2": "明確な根拠や証拠はないけれど「なんとなくそんな気がするんだ（直感だけどね）」と伝える口語表現です。",
  "65-3": "映画のセリフでも有名な「なんだか嫌な予感がするぞ…」。トラブルの予兆を感じた時にそのまま使える定番フレーズです。",
  "66-0": "誘いや提案に対して「I don't want to」と角を立てずに、「やめておきます／遠慮しておきます」と品よく断る最短フレーズです。",
  "66-1": "無責任に「簡単だよ」と言う相手に対して、「口で言うのは簡単だよね（当事者じゃないから言えるんだよ）」と釘を刺すリアルな一言です。",
  "66-2": "相手が一緒にしようとしている事柄に対して、「いや、それとこれとは全然話が別だよ」と明確に違いを主張する表現です。",
  "66-3": "考えすぎや心配しすぎな相手に「それは気のせいだよ（思い過ごしだよ）」と落ち着かせる表現です。",
  "67-0": "プレゼントや手料理、自分の成果物を見せる前に「あんまり期待しすぎないでね！」とハードルを下げておく茶目っ気のある前置きです。",
  "67-1": "少し複雑な気持ちや抽象的な説明をした後に、「…って言ってる意味伝わるかな？」と相手の理解を優しく確認するネイティブの口癖です。",
  "67-2": "「聞いたらショックを受ける（または気持ち悪い）から、知らない方が身のためだよ」と冗談めかして返す決まり文句です。",
  "67-3": "反論されそうな大胆な提案をする時に「まあ遮らずに、まずは最後まで私の話を聞いてよ！」と耳を傾けてもらう表現です。",
  "68-0": "遊園地や懐かしい遊びに夢中になった時に「なんだか子供に戻ったみたいな気分だよ！」と無邪気な楽しさを伝える表現です。",
  "68-1": "写真や音楽、場所などが「懐かしい思い出を蘇らせてくれる（brings back memories）」とノスタルジックな気持ちを語る名表現です。",
  "68-2": "相手の話のキーワードから別の用件やエピソードが頭に浮かんだ時に、「あ、それで思い出したんだけど！」と話題をつなぐ必須フレーズです。",
  "68-3": "失敗した後に「こうなるって分かっておくべきだったのに（自分が浅はかだったな）」と自戒を込めて振り返る大人の後悔表現です。",
  "69-0": "相手から優しい言葉や褒め言葉をもらった時に、「そんなふうに言っていただけて本当に嬉しいです」と感謝を伝える上品な返しです。",
  "69-1": "相手の提案や「〜だといいね」という話に対して、「ほんと、そうなるといいね（そうしてもらえると嬉しいな）」と穏やかに同調する表現です。",
  "69-2": "面接やプレゼン、デートやイベントが終わった友人に「で、どうだった？（うまくいった？）」と結果を尋ねる定番の質問です。",
  "69-3": "「絶対やる」とは約束せず、「まあ気が向いたら（気分が乗ったら）やるよ」とマイペースに答えるカジュアルな表現です。",
  "70-0": "あまりの驚きや感動、あるいはショックで「何と言っていいか言葉が見つかりません」と率直な戸惑いを伝える表現です。",
  "70-1": "「I don't know（知りません）」よりもずっと柔らかく、「うーん、どうだろう、ちょっと確信が持てないな」と曖昧さを伝える便利な返答です。",
  "70-2": "アドバイスをくれた相手に「もしあなたが私の立場なら、本当にそうする？」と一歩踏み込んで問いかける表現です。",
  "70-3": "「Why ~?」よりも詰問調にならず、「どういう経緯で・なんでそう思うようになったの？」と純粋な興味で理由を尋ねる口語表現です。",
  "70-4": "「angry」よりも広く「動揺している・機嫌が悪い・悲しんでいる」状態を指す「upset」を使い、「どうしてそんなに落ち込んで（怒って）いるの？」と気遣う表現です。"
};

// ==========================================
// 💬 代表的な自然な別解・言い換え辞書 (v35)
// ==========================================
window.CARD_ALTERNATIVES = {
  // Part 1
  "1-0": ["I would say 80% of the time I work from home.", "About 80% of the time, I work from home.", "I'd say about 80% of the time I'm working remotely."],
  "1-1": ["I'd say he's about 30.", "I would say he's around 30.", "I guess he is around 30."],
  "1-2": ["It's about a 10-minute walk to the station.", "I'd say it takes about 10 minutes to walk to the station.", "I would say it's roughly a 10-minute walk."],
  "1-3": ["I'd give this movie a 7 out of 10.", "I would say this movie is a 7 out of 10."],
  "2-0": ["That depends on how much time we have.", "It depends on how much time is left."],
  "2-1": ["That depends on the weather.", "It all depends on the weather."],
  "2-2": ["That depends on the price.", "It depends on how much it costs."],
  "2-3": ["That depends on who's coming.", "It depends on who will be there."],
  "3-0": ["We talked about things like music and movies.", "We discussed music, movies and stuff like that."],
  "3-1": ["On weekends I do chores like cleaning and laundry.", "I usually do cleaning, laundry and things like that on weekends."],
  "3-2": ["She's really into yoga and stuff like that.", "She loves yoga and things like that."],
  "3-3": ["I have to buy pens, notebooks and stuff like that.", "I need to get pens, notebooks and things like that."],
  "4-0": ["Just because he is rich doesn't mean he is happy.", "Being rich doesn't necessarily mean he's happy."],
  "4-1": ["Just because it's expensive doesn't mean it is good.", "Expensive doesn't always mean good."],
  "4-2": ["Just because I'm Japanese doesn't mean I like sushi.", "Being Japanese doesn't mean I love sushi."],
  "4-3": ["Just because he is smiling doesn't mean he isn't angry.", "He might be smiling, but that doesn't mean he's not mad."],
  "5-0": ["The most expensive option isn't necessarily the best.", "The most expensive one is not always the best."],
  "5-1": ["Not necessarily so.", "That's not necessarily true."],
  "5-2": ["Faster is not necessarily better.", "Faster doesn't necessarily mean better."],
  "5-3": ["Famous restaurants are not necessarily good.", "Being famous doesn't mean a restaurant is delicious."]
};

// ==========================================
// 🥊 シチュエーション即答ラリー (v41)
// 相手からの問いかけに対して、3秒以内に適切な型を想起・口頭返答する実戦特訓
// ==========================================

// ==========================================
// 🥊 シチュエーション即答ラリー テーマ定義
// ==========================================
window.RALLY_THEMES = [
  { id: "all", name: "全シチュエーション（ランダム10問）", icon: "🔥", desc: "日常・ビジネス・旅行など全場面から総合ランダム出題", badge: "総合10問" },
  { id: "daily", name: "日常・同僚との雑談・ランチ", icon: "☕️", desc: "週末の予定、天気、朝の習慣、趣味など同僚や友人とのフランクな会話", badge: "7問" },
  { id: "business", name: "ビジネス・会議・進捗と依頼", icon: "💼", desc: "会議の進行、率直な意見、進捗確認、スライドの確認依頼、迅速な対応", badge: "6問" },
  { id: "social", name: "お誘い・合流・大人の断り方", icon: "🍺", desc: "合流の連絡、飲み会、やんわり断る大人のマナー、お開きの一言", badge: "6問" },
  { id: "travel", name: "カフェ・レストラン・旅行・街中", icon: "✈️", desc: "カフェの注文、席の確認、持ち帰り、お会計、距離や道案内", badge: "6問" },
  { id: "empathy", name: "共感・励まし・とっさのフォロー", icon: "💬", desc: "ミスした仲間への励まし、共感、感謝、前向きな切り返し", badge: "6問" },
  { id: "first_meet", name: "初対面・挨拶・アイスブレイク", icon: "🤝", desc: "初めての挨拶、名前の呼び方、自己紹介、褒め言葉、スマートな会話の始め方", badge: "6問" }
];

window.RALLY_PRESETS = [
  {
    id: "rally-1",
    isRally: true, theme: "daily",
    category: "週末・予定",
    partner: {
      name: "Alex",
      avatar: "🧑‍💻",
      context: "同僚からの休日の誘い",
      en: "Hey, are you free this Saturday? We're thinking of grabbing lunch!",
      ja: "ねえ、今週の土曜空いてる？ランチ行こうって話してるんだけど！"
    },
    mission: {
      prompt: "「大体80%の確率で空いてるかな」と答えて！",
      hint: "ざっくり見積もって保険をかける型（Part 1）を使おう",
      targetPatternId: 1
    },
    en: "I'd say there's an 80% chance I'm free.",
    ja: "大体80%くらいの確率で空いてるかな。",
    replyTips: "I'd say ~ を使うことで「絶対行ける」と断定せず、大人のやんわりした見通しを伝えられます。",
    alternatives: ["I'd say I should be free around noon.", "I'd say yes, but let me double check my schedule."]
  },
  {
    id: "rally-2",
    isRally: true, theme: "daily",
    category: "アウトドア・計画",
    partner: {
      name: "Chloe",
      avatar: "👩‍🎨",
      context: "週末のキャンプの相談",
      en: "Do you think we should go camping by the lake this weekend?",
      ja: "今週末、湖の近くにキャンプに行くべきだと思う？"
    },
    mission: {
      prompt: "「天気によるかな」と答えて！",
      hint: "条件次第であることを示す型（Part 1）を使おう",
      targetPatternId: 2
    },
    en: "It depends on the weather.",
    ja: "天気によるかな。",
    replyTips: "It depends on ~ は条件で変わる時の最頻出フレーズ。短くスマートに即答できます。",
    alternatives: ["It depends on the forecast.", "That depends on how bad the rain is."]
  },
  {
    id: "rally-3",
    isRally: true, theme: "daily",
    category: "雑談・休日",
    partner: {
      name: "Marcus",
      avatar: "🧔",
      context: "月曜の朝、週末の過ごし方を聞かれて",
      en: "How was your weekend? Did you do anything special?",
      ja: "週末どうだった？何か特別なことした？"
    },
    mission: {
      prompt: "「掃除とか洗濯とか、そんな感じのことをしたよ」と答えて！",
      hint: "例をぼかして会話を滑らかにする型（Part 1）を使おう",
      targetPatternId: 3
    },
    en: "I just did cleaning, laundry and stuff like that.",
    ja: "掃除とか洗濯とか、そんな感じのことをしたよ。",
    replyTips: "~ and stuff like that を添えることで、「〜など日常のあれこれ」と自然にまとめられます。",
    alternatives: ["I mostly did housework, laundry and stuff like that.", "Just relaxing, watching movies and stuff like that."]
  },
  {
    id: "rally-4",
    isRally: true, theme: "social",
    category: "相談・買い物",
    partner: {
      name: "Daniel",
      avatar: "🧑‍💼",
      context: "新しい高価なノートPCを買うべきか悩む同僚",
      en: "This laptop is twice as expensive as the other one. Should I just buy it?",
      ja: "このノートPC、もう一方の倍の値段するんだよね。思い切って買うべきかな？"
    },
    mission: {
      prompt: "「高いからって良いとは限らないよ」と答えて！",
      hint: "一面的な思い込みを否定する型（Part 2）を使おう",
      targetPatternId: 4
    },
    en: "Just because it's expensive doesn't mean it's good.",
    ja: "高いからって良いとは限らないよ。",
    replyTips: "Just because A doesn't mean B は、短絡的な判断に冷静な視点を与えるスマートな大人の構文です。",
    alternatives: ["Just because it costs more doesn't mean it's better.", "Expensive doesn't necessarily mean it's the right fit."]
  },
  {
    id: "rally-5",
    isRally: true, theme: "social",
    category: "意見・議論",
    partner: {
      name: "Sophia",
      avatar: "👩‍💼",
      context: "英語学習についての雑談",
      en: "You have to live in an English-speaking country to become fluent, right?",
      ja: "ペラペラになるには英語圏の国に住まなきゃダメだよね？"
    },
    mission: {
      prompt: "「必ずしもそうとは限らないよ」とマイルドに反論して！",
      hint: "大人の含みを持たせて反論する型（Part 2）を使おう",
      targetPatternId: 5
    },
    en: "Not necessarily.",
    ja: "必ずしもそうとは限らないよ。",
    replyTips: "Not necessarily は相手を全否定せず「必ずしも100%そうとは言えないよ」と知的かつ角を立てずに返せる一言です。",
    alternatives: ["That's not necessarily true.", "Not necessarily, you can practice a lot online these days."]
  },
  {
    id: "rally-6",
    isRally: true, theme: "first_meet",
    category: "自己紹介・体質",
    partner: {
      name: "Ken",
      avatar: "👨‍💻",
      context: "朝7時半からのブレスト会議に誘われて",
      en: "Can we schedule our strategy brainstorm for 7:30 tomorrow morning?",
      ja: "明日の朝7時半から戦略ブレストのミーティング入れてもいい？"
    },
    mission: {
      prompt: "「私は朝のほうが頭が働くタイプなんだ（大歓迎）」と答えて！",
      hint: "自分の特性やタイプを表現する型（Part 3）を使おう",
      targetPatternId: 6
    },
    en: "Sounds great! I have a brain that works best in the morning.",
    ja: "いいね！私は朝のほうが頭が働くタイプなんだ。",
    replyTips: "I have a ~ brain / body は「そういう体質・性質なんだ」とユーモアを交えて自己開示するのに最適です。",
    alternatives: ["That works! I'm definitely a morning person.", "Perfect, I have a morning brain."]
  },
  {
    id: "rally-7",
    isRally: true, theme: "first_meet",
    category: "体験談・リアクション",
    partner: {
      name: "Emma",
      avatar: "👱‍♀️",
      context: "昨夜の電車の突然の運転見合わせについて",
      en: "I heard the train stopped right in the middle of the bridge last night! How did you react?",
      ja: "昨日の夜、電車が橋のど真ん中で止まったんだってね！どういう反応になった？"
    },
    mission: {
      prompt: "「『え、マジで？』って感じだったよ」と当時のリアルな感情を伝えて！",
      hint: "当時のトーンや心の声をそのまま再現する型（Part 3）を使おう",
      targetPatternId: 7
    },
    en: "I was like, \"Seriously?\"",
    ja: "「え、マジで？」って感じだったよ。",
    replyTips: "I was like, \"...\" は会話を生き生きとさせるネイティブの最頻出リアル会話テクニックです。",
    alternatives: ["I was like, \"You've got to be kidding me!\"", "I was just like, \"What are we supposed to do now?\""]
  },
  {
    id: "rally-8",
    isRally: true, theme: "daily",
    category: "オフィス・習慣",
    partner: {
      name: "Liam",
      avatar: "👨‍🦰",
      context: "朝イチのミーティング前、マグカップを手にしたあなたに",
      en: "You always carry that giant mug around every morning, don't you?",
      ja: "毎朝いつもその特大マグカップ持ち歩いてるよね？"
    },
    mission: {
      prompt: "「朝のコーヒーがないと体が動かないんだ（無理なんだ）」と答えて！",
      hint: "何かないと機能しないことを伝える型（Part 3）を使おう",
      targetPatternId: 8
    },
    en: "Yeah, I can't function without my morning coffee.",
    ja: "うん、朝のコーヒーがないと無理なんだ。",
    replyTips: "I can't function without ~ は「これがないと使い物にならない」とクスッと笑える親しみやすい返答です。",
    alternatives: ["I honestly can't function without caffeine.", "My brain simply can't function without it."]
  },
  {
    id: "rally-9",
    isRally: true, theme: "daily",
    category: "ランチ・健康",
    partner: {
      name: "David",
      avatar: "🧑‍🦱",
      context: "こってり豚骨ラーメンに誘われて",
      en: "Hey, do you want to grab heavy tonkotsu ramen with extra garlic?",
      ja: "ねえ、ニンニクマシマシのこってり豚骨ラーメン食べに行かない？"
    },
    mission: {
      prompt: "「昔はよく食べてたけど、今は健康のために控えてるんだ」とやんわり断って！",
      hint: "過去の習慣と今の変化を対比する型（Part 3）を使おう",
      targetPatternId: 9
    },
    en: "I used to eat it all the time, but now I try to watch my health.",
    ja: "昔はよく食べてたけど、今は健康に気をつけて控えてるんだ。",
    replyTips: "I used to ~, but now ~ を使うと、相手の好みを否定せず「昔は自分も好きだったよ」と共感を残して断れます。",
    alternatives: ["I used to love it, but now my stomach can't handle it.", "I used to eat that a lot, but now I'm eating healthier."]
  },
  {
    id: "rally-10",
    isRally: true, theme: "business",
    category: "ビジネス・率直な意見",
    partner: {
      name: "Rachel",
      avatar: "👩‍💼",
      context: "提出前のプロモーション企画書を見せられて",
      en: "Be completely frank with me. What do you think of this marketing plan?",
      ja: "包み隠さず言って。このマーケティングプラン、どう思う？"
    },
    mission: {
      prompt: "「正直言うと、ちょっと予算オーバーだと思う」と誠実に答えて！",
      hint: "言いにくい本音を切り出すクッション型を使おう",
      targetPatternId: 10
    },
    en: "To be honest, I think it's a bit over budget.",
    ja: "正直言うと、ちょっと予算オーバーだと思う。",
    replyTips: "To be honest, ~ は相手の求めに応じて信頼感のあるフィードバックを返す時の黄金フレーズです。",
    alternatives: ["To be honest, it looks a little too expensive.", "Honestly, I think we might exceed the budget."]
  },
  {
    id: "rally-11",
    isRally: true, theme: "business",
    category: "業務確認・情報共有",
    partner: {
      name: "Kevin",
      avatar: "👨‍💻",
      context: "今日の全体会議の出席者について",
      en: "Is the project manager joining today's sprint review?",
      ja: "プロジェクトマネージャーは今日のスプリントレビューに参加する？"
    },
    mission: {
      prompt: "「私の知る限りでは、彼は来るはずだよ」と答えて！",
      hint: "自分の把握している範囲に限定して責任を限定する型を使おう",
      targetPatternId: 11
    },
    en: "As far as I know, he's supposed to join.",
    ja: "私の知る限りでは、彼は来るはずだよ。",
    replyTips: "As far as I know, ~ は「自分の把握している範囲では」という安全な防波堤を作れるビジネス必須の表現です。",
    alternatives: ["As far as I know, yes, he'll be there.", "As far as I'm aware, he has it on his calendar."]
  },
  {
    id: "rally-12",
    isRally: true, theme: "empathy",
    category: "気遣い・納得",
    partner: {
      name: "Jessica",
      avatar: "👩‍🦰",
      context: "同僚のMarkが今日ひどく疲れた顔をしている理由を聞いて",
      en: "Did you hear? Mark stayed up until 4 AM to fix that production bug.",
      ja: "聞いた？Mark、本番のバグ修正で朝の4時まで起きてたらしいよ。"
    },
    mission: {
      prompt: "「どうりでひどく疲れた顔をしてるわけだ」と納得を返して！",
      hint: "理由を知って深く納得する型を使おう",
      targetPatternId: 12
    },
    en: "No wonder he looks so exhausted today.",
    ja: "どうりで今日あんなに疲れた顔をしてるわけだ。",
    replyTips: "No wonder ~ は「なるほど、合点がいった！」という共感を瞬時に相手と共有できる感情豊かな構文です。",
    alternatives: ["No wonder he's drinking so much coffee.", "No wonder he seems a bit quiet today."]
  },
  {
    id: "rally-13",
    isRally: true, theme: "daily",
    category: "日常・選択",
    partner: {
      name: "Tom",
      avatar: "🧑‍🍳",
      context: "フードコートでメニューを見ながら",
      en: "Have you decided what you're ordering yet?",
      ja: "何を注文するかもう決まった？"
    },
    mission: {
      prompt: "「パスタにするかピザにするかで迷ってるんだ」と答えて！",
      hint: "2つの選択肢の間で心が揺れている型を使おう",
      targetPatternId: 13
    },
    en: "I'm torn between the pasta and the pizza.",
    ja: "パスタにするかピザにするかで迷ってるんだ。",
    replyTips: "I'm torn between A and B は「どちらも魅力的で引き裂かれそうなくらい迷う」というネイティブの定番表現です。",
    alternatives: ["I'm still torn between the two options.", "I'm torn between getting sushi or curry."]
  },
  {
    id: "rally-14",
    isRally: true, theme: "business",
    category: "ビジネス・合意",
    partner: {
      name: "Brian",
      avatar: "👨‍💼",
      context: "厳しい納期のプロジェクト方針について",
      en: "We need to hit this Friday deadline no matter what, right?",
      ja: "何が何でも今週金曜の締め切りに間に合わせなきゃいけないよね？"
    },
    mission: {
      prompt: "「言うまでもなく、クオリティも落とせないよ」と付け加えて！",
      hint: "当然の前提として釘を刺す型を使おう",
      targetPatternId: 14
    },
    en: "It goes without saying that quality is just as important.",
    ja: "言うまでもなく、クオリティも同じくらい大切だよ。",
    replyTips: "It goes without saying that ~ は議論の中で「言うまでもない前提」をスマートに提示する知的なフレーズです。",
    alternatives: ["It goes without saying that we can't compromise on quality.", "Needless to say, we still need high standards."]
  },
  {
    id: "rally-15",
    isRally: true, theme: "daily",
    category: "オフィス・雑談",
    partner: {
      name: "Hannah",
      avatar: "👱‍♀️",
      context: "先週の京都への出張の話題が出た瞬間",
      en: "Kyoto was quite crowded with tourists last week, wasn't it?",
      ja: "先週の京都は観光客でかなり混んでたでしょ？"
    },
    mission: {
      prompt: "「そう言えば、チームにお土産買ってきたんだ！」と話題を繋げて！",
      hint: "話のきっかけを掴んでスムーズに展開する型を使おう",
      targetPatternId: 15
    },
    en: "Speaking of which, I brought some sweets for the team!",
    ja: "そう言えば、チームにお土産（お菓子）を買ってきたんだ！",
    replyTips: "Speaking of which, ~ は前の発言に関連した話題をサラッと切り出す潤滑油のような接続表現です。",
    alternatives: ["Speaking of which, here are some souvenirs.", "Speaking of Kyoto, I actually bought something for everyone."]
  },
  {
    id: "rally-16",
    isRally: true, theme: "business",
    category: "ビジネス・丁寧な依頼",
    partner: {
      name: "Oliver",
      avatar: "🧑‍💻",
      context: "忙しそうなシニアエンジニアのデスクに立ち寄り",
      en: "Hey! Did you need something from me?",
      ja: "やあ！僕に何か用事でもあった？"
    },
    mission: {
      prompt: "「このスライドをレビューしていただけないかと思いまして」と丁寧に切り出して！",
      hint: "相手への配慮を込めた最も丁寧な依頼型を使おう",
      targetPatternId: 16
    },
    en: "I was wondering if you could take a quick look at these slides.",
    ja: "このスライドをさっと見ていただけないかと思いまして。",
    replyTips: "I was wondering if you could ~ は「〜していただけたら嬉しいなと思っていたのですが」という角の立たない最高峰の依頼表現です。",
    alternatives: ["I was wondering if you had a few minutes to check this.", "I was wondering if you could review my proposal."]
  },
  {
    id: "rally-17",
    isRally: true, theme: "travel",
    category: "カフェ・社交",
    partner: {
      name: "Lisa",
      avatar: "👩‍💼",
      context: "混雑したカフェのテーブルで同席者に",
      en: "Excuse me, are you about to sit here?",
      ja: "すみません、ここに座られるところですか？"
    },
    mission: {
      prompt: "「こちらの席をお借りしてもよろしいですか？」と上品に尋ねて！",
      hint: "相手に嫌悪感がないか気遣う丁寧な許可求め型を使おう",
      targetPatternId: 17
    },
    en: "Would you mind if I took this chair?",
    ja: "こちらの席をお借りしてもよろしいでしょうか？",
    replyTips: "Would you mind if I [過去形] ~ ? は大人の洗練された気配り英語の決定版です。",
    alternatives: ["Would you mind if I shared this table?", "Do you mind if I sit here?"]
  },
  {
    id: "rally-18",
    isRally: true, theme: "business",
    category: "会議・進行",
    partner: {
      name: "Sam",
      avatar: "👨‍🏫",
      context: "議論が白熱して終了予定時間を過ぎそうな時",
      en: "We still have a couple more minor points to debate...",
      ja: "まだ議論すべき細かい点がいくつか残っていますが…"
    },
    mission: {
      prompt: "「時間ですので、そろそろ今日の会議を終わりにしましょう」と仕切って！",
      hint: "テキパキと会を締めくくる型を使おう",
      targetPatternId: 18
    },
    en: "Let's wrap it up for today and follow up on Slack.",
    ja: "今日はそろそろ終わりにして、Slackでフォローアップしましょう。",
    replyTips: "Let's wrap it up はダラダラ伸びがちな会議を気持ちよく終わらせるビジネスの必須フレーズです。",
    alternatives: ["Let's wrap up our meeting here.", "Why don't we wrap it up and continue tomorrow?"]
  },
  {
    id: "rally-19",
    isRally: true, theme: "business",
    category: "ビジネス・即答",
    partner: {
      name: "Boss (Sarah)",
      avatar: "👩‍💼",
      context: "急ぎのクライアント提出用データの修正を頼まれて",
      en: "We need this presentation updated with the latest revenue numbers ASAP!",
      ja: "至急、このプレゼン資料を最新の売上データに更新してほしいんだけど！"
    },
    mission: {
      prompt: "「すぐ取り掛かります！（お任せください）」と頼もしく即答して！",
      hint: "電光石火で任せて安心感を与える型を使おう",
      targetPatternId: 19
    },
    en: "I'm on it!",
    ja: "すぐ取り掛かります！",
    replyTips: "I'm on it! は3語で「了解、今まさに手をつけています」と圧倒的なスピード感と安心感を相手に与えます。",
    alternatives: ["I'm on it right away.", "Consider it done, I'm on it."]
  },
  {
    id: "rally-20",
    isRally: true, theme: "empathy",
    category: "共感・励まし",
    partner: {
      name: "Toby",
      avatar: "👦",
      context: "プレゼンで小さな言い間違いをして落ち込む後輩",
      en: "I totally stumbled on slide 4... I ruined the entire pitch.",
      ja: "スライド4で完全に噛んじゃいました…僕のせいで提案が台無しです。"
    },
    mission: {
      prompt: "「そんなに自分を責めないで、誰も気にしてないよ」と温かく励まして！",
      hint: "自責の念を優しく解きほぐす型を使おう",
      targetPatternId: 20
    },
    en: "Don't be so hard on yourself. Nobody noticed!",
    ja: "そんなに自分を責めないで。誰も気にしてないよ！",
    replyTips: "Don't be so hard on yourself は落ち込む同僚や友人の心を救う、包容力にあふれた名フレーズです。",
    alternatives: ["Don't beat yourself up over it.", "Take it easy on yourself, you did great."]
  },
  {
    id: "rally-21",
    isRally: true, theme: "empathy",
    category: "前向き・レジリエンス",
    partner: {
      name: "Grace",
      avatar: "👩‍🔬",
      context: "大事なコンペで惜しくも次点に終わり、落胆するチームメイト",
      en: "We put three months into this proposal, and they picked another vendor.",
      ja: "この提案に3ヶ月も注ぎ込んだのに、別の業者を選ばれちゃった…"
    },
    mission: {
      prompt: "「命まで取られるわけじゃないよ、次に活かそう」と励まして！",
      hint: "物事を広い視野に戻して安心させる型を使おう",
      targetPatternId: 21
    },
    en: "It's not the end of the world. We learned a lot for next time.",
    ja: "この世の終わりじゃないよ。次回に向けてたくさん学べたじゃない。",
    replyTips: "It's not the end of the world は大きな失敗や失意の底にいる人を冷静かつ前向きに引き上げる定番の励ましです。",
    alternatives: ["It's not the end of the world, we'll bounce back.", "Cheer up, it's really not the end of the world."]
  },
  {
    id: "rally-22",
    isRally: true, theme: "empathy",
    category: "大人の返答・感謝",
    partner: {
      name: "James",
      avatar: "👨‍💼",
      context: "急遽フライトの遅延で到着時間が遅れると連絡をくれた取引先",
      en: "Sorry for the inconvenience, but my flight is delayed by two hours.",
      ja: "ご迷惑をおかけして申し訳ありませんが、フライトが2時間遅延しています。"
    },
    mission: {
      prompt: "「状況を教えていただきありがとうございます。どうぞお気をつけて」と返して！",
      hint: "相手の事前連絡を快く受け止める大人の感謝型を使おう",
      targetPatternId: 22
    },
    en: "I appreciate you letting me know. Safe travels!",
    ja: "状況を教えてくださりありがとうございます。どうぞお気をつけて！",
    replyTips: "I appreciate you letting me know はビジネスや社交で相手の手間や気遣いに対してスマートな品格を示す最高の一言です。",
    alternatives: ["Thank you for the heads-up. Safe travels!", "I appreciate the update, don't worry about it."]
  },
  {
    id: "rally-23",
    isRally: true, theme: "empathy",
    category: "称賛・エール",
    partner: {
      name: "Mia",
      avatar: "👩‍💻",
      context: "新しいデザインシステムの実装を無事完了させたメンバー",
      en: "I just deployed the new responsive component library without any bugs!",
      ja: "バグなしで新しいレスポンシブコンポーネントライブラリをデプロイできたよ！"
    },
    mission: {
      prompt: "「素晴らしい！その調子で頑張ってね！」とエールを送って！",
      hint: "相手の勢いを後押しする爽やかな称賛型を使おう",
      targetPatternId: 23
    },
    en: "Awesome! Keep up the good work!",
    ja: "素晴らしい！その調子で頑張ってね！",
    replyTips: "Keep up the good work! は仕事や勉強の成果を祝し、背中をポンと叩いて応援する爽快な定番エールです。",
    alternatives: ["Incredible job! Keep it up!", "Proud of you, keep up the amazing work!"]
  },
  {
    id: "rally-24",
    isRally: true, theme: "empathy",
    category: "ポジティブ・締め",
    partner: {
      name: "Chris",
      avatar: "🧔‍♂️",
      context: "新製品の発売が来月に延期になってため息をつく同僚",
      en: "Ugh, another delay... We have to wait another month for the launch.",
      ja: "はぁ、また延期か…発売までもう1ヶ月も待たなきゃいけないよ。"
    },
    mission: {
      prompt: "「プラス思考でいこうよ、テストする時間がもっと増えたんだから」と返して！",
      hint: "困難の中に希望を見出すポジティブ転換型を使おう",
      targetPatternId: 24
    },
    en: "Look on the bright side. We have more time for QA testing.",
    ja: "プラス思考でいこうよ。品質テストをする時間がもっと増えたんだから。",
    replyTips: "Look on the bright side はマイナスな状況を一瞬で希望に変える、明るく頼もしい大人の切り返しです。",
    alternatives: ["Let's look on the bright side, at least we won't have to rush.", "Always look on the bright side!"]
  }
,
  {
    id: "rally-25",
    isRally: true,
    theme: "social",
    category: "合流・人数連絡",
    partner: {
      name: "Luke",
      avatar: "🍻",
      context: "先にお店に着いてテーブルを確保してくれた同僚",
      en: "Hey, we just got a table at the pub! How many people are with you?",
      ja: "パブの席取れたよ！そっちは何人一緒？"
    },
    mission: {
      prompt: "「後からもう2人合流する予定だよ」と伝えて！",
      hint: "人数の追加を自然に伝える表現を使おう",
      targetPatternId: 34
    },
    en: "Two more will be joining us later.",
    ja: "後からもう2人合流する予定だよ。",
    replyTips: "Two more will be joining us はレストランやパブでの合流連絡の鉄板フレーズです。",
    alternatives: ["Two more friends will join us soon.", "There are two more coming later."]
  },
  {
    id: "rally-26",
    isRally: true,
    theme: "social",
    category: "お誘い・大人の断り方",
    partner: {
      name: "Dave",
      avatar: "🍺",
      context: "仕事終わりに飲みに行こうと声をかけてくれた同僚",
      en: "Do you want to come out for drinks with the team tonight?",
      ja: "今夜チームのみんなと飲みに行かない？"
    },
    mission: {
      prompt: "「今夜は遠慮しておくよ（誘ってくれてありがとう）」と角を立てずに断って！",
      hint: "マイルドに辞退する大人の型を使おう",
      targetPatternId: 66
    },
    en: "I'd rather not tonight, but thanks for asking!",
    ja: "今夜は遠慮しておくよ、誘ってくれてありがとう！",
    replyTips: "I'd rather not に thanks for asking を添えることで、相手の誘いを尊重しつつスマートに断れます。",
    alternatives: ["I think I'll pass tonight, but thank you!", "I'd rather stay in tonight, thanks though!"]
  },
  {
    id: "rally-27",
    isRally: true,
    theme: "social",
    category: "別れ際・お開き",
    partner: {
      name: "Mark",
      avatar: "🍷",
      context: "深夜近くまで盛り上がっている集まりで切り出す場面",
      en: "It's already past 11 PM. Should we order another round or head home?",
      ja: "もう夜11時過ぎてるね。もう一杯頼む？それとも帰る？"
    },
    mission: {
      prompt: "「今日はここまでにしましょう（お開きにしよう）」と提案して！",
      hint: "爽やかに締めくくる表現（Part 6）を使おう",
      targetPatternId: 40
    },
    en: "Let's call it a day.",
    ja: "今日はここまでにしましょう（お開きにしよう）。",
    replyTips: "Let's call it a day は飲み会や仕事のキリが良いタイミングでスマートにお開きを促す最強フレーズです。",
    alternatives: ["I think we should call it a day.", "Let's wrap it up and call it a day."]
  },
  {
    id: "rally-28",
    isRally: true,
    theme: "social",
    category: "夕食の提案",
    partner: {
      name: "Emily",
      avatar: "🍕",
      context: "疲れて料理をする気力がない日の夕方",
      en: "Nobody feels like cooking tonight. What should we do for dinner?",
      ja: "今夜は誰も料理する気分じゃないね。夕飯どうしようか？"
    },
    mission: {
      prompt: "「今夜はピザを頼むのはどう？」と提案して！",
      hint: "How about we の提案型を使おう",
      targetPatternId: 17
    },
    en: "How about we order pizza tonight?",
    ja: "今夜ピザを頼むのはどう？",
    replyTips: "How about we ~? は相手にプレッシャーを与えずにフランクな提案を投げかける定番です。",
    alternatives: ["Why don't we order some pizza?", "How about ordering delivery pizza tonight?"]
  },
  {
    id: "rally-29",
    isRally: true,
    theme: "travel",
    category: "カフェ・持ち帰り注文",
    partner: {
      name: "Barista",
      avatar: "☕️",
      context: "カウンターでドリンクを受け取る際のやり取り",
      en: "Here is your iced latte. Anything else I can get for you?",
      ja: "アイスラテお待たせしました。他にご注文はございますか？"
    },
    mission: {
      prompt: "「これを持ち帰り（テイクアウト）にできますか？」と頼んで！",
      hint: "Can I get this ~? の型を使おう",
      targetPatternId: 42
    },
    en: "Can I get this to go?",
    ja: "これをお持ち帰りにできますか？",
    replyTips: "海外では「take out」より「to go」が最も自然に通じます。",
    alternatives: ["Could you make that to go, please?", "Can I have this in a to-go cup?"]
  },
  {
    id: "rally-30",
    isRally: true,
    theme: "travel",
    category: "レストラン・同席注文",
    partner: {
      name: "Server",
      avatar: "🍽️",
      context: "友人が注文した後に自分の番が回ってきた時",
      en: "And what can I get started for you today?",
      ja: "お客様は何をご注文されますか？"
    },
    mission: {
      prompt: "「私も（友人と同じものを）ください」と注文して！",
      hint: "I will have the same thing の型を使おう",
      targetPatternId: 42
    },
    en: "I'll have the same thing, please.",
    ja: "私も同じものをください。",
    replyTips: "I'll have the same thing はメニューを見返さずにスマートに同じ品を頼む鉄板表現です。",
    alternatives: ["The same for me, please.", "I'll go with the same thing."]
  },
  {
    id: "rally-31",
    isRally: true,
    theme: "travel",
    category: "旅行・距離の確認",
    partner: {
      name: "Local Guide",
      avatar: "🗺️",
      context: "旅先で目的地の場所を教えてもらった場面",
      en: "The national gallery is just straight down this boulevard.",
      ja: "国立美術館はこの大通りをまっすぐ行ったところにありますよ。"
    },
    mission: {
      prompt: "「ここからどれくらいの距離ですか？」と尋ねて！",
      hint: "How far is it ~? の距離確認型を使おう",
      targetPatternId: 47
    },
    en: "How far is it from here?",
    ja: "ここからどれくらいの距離ですか？",
    replyTips: "How far is it from here? は徒歩か交通機関を使うか判断する際のとっさの必需品です。",
    alternatives: ["Is it within walking distance from here?", "About how far is it on foot?"]
  },
  {
    id: "rally-32",
    isRally: true,
    theme: "travel",
    category: "お会計・レシート",
    partner: {
      name: "Cashier",
      avatar: "🧾",
      context: "レジでの支払いが完了した瞬間",
      en: "Your payment went through. Have a wonderful afternoon!",
      ja: "お支払いが完了しました。素敵な午後をお過ごしください！"
    },
    mission: {
      prompt: "「レシートをいただけますか？」と丁寧に頼んで！",
      hint: "Could I have a receipt, please? の丁寧型を使おう",
      targetPatternId: 44
    },
    en: "Could I have a receipt, please?",
    ja: "レシートをいただけますか？",
    replyTips: "Could I have a receipt, please? は経費精算や旅行中の記録に必須の丁寧な表現です。",
    alternatives: ["May I have the receipt, please?", "Can I get a receipt for this?"]
  },
  {
    id: "rally-33",
    isRally: true,
    theme: "travel",
    category: "食事・おごり",
    partner: {
      name: "Travel Buddy",
      avatar: "💳",
      context: "ディナーの後輩やお世話になった友人との食事",
      en: "Let me split the check with you! How much do I owe?",
      ja: "割り勘にさせて！いくら払えばいい？"
    },
    mission: {
      prompt: "「気にしないで、私がおごるよ（ご馳走するよ）」とスマートに返して！",
      hint: "I will treat you の型を使おう",
      targetPatternId: 45
    },
    en: "Don't worry about it. I'll treat you.",
    ja: "気にしないで、ご馳走するよ（おごるよ）。",
    replyTips: "I'll treat you は「私が出すよ・おごるよ」と相手を立ててご馳走する最高の一言です。",
    alternatives: ["It's on me tonight!", "Don't worry, my treat!"]
  },
  {
    id: "rally-34",
    isRally: true,
    theme: "first_meet",
    category: "初対面・挨拶",
    partner: {
      name: "Ethan",
      avatar: "🤝",
      context: "カンファレンスの懇親会で声をかけてくれた他支社の同僚",
      en: "Hi there! I'm Ethan from the Seattle team. Great to finally see you in person!",
      ja: "こんにちは！シアトルチームのイーサンです。直接お会いできて嬉しいです！"
    },
    mission: {
      prompt: "「初めまして！お話しするのは初めてですよね」とスマートに返して！",
      hint: "I think we have never spoken before の型を使おう",
      targetPatternId: 31
    },
    en: "Nice to meet you! I think we have never spoken before.",
    ja: "初めまして！お話しするのは初めてですよね。",
    replyTips: "初対面の挨拶にこの一言を添えることで、スムーズに会話の緊張をほぐせます。",
    alternatives: ["Great to meet you too! We haven't spoken before, right?", "Nice to meet you! This is our first time talking, isn't it?"]
  },
  {
    id: "rally-35",
    isRally: true,
    theme: "first_meet",
    category: "初対面・名前の呼び方",
    partner: {
      name: "Christopher",
      avatar: "🏷️",
      context: "自己紹介でニックネームを教えてくれた新しい同僚",
      en: "Hey! Everyone in the office calls me CJ, though my badge says Christopher.",
      ja: "やあ！名札にはクリストファーと書いてあるけど、社内ではみんなCJと呼んでるよ。"
    },
    mission: {
      prompt: "「何とお呼びすればいいですか？」と尋ねて！",
      hint: "What should I call you? の型を使おう",
      targetPatternId: 31
    },
    en: "What should I call you?",
    ja: "何とお呼びすればいいですか？",
    replyTips: "What should I call you? は相手の好む呼び名を尊重するグローバルな好印象フレーズです。",
    alternatives: ["Should I call you CJ?", "How would you like me to address you?"]
  },
  {
    id: "rally-36",
    isRally: true,
    theme: "first_meet",
    category: "雑談・天気の共感",
    partner: {
      name: "Colleague",
      avatar: "☀️",
      context: "エレベーターで一緒になった同僚とのアイスブレイク",
      en: "Finally some blue sky after days of freezing rain!",
      ja: "連日の冷たい雨の後で、ようやく青空が出ましたね！"
    },
    mission: {
      prompt: "「今日は暖かくて気持ちいいね」と共感して！",
      hint: "It is nice and warm today の型を使おう",
      targetPatternId: 36
    },
    en: "Yeah, it's nice and warm today.",
    ja: "うん、今日は暖かくて気持ちいいね。",
    replyTips: "天気の話題は万国共通の最強のアイスブレイクです。",
    alternatives: ["It really is nice and warm today.", "Totally, what a lovely warm day!"]
  },
  {
    id: "rally-37",
    isRally: true,
    theme: "first_meet",
    category: "褒め言葉・外見",
    partner: {
      name: "Teammate",
      avatar: "👔",
      context: "新しいジャケットを着てオフィスに現れたチームメイト",
      en: "I picked up this navy jacket on sale over the weekend. How does it look?",
      ja: "週末セールでこのネイビージャケット買ったんだ。どう見える？"
    },
    mission: {
      prompt: "「それ、君によく似合ってるよ！」と自然に褒めて！",
      hint: "That looks good on you の型を使おう",
      targetPatternId: 48
    },
    en: "That looks really good on you!",
    ja: "それ、君によく似合ってるよ！",
    replyTips: "That looks good on you は服や髪型、持ち物を自然に褒めるネイティブの定番です。",
    alternatives: ["It suits you really well!", "That looks great on you!"]
  }
];

