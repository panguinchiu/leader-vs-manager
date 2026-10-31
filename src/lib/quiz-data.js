export const QUESTIONS = [
  {
    id: 1,
    dimension: '個性面向',
    dimKey: 'personality',
    text: '面對一個從未嘗試過的全新商業模式，你的第一反應是？',
    options: [
      { text: '先研究同業案例、評估風險、建立可行的執行計畫再決定。', score: { leader: 1, manager: 4 } },
      { text: '內心燃起興奮感，開始想像成功後的樣貌，迫不及待想試試。', score: { leader: 4, manager: 1 } },
      { text: '找幾個信任的人討論，看看大家的看法後再做判斷。', score: { leader: 2, manager: 3 } },
      { text: '直覺告訴我值得一試，但我會同時設計退場機制。', score: { leader: 3, manager: 2 } },
    ],
  },
  {
    id: 2,
    dimension: '個性面向',
    dimKey: 'personality',
    text: '你最害怕的工作情境是：',
    options: [
      { text: '組織陷入混亂，沒有明確的流程和權責劃分。', score: { leader: 1, manager: 4 } },
      { text: '每天重複一樣的事，看不到任何突破或改變的可能。', score: { leader: 4, manager: 1 } },
      { text: '團隊士氣低迷，但制度上一切運作正常。', score: { leader: 3, manager: 2 } },
      { text: '自己做出了決策卻沒有足夠的數據佐證。', score: { leader: 2, manager: 3 } },
    ],
  },
  {
    id: 3,
    dimension: '目標追求',
    dimKey: 'goals',
    text: '公司需要設定下一年度目標時，你的切入方式是？',
    options: [
      { text: '分析過去數據、參考市場趨勢，設定務實可達成的目標。', score: { leader: 1, manager: 4 } },
      { text: '先描繪三年後的願景圖像，再反推今年該做什麼。', score: { leader: 4, manager: 1 } },
      { text: '從客戶未被滿足的需求出發，找出別人還沒看見的機會。', score: { leader: 4, manager: 1 } },
      { text: '和各部門溝通，整合大家的想法後訂出平衡的目標。', score: { leader: 1, manager: 4 } },
    ],
  },
  {
    id: 4,
    dimension: '目標追求',
    dimKey: 'goals',
    text: '當你在會議中提出一個大膽想法卻遭到質疑時，你通常會：',
    options: [
      { text: '重新包裝論述方式，用數據和邏輯讓反對者信服。', score: { leader: 2, manager: 3 } },
      { text: '用故事和願景激發在場人的想像力，改變他們看問題的角度。', score: { leader: 4, manager: 1 } },
      { text: '暫時退讓，在私下一對一溝通中逐步說服關鍵人物。', score: { leader: 2, manager: 3 } },
      { text: '妥協調整方案，找到各方都能接受的版本。', score: { leader: 1, manager: 4 } },
    ],
  },
  {
    id: 5,
    dimension: '工作方式',
    dimKey: 'work',
    text: '團隊中兩位核心成員發生嚴重意見衝突，你會怎麼處理？',
    options: [
      { text: '分別了解雙方立場，設計一個流程讓衝突轉化為建設性討論。', score: { leader: 2, manager: 4 } },
      { text: '直接介入，清楚表達我認為對的方向，讓團隊跟著走。', score: { leader: 4, manager: 1 } },
      { text: '引導他們看到更高層次的共同目標，讓衝突自然化解。', score: { leader: 3, manager: 2 } },
      { text: '調整組織架構或分工，從制度面消除衝突的根源。', score: { leader: 1, manager: 4 } },
    ],
  },
  {
    id: 6,
    dimension: '工作方式',
    dimKey: 'work',
    text: '你做重大決策時，最依賴的是什麼？',
    options: [
      { text: '完整的數據分析和風險評估報告。', score: { leader: 1, manager: 4 } },
      { text: '過去的成功經驗和直覺判斷。', score: { leader: 3, manager: 2 } },
      { text: '對趨勢的深層洞察和對未來的想像。', score: { leader: 4, manager: 1 } },
      { text: '團隊的共識和利害關係人的意見。', score: { leader: 1, manager: 4 } },
    ],
  },
  {
    id: 7,
    dimension: '人際關係',
    dimKey: 'relationship',
    text: '一位你很器重的部屬告訴你，他覺得目前的工作沒有意義。你的反應是：',
    options: [
      { text: '和他一起重新檢視職涯路徑，在現有框架內找到更適合他的角色。', score: { leader: 2, manager: 3 } },
      { text: '和他分享你對公司未來的熱情和願景，讓他重新找到參與感。', score: { leader: 4, manager: 1 } },
      { text: '深入了解他的感受和內心渴望，即使談話過程令人不舒服。', score: { leader: 4, manager: 1 } },
      { text: '提供具體的績效指標和成長目標，讓他有明確的方向。', score: { leader: 1, manager: 4 } },
    ],
  },
  {
    id: 8,
    dimension: '人際關係',
    dimKey: 'relationship',
    text: '你對「辦公室政治」的態度是？',
    options: [
      { text: '這是人性，理解並善用它是成熟管理者的必備技能。', score: { leader: 1, manager: 4 } },
      { text: '盡量避免，我更願意用真誠和願景感召來帶團隊。', score: { leader: 4, manager: 1 } },
      { text: '我知道它存在但不太擅長，通常靠專業實力說話。', score: { leader: 3, manager: 2 } },
      { text: '很反感，我希望建立一個透明且公平的制度來取代它。', score: { leader: 2, manager: 3 } },
    ],
  },
  {
    id: 9,
    dimension: '自我意識',
    dimKey: 'identity',
    text: '回顧你的職涯，你覺得哪一段經歷對你影響最深？',
    options: [
      { text: '在穩定的組織中一步步晉升，學會了制度運作的精髓。', score: { leader: 1, manager: 4 } },
      { text: '一次重大的失敗或挫折，徹底改變了我看待世界的方式。', score: { leader: 4, manager: 1 } },
      { text: '遇到一位改變我人生方向的導師或貴人。', score: { leader: 4, manager: 1 } },
      { text: '帶領團隊完成了一個極具挑戰性的專案。', score: { leader: 2, manager: 3 } },
    ],
  },
  {
    id: 10,
    dimension: '自我意識',
    dimKey: 'identity',
    text: '如果明天就能實現一個願望，你會選擇：',
    options: [
      { text: '成為一家百年企業的CEO，讓組織持續穩定成長。', score: { leader: 1, manager: 4 } },
      { text: '創造一個改變產業規則的產品或服務。', score: { leader: 4, manager: 1 } },
      { text: '培養出十個比我更優秀的人才。', score: { leader: 3, manager: 2 } },
      { text: '打造一個前所未有的組織文化，讓每個人都能發揮潛力。', score: { leader: 3, manager: 2 } },
    ],
  },
];

export const PERSONAS = {
  strongLeader: {
    key: 'strongLeader',
    type: 'leader',
    label: '願景型領導人',
    title: '你是天生的願景塑造者',
    description: `你擁有強烈的未來導向思維，能夠在混沌中看見秩序，在不確定中找到方向。你不只是在管理現有的資源，而是在創造一個尚未存在的未來。你的熱情具有感染力，能夠讓周圍的人相信那個遙遠但值得追求的目標。

你的核心優勢在於能夠設定大膽的願景並凝聚人心。你對現狀有著天生的不滿足感，這種不安分驅使你不斷突破邊界。你相信「不可能」只是「尚未實現」的另一種說法。

在 MBTI 的框架下，你的特質接近 ENTJ 或 ENTP——直覺型、外向型，充滿能量且善於戰略思考。`,
    mbti: '你的特質接近 ENTJ／ENTP，直覺導向，熱愛大戰略，不耐煩細節。',
    personaName: 'Steve Jobs（史蒂夫·賈伯斯）',
    personaRole: 'Apple 共同創辦人',
    personaEmoji: '🍎',
    personaQuote: '你不能只是問顧客要什麼然後給他們——等你做出來的時候，他們又想要別的東西了。',
    roastTitle: '你就是公司的天花板',
    roastIcon: 'pikmin-red',
    roastBody: '恭喜你，全公司最會畫大餅的人就是你。你的願景比公司的現金流還要遠大，你的夢想比部屬的加班時數還要多。每次開會你都在說「想像一下三年後⋯⋯」，但你連下週的週報都沒交。團隊不是不懂你的願景，是怕你又改主意。你就像紅色皮克敏——衝最快、打最猛，但常常衝到一半才發現方向錯了，後面一整排人已經跟著你跳崖了。',
  },
  leanLeader: {
    key: 'leanLeader',
    type: 'leader',
    label: '創新型領導人',
    title: '你是兼具務實的變革推動者',
    description: `你兼具領導人的遠見與經理人的執行力，能夠在夢想與現實之間找到最佳的平衡點。你不是純粹的空想家，而是那種能夠把大膽想法轉化為可執行計畫的罕見人才。

你善於整合不同的觀點，既能激發團隊的創造力，又能在需要時提供明確的方向。你對風險有著獨特的直覺——知道哪些賭注值得下，哪些風險必須規避。

在 MBTI 的框架下，你的特質接近 INTJ 或 ENTP——策略性思考，善於看見系統性機會，同時保有行動力。`,
    mbti: '你的特質接近 INTJ／ENTP，策略思考者，既有遠見又有執行魄力。',
    personaName: 'Elon Musk（伊隆·馬斯克）',
    personaRole: 'Tesla / SpaceX 創辦人',
    personaEmoji: '🚀',
    personaQuote: '當某件事夠重要的時候，即使勝算不站在你這邊，你還是得去做。',
    roastTitle: '自以為務實的妄想家',
    roastIcon: 'pikmin-yellow',
    roastBody: '你是那種一邊說「我很務實」一邊提出要用 AI 取代整個部門的人。你覺得自己是馬斯克，但你的員工覺得你是每天改需求的甲方。你最大的才能是讓所有人都覺得你「好像很有道理」，然後在三個月後大家才發現你根本沒想過細節。你就像黃色皮克敏——號稱耐電擊，其實只是被電太多次已經麻了，還以為自己是天選之人。',
  },
  balanced: {
    key: 'balanced',
    type: 'leader',
    label: '雙棲型人才',
    title: '你是稀有的領導─管理混合體',
    description: `你是組織中最難得的人才類型。你能夠在「領導」與「管理」兩種模式之間靈活切換，根據情境選擇最適合的策略。你既能設定令人振奮的目標，也能建立讓目標落地的系統。

你的平衡感來自於對人性的深刻理解。你知道什麼時候需要激勵人心，什麼時候需要建立紀律。你的同理心讓你能夠理解不同類型的人，並根據他們的特質調整你的領導風格。

在 MBTI 的框架下，你的特質接近 ENFJ 或 INTJ——同時具備戰略眼光與人際敏感度，能夠兼顧長遠目標與當下執行。`,
    mbti: '你的特質接近 ENFJ／INTJ，兼具戰略眼光與人際影響力，是天生的協調者。',
    personaName: 'Satya Nadella（薩蒂亞·納德拉）',
    personaRole: 'Microsoft CEO',
    personaEmoji: '☁️',
    personaQuote: '領導力是從你不知道答案的地方開始的，而不是從你有一切答案的地方開始的。',
    roastTitle: '什麼都會但什麼都不精的萬金油',
    roastIcon: 'pikmin-blue',
    roastBody: '你就是那個在會議上永遠說「兩邊都有道理」的人。創業家覺得你太保守，經理人覺得你太衝動，結果你完美地讓所有人都不滿意。你最愛的一句話是「要看情況」，最擅長的技能是「兩邊押注」。你覺得自己是納德拉，但你的同事覺得你只是選擇障礙。你就像藍色皮克敏——水裡可以、陸上也行，但說到最強項⋯⋯你的最強項就是「不會溺死」。恭喜。',
  },
  leanManager: {
    key: 'leanManager',
    type: 'manager',
    label: '策略型經理人',
    title: '你是高效能的系統架構師',
    description: `你擅長將複雜的問題轉化為清晰的系統和流程。你的價值不在於創造願景，而在於確保願景能夠被可靠地實現。你是那種能夠讓組織高速運轉的引擎。

你對細節的關注和對流程的熱愛，讓你能夠在規模化的挑戰中游刃有餘。你相信「好的系統比好的人才更重要」，因為系統可以複製，而天才無法複製。

在 MBTI 的框架下，你的特質接近 ISTJ 或 ESTJ——務實、可靠、重視秩序，善於優化現有系統而非創造全新範式。`,
    mbti: '你的特質接近 ISTJ／ESTJ，務實可靠，擅長優化系統，是組織的穩定核心。',
    personaName: 'Tim Cook（提姆·庫克）',
    personaRole: 'Apple CEO',
    personaEmoji: '⚙️',
    personaQuote: '我們相信我們必須擁有並掌控讓我們能夠提供絕佳使用者體驗的核心技術。',
    roastTitle: '把別人的創意優化到死的工具人',
    roastIcon: 'pikmin-purple',
    roastBody: '你是那種收到一個天才的創意後，會花三週做出一份 47 頁的可行性分析報告，然後得出結論「風險過高，建議暫緩」的人。你的 Excel 比你的人際關係還豐富，你的甘特圖比你的人生規劃還精確。每次有人提出新想法，你的第一反應永遠是「那 KPI 怎麼設？」你就像紫色皮克敏——力氣最大、最能扛，但永遠是被別人丟出去的那一個。你不是沒有夢想，你只是把夢想排進了 Q4。',
  },
  strongManager: {
    key: 'strongManager',
    type: 'manager',
    label: '秩序型經理人',
    title: '你是組織穩定的基石',
    description: `你是組織中不可或缺的穩定力量。在充滿變數的商業環境中，你是那個確保日常運作不出差錯的人。你的嚴謹和對制度的尊重，讓組織能夠在混亂中保持秩序。

你相信可預測性和一致性是組織成功的基石。你建立的制度和流程，往往能夠支撐組織在創辦人離開後繼續運作多年。你的價值在於長期的可靠性，而非短期的光彩。

在 MBTI 的框架下，你的特質接近 ISTJ 或 ISFJ——高度盡責，重視傳統和規則，是組織中最值得信賴的執行者。`,
    mbti: '你的特質接近 ISTJ／ISFJ，高度盡責，是讓組織長治久安的關鍵人物。',
    personaName: 'Alfred P. Sloan（阿爾弗雷德·史隆）',
    personaRole: '通用汽車傳奇CEO',
    personaEmoji: '🏛️',
    personaQuote: '管理的關鍵不在於做出英雄式的決策，而在於建立一個能持續做出好決策的系統。',
    roastTitle: '企業前進的精裝版絆腳石',
    roastIcon: 'pikmin-white',
    roastBody: '你把「維持現狀」包裝成「穩健經營」的能力真的是一絕。公司在你的管理下絕對不會倒——因為它根本不會動。你最有創意的時刻，大概就是把去年的計畫書改個日期重新交上去。你的口頭禪是「之前都是這樣做的」，你的人生信條是「如果沒壞就不要修」。你就像白色皮克敏——可以挖出埋在地下的寶物，但問題是你自己就是那個把創新埋進地下的人。全公司的 SOP 都是你寫的，包括「如何撰寫 SOP 的 SOP」。',
  },
};

export function getPersona(leaderScore, managerScore) {
  const total = leaderScore + managerScore;
  const leaderPct = total > 0 ? Math.round((leaderScore / total) * 100) : 50;

  if (leaderPct >= 65) return { ...PERSONAS.strongLeader, leaderPct };
  if (leaderPct >= 55) return { ...PERSONAS.leanLeader, leaderPct };
  if (leaderPct >= 45) return { ...PERSONAS.balanced, leaderPct };
  if (leaderPct >= 35) return { ...PERSONAS.leanManager, leaderPct };
  return { ...PERSONAS.strongManager, leaderPct };
}

export const DIMENSION_LABELS = {
  personality: '個性面向',
  goals: '目標追求',
  work: '工作方式',
  relationship: '人際關係',
  identity: '自我意識',
};
