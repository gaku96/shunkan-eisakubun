#!/usr/bin/env python3
"""
GRIT 30 Patterns Data & Audio Generator.
Generates:
1. data_grit.js with 30 patterns (90 cards: 原典, ビジネス応用, 日常・自己成長応用)
2. 90 English conversational MP3s (en-US-BrianNeural, +8%, spoken reductions)
3. 90 Japanese natural narrator MP3s (ja-JP-NanamiNeural)
"""

import asyncio
import json
import os
import re
import sys

GRIT_PATTERNS = [
  # --- Part 1 ---
  {
    "id": 1, "part": 1, "en": "I left a ~ job in A for a job that was even more ~: B",
    "ja": "Aでの〜な仕事を辞め、さらに〜なBの仕事に就いた",
    "note": "キャリアの転換と、次の挑戦の過酷さを対比させて伝える。",
    "examples": [
      { "tag": "原典", "ja": "経営コンサルタントの仕事を辞め、さらに責任の重い教師になった。", "en": "I left a very demanding job in management consulting for a job that was even more demanding: teaching." },
      { "tag": "ビジネス", "ja": "大手企業の安定した仕事を辞め、さらに挑戦的なスタートアップに入社した。", "en": "I left a stable job at a big corporation for a job that was even more challenging: a tech startup." },
      { "tag": "日常", "ja": "忙しい営業の仕事を辞め、さらに時間のかかる子育てに専念した。", "en": "I left a busy job in sales for a role that was even more demanding: full-time parenting." }
    ]
  },
  {
    "id": 2, "part": 1, "en": "Like any ~, I did A, and when B, I did C",
    "ja": "他の〜と同じようにAをし、BのときにはCをした",
    "note": "日常のルーティンを淡々と語り、相手に親近感とリアリティを持たせる。",
    "examples": [
      { "tag": "原典", "ja": "他の教師と同じようにテストを作り、課題が返ってきたら成績をつけた。", "en": "And like any teacher, I made quizzes and tests, and when the work came back, I calculated grades." },
      { "tag": "ビジネス", "ja": "他の営業と同じように商談をし、契約書が届いたら処理を進めた。", "en": "Like any salesperson, I held meetings, and when contracts arrived, I processed them." },
      { "tag": "日常", "ja": "他の親と同じように朝ご飯を作り、子どもたちが帰ってきたら宿題を手伝った。", "en": "Like any parent, I made breakfast, and when the kids came back, I helped with homework." }
    ]
  },
  {
    "id": 3, "part": 1, "en": "What struck me was that ~",
    "ja": "ハッとさせられた／驚かされたのは〜だった",
    "note": "常識の盲点を突き、聞き手を自分の発見にグッと引き込む最重要構文。",
    "examples": [
      { "tag": "原典", "ja": "驚かされたのは、優秀な生徒とそうでない生徒の違いはIQだけではなかったことだ。", "en": "What struck me was that IQ was not the only difference between my best and my worst students." },
      { "tag": "ビジネス", "ja": "驚いたのは、最も売れる商品が最も安い商品ではなかったことだ。", "en": "What struck me was that the bestselling product was not the cheapest one." },
      { "tag": "日常", "ja": "ハッとさせられたのは、彼が困難な状況でも一切言い訳をしなかったことだ。", "en": "What struck me was that he never made any excuses even during tough times." }
    ]
  },
  {
    "id": 4, "part": 1, "en": "~ is not the only difference between A and B",
    "ja": "AとBの違いは〜だけではない（それだけで差がつくわけではない）",
    "note": "単一の要因（才能や学歴など）に頼った固定観念を崩す。",
    "examples": [
      { "tag": "原典", "ja": "知能指数だけが、優秀な生徒と最も成績の悪い生徒の違いではなかった。", "en": "IQ was not the only difference between my best and my worst students." },
      { "tag": "ビジネス", "ja": "スキルだけが、一流のエンジニアと並のエンジニアの違いではない。", "en": "Technical skills are not the only difference between top engineers and average ones." },
      { "tag": "日常", "ja": "運だけが、成功する人と途中で諦める人の違いではない。", "en": "Luck is not the only difference between those who succeed and those who give up." }
    ]
  },
  {
    "id": 5, "part": 1, "en": "Some of my strongest performers did not have ~",
    "ja": "最も優秀な成果を出した人の中にさえ、〜を持たない人がいた",
    "note": "通説の「必須条件」を覆す、強いコントラストを生む表現。",
    "examples": [
      { "tag": "原典", "ja": "最も優秀な成績を収めた生徒の中にさえ、桁外れに高いIQを持たない者がいた。", "en": "Some of my strongest performers did not have stratospheric IQ scores." },
      { "tag": "ビジネス", "ja": "トップ営業マンの中にも、豊富な人脈を持っていなかった人がいた。", "en": "Some of our top performers did not have extensive personal connections." },
      { "tag": "日常", "ja": "最も上達した学習者の中にも、特別な語学の才能を持っていなかった人がいる。", "en": "Some of our best learners did not have any special talent for languages." }
    ]
  },
  {
    "id": 6, "part": 1, "en": "Some of my [best people] weren't doing so well",
    "ja": "最も優秀なはずの者の中に、あまり成果が出ていない人がいた",
    "note": "「地頭の良さ＝成功」ではないという現実のリアルを突く。",
    "examples": [
      { "tag": "原典", "ja": "私の生徒の中で特に優秀な子たちの中に、成績があまり良くない子もいた。", "en": "Some of my smartest kids weren't doing so well." },
      { "tag": "ビジネス", "ja": "最も経験豊富なメンバーの中に、新しい環境で苦戦している人がいた。", "en": "Some of our most experienced members weren't doing so well." },
      { "tag": "日常", "ja": "テストの点が一番高かった人の中に、実際の会話で苦労している人がいた。", "en": "Some of the people with the highest test scores weren't doing so well in real conversation." }
    ]
  },

  # --- Part 2 ---
  {
    "id": 7, "part": 2, "en": "And that got me thinking",
    "ja": "そして、それが深く考えるきっかけになった",
    "note": "問題意識が芽生えた瞬間を自然につなぎ、次の展開へ橋渡しする。",
    "examples": [
      { "tag": "原典", "ja": "そして、それが私に深く考えさせるきっかけとなった。", "en": "And that got me thinking." },
      { "tag": "ビジネス", "ja": "顧客からの率直なフィードバックが、商品を見直すきっかけになった。", "en": "That customer feedback really got me thinking about our product strategy." },
      { "tag": "日常", "ja": "彼のその一言が、自分の時間の使い方を考え直すきっかけになった。", "en": "What he said really got me thinking about how I spend my time." }
    ]
  },
  {
    "id": 8, "part": 2, "en": "The kinds of things you need to ~, sure, they're hard, but they're not impossible",
    "ja": "やるべきこと、確かに難しい。だが不可能なわけではない",
    "note": "課題の厳しさを認めた上で、ポジティブな可能性を力強く提示する。",
    "examples": [
      { "tag": "原典", "ja": "学ぶ必要がある内容は確かに難しいが、不可能なものではない。", "en": "The kinds of things you need to learn, sure, they're hard, but they're not impossible." },
      { "tag": "ビジネス", "ja": "このプロジェクトで達成すべき目標、確かに厳しいが、不可能なわけではない。", "en": "The goals we need to hit, sure, they're tough, but they're not impossible." },
      { "tag": "日常", "ja": "英語を流暢に話すこと、確かに大変だが、不可能なことではない。", "en": "Speaking fluent English, sure, it's hard, but it's not impossible." }
    ]
  },
  {
    "id": 9, "part": 2, "en": "I was firmly convinced that ~ if they worked hard and long enough",
    "ja": "十分長く懸命に努力しさえすれば、〜できると固く確信していた",
    "note": "努力と時間に対する揺るぎない信頼を伝える表現。",
    "examples": [
      { "tag": "原典", "ja": "十分な時間と努力をかければ、生徒全員が内容を習得できると確信していた。", "en": "I was firmly convinced that every student could learn the material if they worked hard and long enough." },
      { "tag": "ビジネス", "ja": "粘り強く検証を続ければ、必ず解決策が見つかると確信していた。", "en": "I was firmly convinced that we could find a solution if we worked hard and long enough." },
      { "tag": "日常", "ja": "諦めずに毎日続ければ、誰でも上達できると確信している。", "en": "I'm firmly convinced that anyone can improve if they practice hard and long enough." }
    ]
  },
  {
    "id": 10, "part": 2, "en": "After several more years of ~, I came to the conclusion that ~",
    "ja": "さらに数年間〜を経験した後、…という結論に至った",
    "note": "長期の実践を経てたどり着いた、重みのある見解を示す。",
    "examples": [
      { "tag": "原典", "ja": "さらに数年間教鞭を執った後、教育に必要なのは〜だという結論に至った。", "en": "After several more years of teaching, I came to the conclusion that what we need is a better understanding." },
      { "tag": "ビジネス", "ja": "数年現場で働いた後、本当に重要なのは仕組み化だという結論に至った。", "en": "After several more years in the industry, I came to the conclusion that systems matter more than talent." },
      { "tag": "日常", "ja": "何年も英語を学んだ後、一番大切なのは毎日の習慣だという結論に至った。", "en": "After several years of studying, I came to the conclusion that daily habits are everything." }
    ]
  },
  {
    "id": 11, "part": 2, "en": "What we need is a much better understanding of ~ from a ~ perspective",
    "ja": "必要なのは、〜の観点から…をより深く理解することだ",
    "note": "議論の視座（パースペクティブ）を切り替え、根本解決を促す。",
    "examples": [
      { "tag": "原典", "ja": "必要なのは、動機づけや心理学の観点から学習をより深く理解することだ。", "en": "What we need is a much better understanding of learning from a motivational and psychological perspective." },
      { "tag": "ビジネス", "ja": "必要なのは、顧客体験の観点から自社のサービスをより深く理解することだ。", "en": "What we need is a much better understanding of our product from a customer perspective." },
      { "tag": "日常", "ja": "必要なのは、継続性の観点から自分の生活リズムを理解することだ。", "en": "What we need is a much better understanding of our daily habits from a long-term perspective." }
    ]
  },
  {
    "id": 12, "part": 2, "en": "The one thing we know how to measure best is ~",
    "ja": "私たちが最も正確に測定できると分かっている唯一のものは〜だ",
    "note": "「測りやすいもの」と「本当に大切なもの」のギャップを浮き彫りにする。",
    "examples": [
      { "tag": "原典", "ja": "教育において、私たちが最も正確に測れる唯一のものはIQだ。", "en": "In education, the one thing we know how to measure best is IQ." },
      { "tag": "ビジネス", "ja": "マーケティングで私たちが最も簡単に測定できるのはクリック数だ。", "en": "In marketing, the one thing we know how to measure best is clicks." },
      { "tag": "日常", "ja": "健康管理で私たちが最も簡単に測れるのは体重だ。", "en": "In fitness, the one thing we know how to measure best is body weight." }
    ]
  },

  # --- Part 3 ---
  {
    "id": 13, "part": 3, "en": "What if ~ depends on much more than ~?",
    "ja": "もし〜が、…以上のものにかかっているとしたら？",
    "note": "従来の前提を覆す、非常に知的な仮説提示のキラー構文。",
    "examples": [
      { "tag": "原典", "ja": "もし人生で成功することが、素早く簡単に学ぶ能力以上のものにかかっているとしたら？", "en": "What if doing well in school and in life depends on much more than your ability to learn quickly and easily?" },
      { "tag": "ビジネス", "ja": "もし事業の成功が、資金の多さ以上のものにかかっているとしたら？", "en": "What if business success depends on much more than having a huge budget?" },
      { "tag": "日常", "ja": "もし語学の上達が、生まれつきの才能以上のものにかかっているとしたら？", "en": "What if language learning depends on much more than natural talent?" }
    ]
  },
  {
    "id": 14, "part": 3, "en": "So I left A, and I went to B to become C",
    "ja": "だから私はAを去り、CになるためにBへ進んだ",
    "note": "自分の信念を行動に変えた大きな決断を力強く語る。",
    "examples": [
      { "tag": "原典", "ja": "それで私は教室を離れ、心理学者になるために大学院に進学した。", "en": "So I left the classroom, and I went to graduate school to become a psychologist." },
      { "tag": "ビジネス", "ja": "だから私は大企業を辞め、起業家になるためにシリコンバレーへ渡った。", "en": "So I left my corporate job, and I went to Silicon Valley to become an entrepreneur." },
      { "tag": "日常", "ja": "だから私は快適な環境を離れ、英語を話せるようになるために留学した。", "en": "So I left my comfort zone, and I went abroad to become fluent in English." }
    ]
  },
  {
    "id": 15, "part": 3, "en": "In every study, my question was: who is successful here and why?",
    "ja": "どの調査でも私の問いは常に「ここで成功しているのは誰で、なぜか？」だった",
    "note": "自分の研究やビジネスにおける一貫したコアの問いを提示する。",
    "examples": [
      { "tag": "原典", "ja": "どの研究でも私の疑問は「ここで成功しているのは誰で、なぜなのか？」ということだった。", "en": "In every study my question was, who is successful here and why?" },
      { "tag": "ビジネス", "ja": "どの市場調査でも私たちの問いは「誰がこの商品を買ってくれて、なぜなのか？」だった。", "en": "In every project our question was, who is buying our product and why?" },
      { "tag": "日常", "ja": "どの分野でも私の疑問は「誰が結果を出し続けていて、なぜなのか？」だった。", "en": "In every field my question was, who consistently gets results and why?" }
    ]
  },
  {
    "id": 16, "part": 3, "en": "We tried to predict which ~ would stay and which would drop out",
    "ja": "誰が最後まで残り、誰が途中で脱落するかを予測しようと試みた",
    "note": "定着率や継続性の検証を語るときの王道パターン。",
    "examples": [
      { "tag": "原典", "ja": "どの士官候補生が訓練に残り、誰が脱落するかを予測しようとした。", "en": "We tried to predict which cadets would stay in military training and which would drop out." },
      { "tag": "ビジネス", "ja": "どの新規ユーザーがアプリを使い続け、誰が離脱するかを予測しようとした。", "en": "We tried to predict which users would stay active and which would churn." },
      { "tag": "日常", "ja": "誰がジム通いを習慣化でき、誰が3日坊主でやめるかを分析した。", "en": "We tried to see who would stick with the gym and who would drop out after a week." }
    ]
  },
  {
    "id": 17, "part": 3, "en": "asking who will be the most effective at improving [outcomes] for ~",
    "ja": "〜の成果を高める上で、誰が最も効果的なのかと問いを立てた",
    "note": "表面的な実績ではなく、本質的な改善インパクトに焦点を当てる。",
    "examples": [
      { "tag": "原典", "ja": "生徒の学習成果を向上させる上で、誰が最も効果的な教師なのかを問うた。", "en": "We asked who will be the most effective at improving learning outcomes for their students." },
      { "tag": "ビジネス", "ja": "チームの売上を伸ばす上で、誰が最も効果的なマネージャーなのかを検証した。", "en": "We asked who will be the most effective at driving sales for the team." },
      { "tag": "日常", "ja": "健康状態を改善する上で、どの習慣が最も効果的かを調べた。", "en": "We asked which habits are the most effective at improving overall health." }
    ]
  },
  {
    "id": 18, "part": 3, "en": "In all those very different contexts, one characteristic emerged as a significant predictor of ~",
    "ja": "全く異なるすべての状況において、ある1つの要素が〜の決定的な予測因子として浮上した",
    "note": "多種多様なデータから共通の成功法則を導き出す際の決め台詞。",
    "examples": [
      { "tag": "原典", "ja": "全く異なる状況において、成功を予測する重要な1つの特徴が浮かび上がった。", "en": "In all those very different contexts, one characteristic emerged as a significant predictor of success." },
      { "tag": "ビジネス", "ja": "すべての業界において、スピードが企業の成長を予測する最大の要因として浮上した。", "en": "Across very different industries, speed emerged as a significant predictor of growth." },
      { "tag": "日常", "ja": "あらゆる学習者において、毎日の継続が成果を予測する決定的な要因として浮上した。", "en": "Across different learners, consistency emerged as a significant predictor of fluency." }
    ]
  },

  # --- Part 4 ---
  {
    "id": 19, "part": 4, "en": "It wasn't A. It wasn't B, and it wasn't C. It was X",
    "ja": "Aでもなく、Bでもなく、Cでもなかった。それはXだった",
    "note": "三段否定からの真因提示。聴衆に最も強い印象を残すレトリック。",
    "examples": [
      { "tag": "原典", "ja": "容姿の良さでもなく、健康状態でもなく、IQでもなかった。それはグリット（やり抜く力）だった。", "en": "It wasn't good looks, physical health, and it wasn't IQ. It was grit." },
      { "tag": "ビジネス", "ja": "資金力でもなく、広告量でもなく、人脈でもなかった。それは製品の品質だった。", "en": "It wasn't huge funding, massive ads, and it wasn't connections. It was product quality." },
      { "tag": "日常", "ja": "教科書の質でもなく、先生の腕でもなかった。差を分けたのは練習量だった。", "en": "It wasn't the textbooks, and it wasn't the teachers. It was daily practice." }
    ]
  },
  {
    "id": 20, "part": 4, "en": "~ is passion and perseverance for very long-term goals",
    "ja": "〜とは、非常に長期的な目標に対する情熱と忍耐力のことである",
    "note": "概念を洗練された一文でズバリ定義する、GRITの中心命題。",
    "examples": [
      { "tag": "原典", "ja": "グリットとは、極めて長期的な目標に対する情熱と忍耐力のことだ。", "en": "Grit is passion and perseverance for very long-term goals." },
      { "tag": "ビジネス", "ja": "ビジョンとは、目の前の困難に負けない長期的な信念のことだ。", "en": "A real vision is commitment and persistence toward very long-term goals." },
      { "tag": "日常", "ja": "真の自信とは、日々の地道な積み重ねから生まれる静かな強さのことだ。", "en": "Real confidence is patience and steady practice for long-term growth." }
    ]
  },
  {
    "id": 21, "part": 4, "en": "~ is sticking with your future, day in, day out, not just for A, but for B",
    "ja": "〜とは、単にAだけでなく、何年も何年も日々Xと粘り強く向き合い続けることだ",
    "note": "「day in, day out（毎日毎日）」の圧倒的な継続のリフレイン。",
    "examples": [
      { "tag": "原典", "ja": "グリットとは、単に1週間や1ヶ月だけでなく、何年も日々自分の未来と粘り強く向き合うことだ。", "en": "Grit is sticking with your future, day in, day out, not just for the week, not just for the month, but for years." },
      { "tag": "ビジネス", "ja": "成功とは、単に初期の数ヶ月だけでなく、何年も顧客と真摯に向き合い続けることだ。", "en": "Building a brand is sticking with your customers, day in, day out, not just for a quarter, but for years." },
      { "tag": "日常", "ja": "語学習得とは、試験前だけでなく、何年も毎日欠かさず触れ続けることだ。", "en": "Mastering English is sticking with your goals, day in, day out, not just for a few days, but for years." }
    ]
  },
  {
    "id": 22, "part": 4, "en": "~ is living life like it's a marathon, not a sprint",
    "ja": "〜とは、人生を短距離走ではなくマラソンのように生きることだ",
    "note": "ペース配分と長期戦の重要性を誰もが直感できるメタファー。",
    "examples": [
      { "tag": "原典", "ja": "グリットとは、人生を短距離走ではなくマラソンのように生きることだ。", "en": "Grit is living life like it's a marathon, not a sprint." },
      { "tag": "ビジネス", "ja": "スタートアップの経営は、短距離走ではなくマラソンのように取り組むべきだ。", "en": "Running a startup is like running a marathon, not a sprint." },
      { "tag": "日常", "ja": "キャリアの構築は、100メートル走ではなくマラソンだ。", "en": "Building a successful career is a marathon, not a sprint." }
    ]
  },
  {
    "id": 23, "part": 4, "en": "Turns out that ~ were significantly more likely to ~",
    "ja": "調べてみると（フタを開けてみたら）、〜の方が…する可能性が著しく高いことが分かった",
    "note": "意外な検証結果や発見をサラッと知的に報告する日常＆学術の超頻出構文。",
    "examples": [
      { "tag": "原典", "ja": "調べてみると、粘り強い子どもたちの方が卒業する確率が著しく高かった。", "en": "Turns out that grittier kids were significantly more likely to graduate." },
      { "tag": "ビジネス", "ja": "フタを開けてみたら、初期に小さく失敗したチームの方が大成功する確率が高かった。", "en": "Turns out that teams that failed early were significantly more likely to succeed later." },
      { "tag": "日常", "ja": "実際にやってみると、朝15分だけ勉強した人の方が長続きする可能性がはるかに高かった。", "en": "Turns out that people who study 15 minutes a morning are significantly more likely to stick with it." }
    ]
  },
  {
    "id": 24, "part": 4, "en": "even when I matched them on every characteristic I could measure, things like ~",
    "ja": "測定できるあらゆる条件（〜など）を揃えて比較した場合でさえも",
    "note": "他の変数を排除し、自分の主張の強固さを証明する科学的ロジック。",
    "examples": [
      { "tag": "原典", "ja": "年収や学力テスト、安心感など、測定可能な全条件を揃えて比較した場合でさえもだ。", "en": "even when I matched them on every characteristic I could measure, things like family income and test scores." },
      { "tag": "ビジネス", "ja": "予算やチーム規模、開発期間など、あらゆる条件を揃えて比較した場合でさえもだ。", "en": "even when we matched them on every factor we could measure, things like budget and team size." },
      { "tag": "日常", "ja": "勉強時間や教材のレベルなど、あらゆる条件を揃えて比較した場合でさえもそうだ。", "en": "even when we matched them on study hours and learning materials." }
    ]
  },

  # --- Part 5 ---
  {
    "id": 25, "part": 5, "en": "It's not just in A that ~ matters. It's also in B, especially for C",
    "ja": "〜が重要なのは単にAだけではない。Bにおいても、特にCにとって極めて重要だ",
    "note": "発見の適用範囲を特殊な現場から普遍的な社会全体へ広げる。",
    "examples": [
      { "tag": "原典", "ja": "粘り強さが大事なのは軍隊だけではない。学校でも、特に中退の危機にある子に重要だ。", "en": "It's not just in military training that grit matters. It's also in school, especially for kids at risk of dropping out." },
      { "tag": "ビジネス", "ja": "スピードが重要なのは営業だけではない。エンジニアリングでも、特に初期開発で不可欠だ。", "en": "It's not just in sales that speed matters. It's also in engineering, especially for early-stage development." },
      { "tag": "日常", "ja": "継続が大事なのはスポーツだけではない。英語学習でも、特に忙しい社会人にこそ重要だ。", "en": "It's not just in sports that consistency matters. It's also in language learning, especially for busy adults." }
    ]
  },
  {
    "id": 26, "part": 5, "en": "To me, the most shocking thing about ~ is how little we know about ~",
    "ja": "私にとって最も衝撃的なのは、〜について私たちがいかに無知かということだ",
    "note": "人類の知識の限界を率直に認め、探求への参加を促す。",
    "examples": [
      { "tag": "原典", "ja": "私にとって最も衝撃的なのは、粘り強さを育む方法について科学がいかに何も知らないかということだ。", "en": "To me, the most shocking thing about grit is how little science knows about building it." },
      { "tag": "ビジネス", "ja": "最も衝撃的なのは、これだけデータがありながら顧客の本音について私たちがどれほど無知かということだ。", "en": "To me, the most shocking thing is how little we truly understand about our customers' real needs." },
      { "tag": "日常", "ja": "最も驚くべきは、毎日使っている脳のメカニズムについて私たち自身がどれほど知らないかということだ。", "en": "To me, the most shocking thing is how little we know about our own habits and motivations." }
    ]
  },
  {
    "id": 27, "part": 5, "en": "What I do know is that [talent] doesn't make you [gritty]",
    "ja": "一つ確実に言えるのは、才能があるからといって〜になれるわけではないということだ",
    "note": "「分からないこと」を認めた直後に、たった一つの確実な真実を言い切る対比の美。",
    "examples": [
      { "tag": "原典", "ja": "私が確実に知っているのは、才能があるからといって粘り強くなれるわけではないということだ。", "en": "What I do know is that talent doesn't make you gritty." },
      { "tag": "ビジネス", "ja": "一つ確実に言えるのは、良いアイデアがあるからといって成功できるわけではないということだ。", "en": "What I do know is that a great idea alone doesn't make you successful." },
      { "tag": "日常", "ja": "一つ確実に言えるのは、教材をたくさん持っているからといって話せるようになるわけではないということだ。", "en": "What I do know is that buying lots of textbooks doesn't make you fluent." }
    ]
  },
  {
    "id": 28, "part": 5, "en": "Our data show very clearly that there are many talented people who simply do not follow through on their commitments",
    "ja": "私たちのデータは、才能がありながらも自分の目標を最後までやり抜かない人が多いことを明確に示している",
    "note": "「follow through on commitments（約束や目標を最後まで遂行する）」の実用表現。",
    "examples": [
      { "tag": "原典", "ja": "データは、才能がありながらも自らの目標を最後までやり抜かない人が多いことを明確に示している。", "en": "Our data show very clearly that there are many talented individuals who simply do not follow through on their commitments." },
      { "tag": "ビジネス", "ja": "データは、スキルが高くても納期や約束を守り抜けない人が少なくないことを示している。", "en": "Our data show clearly that having skill doesn't guarantee people will follow through on their commitments." },
      { "tag": "日常", "ja": "現実は、大きな新年の抱負を立てても最後までやり抜けない人がほとんどであることを示している。", "en": "Experience shows clearly that many people make ambitious goals but simply do not follow through on them." }
    ]
  },
  {
    "id": 29, "part": 5, "en": "In fact, in our data, A is usually unrelated or even inversely related to B",
    "ja": "実際、データ上ではAはBと無関係か、あるいは逆相関ですらある",
    "note": "直感に反する分析結果をロジカルに提示する、知的な議論の最高峰フレーズ。",
    "examples": [
      { "tag": "原典", "ja": "実際、私たちのデータでは、やり抜く力は才能の指標とは無関係か、むしろ逆相関にある。", "en": "In fact, in our data, grit is usually unrelated or even inversely related to measures of talent." },
      { "tag": "ビジネス", "ja": "実際データ上では、会議の多さは生産性と無関係か、むしろ逆相関にある。", "en": "In fact, in our data, meeting time is unrelated or even inversely related to actual productivity." },
      { "tag": "日常", "ja": "実際、完璧主義は幸福度と無関係か、むしろ逆相関にあることが多い。", "en": "In fact, perfectionism is often unrelated or even inversely related to personal happiness." }
    ]
  },
  {
    "id": 30, "part": 5, "en": "We have to be willing to fail, to be wrong, and to start over again with lessons learned",
    "ja": "失敗を恐れず、間違いを認め、教訓を活かして再びやり直す覚悟を持たねばならない",
    "note": "失敗の受容と再起の覚悟を力強く宣言し、聴衆に行動を呼びかける大団円。",
    "examples": [
      { "tag": "原典", "ja": "私たちは失敗を恐れず、間違いを受け入れ、教訓と共に再挑戦する覚悟を持たねばならない。", "en": "We have to be willing to fail, to be wrong, and to start over again with lessons learned." },
      { "tag": "ビジネス", "ja": "イノベーションを起こすには、失敗を恐れず、得られた教訓から素早くやり直す覚悟が必要だ。", "en": "To innovate, we have to be willing to fail, to be wrong, and to start over again with lessons learned." },
      { "tag": "日常", "ja": "英語を話せるようになるには、間違えることを恐れず、恥をかきながら学び続ける覚悟が必要だ。", "en": "To master English, we have to be willing to make mistakes and start over again with lessons learned." }
    ]
  }
]

def to_spoken(text):
    t = text.replace('"', '').strip()
    t = re.sub(r'\bkind of\b', 'kinda', t, flags=re.IGNORECASE)
    t = re.sub(r'\bsort of\b', 'sorta', t, flags=re.IGNORECASE)
    t = re.sub(r'\bout of\b', 'outta', t, flags=re.IGNORECASE)
    t = re.sub(r'\ba lot of\b', 'a lotta', t, flags=re.IGNORECASE)
    t = re.sub(r'\bwant to\b', 'wanna', t, flags=re.IGNORECASE)
    t = re.sub(r'\bgoing to\b', 'gonna', t, flags=re.IGNORECASE)
    t = re.sub(r'\bgot to\b', 'gotta', t, flags=re.IGNORECASE)
    t = re.sub(r'\bhave to\b', 'hafta', t, flags=re.IGNORECASE)
    t = re.sub(r'\bLet me\b', 'Lemme', t)
    t = re.sub(r'\blet me\b', 'lemme', t)
    return t

async def generate_file(text, out_file, voice, rate, sem, edge_bin):
    async with sem:
        if os.path.exists(out_file) and os.path.getsize(out_file) > 500:
            return True, out_file, "already exists"
        cmd = [
            edge_bin,
            "--voice", voice,
            "--rate", rate,
            "--text", text,
            "--write-media", out_file
        ]
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await proc.communicate()
        if proc.returncode == 0:
            return True, out_file, "created"
        else:
            return False, out_file, stderr.decode().strip()

async def main():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    out_dir = os.path.join(base_dir, "audio")
    os.makedirs(out_dir, exist_ok=True)
    edge_bin = "/Users/gaku/Library/Python/3.9/bin/edge-tts"
    if not os.path.exists(edge_bin):
        edge_bin = "edge-tts"

    # 1. Output grit patterns to JSON for data.js insertion
    json_path = os.path.join(base_dir, "scripts", "grit_patterns.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(GRIT_PATTERNS, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(GRIT_PATTERNS)} GRIT patterns to {json_path}")

    # 2. Build list of all 90 sentences
    items = []
    for p in GRIT_PATTERNS:
        for i, ex in enumerate(p["examples"]):
            cid = f"grit-{p['id']}-{i}"
            items.append({
                "id": cid,
                "en": ex["en"],
                "ja": ex["ja"]
            })
    print(f"Total GRIT cards: {len(items)}")

    # 3. Generate 90 English MP3s (en-US-BrianNeural, +8%, spoken reductions)
    sem = asyncio.Semaphore(6)
    en_tasks = []
    for item in items:
        out_en = os.path.join(out_dir, f"{item['id']}.mp3")
        spoken_en = to_spoken(item["en"])
        en_tasks.append(generate_file(spoken_en, out_en, "en-US-BrianNeural", "+8%", sem, edge_bin))

    print("Generating 90 English conversational audio files...")
    for f in asyncio.as_completed(en_tasks):
        ok, path, status = await f
        if not ok:
            print(f"✕ EN Error: {path} - {status}")

    # 4. Generate 90 Japanese MP3s (ja-JP-NanamiNeural, +0%)
    ja_tasks = []
    for item in items:
        out_ja = os.path.join(out_dir, f"{item['id']}_ja.mp3")
        clean_ja = item["ja"].replace('"', '').strip()
        ja_tasks.append(generate_file(clean_ja, out_ja, "ja-JP-NanamiNeural", "+0%", sem, edge_bin))

    print("Generating 90 Japanese narrator audio files...")
    for f in asyncio.as_completed(ja_tasks):
        ok, path, status = await f
        if not ok:
            print(f"✕ JA Error: {path} - {status}")

    print("\nAll 180 GRIT audio files generated successfully!")

if __name__ == "__main__":
    asyncio.run(main())
