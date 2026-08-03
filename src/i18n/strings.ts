import { localized, type Localized } from './types';

// UI chrome strings — never write a raw string literal into JSX in this
// app; add a key here and read it through t() instead.
export const UI: Record<string, Localized<string>> = {
  appName: localized('The Inner Compass', '內在羅盤'),
  appTagline: localized('A quiet check-in on where your practice stands today.', '安靜地檢視你今日的修行所在。'),

  langGate_en: localized('English', 'English'),
  langGate_zhHant: localized('繁體中文', '繁體中文'),
  langGate_zhHans: localized('简体中文', '简体中文'),

  nav_settings: localized('Settings', '設定'),
  settings_language: localized('Language', '語言'),
  settings_theme: localized('Theme', '主題'),
  settings_theme_dawn: localized('Dawn', '晨'),
  settings_theme_dusk: localized('Dusk', '暮'),
  settings_theme_night: localized('Night', '夜'),
  settings_reset: localized('Start over', '重新開始'),
  settings_close: localized('Close', '關閉'),
  settings_app: localized('App', '應用程式'),
  settings_install: localized('Install app', '安裝應用程式'),
  settings_install_done: localized('Installed as an app.', '已安裝為應用程式。'),
  settings_install_ios: localized(
    'In Safari, tap Share → Add to Home Screen to install.',
    '在 Safari 中點擊「分享」→「加入主畫面」即可安裝。',
  ),
  settings_install_unavailable: localized(
    "Install isn't available in this browser yet.",
    '此瀏覽器目前無法安裝。',
  ),
  settings_offline_ready: localized('✓ Ready to work offline', '✓ 已可離線使用'),
  settings_offline_pending: localized('Not yet cached for offline use', '尚未完成離線快取'),
  update_available: localized('A new version of The Inner Compass is ready.', '內在羅盤有新版本可用。'),
  update_reload: localized('Reload to update', '重新載入以更新'),
  update_later: localized('Later', '稍後'),

  intro_title: localized('The Inner Compass', '內在羅盤'),
  intro_body: localized(
    'This is a quiet space to reflect on yourself and understand your inner life more deeply — how you meet joy and hardship, how you treat others, and where your practice stands today. Nine scenes from life guide you: in each, you choose a style among the five animals — dragon, phoenix, qilin, tiger, turtle — then how deep that response runs. You will see your stage of cultivation and your five-element bearing. Optionally leave a few honest words. There is no ranking here, only a mirror; return when a month or a season has turned.',
    '這裡是安靜自省的空間，幫助你更深地認識自己——如何迎向順逆、如何待人，以及今日修行所在。九個生活場景引導你：每一幕先選五瑞之一的風格——龍、鳳、麒麟、虎、龜——再看那回應有多深。你會看見自己的修行階段與五行方位。也可留下幾句真心話。這裡沒有排名，只有鏡子；過了一個月或一季，再回來照一照即可。',
  ),
  intro_disclaimer: localized(
    '⚠️ This is a personal reflection tool, not a diagnosis, ranking, or fixed identity. Your stage and five-element bearing are a snapshot of today — a mirror for practice, not fate. Your answers stay on your own device and are never sent anywhere.',
    '⚠️ 免責聲明：這是一個自我反思的工具，並非診斷、排名，也不是固定的身分標籤。你的階段與五行方位是今日的一瞥——修行的鏡子，而非命運。你的答案只留存在你自己的裝置上，不會被傳送到任何地方。',
  ),
  intro_version: localized('Version {version}', '版本 {version}'),
  intro_start: localized('Begin', '開始'),
  intro_history: localized('Past check-ins', '過往檢視'),
  intro_daysSince: localized(
    'Your last check-in was {days} day(s) ago — return whenever the heart asks.',
    '你上次檢視是在 {days} 天前——心念想起時，隨時可以再來。',
  ),

  selfRate_prompt: localized('Before you begin, which stage do you think you are at?', '請先選擇您認為自己所處的層次。'),
  selfRate_continue: localized('Continue to the questions', '前往問題'),
  selfRate_required: localized('Please choose a stage first.', '請先選擇您認為自己所處的層次。'),

  questions_progress: localized('Question {current} of {total}', '第 {current} 題，共 {total} 題'),
  questions_back: localized('Back', '上一題'),
  questions_next: localized('Next', '下一題'),
  questions_finish: localized('See my result', '查看結果'),

  reflect_title: localized('A word from the heart', '心裡的話'),
  reflect_body: localized(
    'Optional — leave a few lines for your future self if you wish. These stay only on this device. You can skip and go straight to your result.',
    '可選——若願意，為未來的自己留下幾句話。這些字只留在這部裝置上。也可以略過，直接查看結果。',
  ),
  reflect_feelings: localized('What is on my heart right now? (optional)', '此刻心裡有什麼？（可選）'),
  reflect_feelings_placeholder: localized('Write freely…', '隨意寫下……'),
  reflect_improve: localized('What do I want to improve or tend? (optional)', '想改善或照顧什麼？（可選）'),
  reflect_improve_placeholder: localized('One or two things to tend…', '一兩件想照顧的事……'),
  reflect_continue: localized('See my result', '查看結果'),

  results_yourStage: localized('Your stage', '你的階段'),
  results_synthesis_title: localized('In summary', '總結'),

  // Summary clauses — composed as gap + stage + primary + tend (see lib/synthesis.ts)
  results_syn_gap_match: localized(
    'You named yourself {selfStageName}, and today’s questions landed on the same place — {stageName}.',
    '你自評為{selfStageName}，今日的回答也落在同一處——{stageName}。',
  ),
  results_syn_gap_under: localized(
    'You named yourself {selfStageName}, yet the questions point a step deeper — to {stageName}.',
    '你自評為{selfStageName}，而問題顯示的深度更進一層——{stageName}。',
  ),
  results_syn_gap_over: localized(
    'You named yourself {selfStageName}, while the questions show a gentler depth today — {stageName}.',
    '你自評為{selfStageName}，而問題顯示今日的深度更溫和——{stageName}。',
  ),

  results_syn_stage_early: localized(
    'At this early depth ({stage}), awareness is still forming; habit and fog often pull harder than intention.',
    '在此早期深度（{stage}），覺察仍在成形，習慣與迷霧常比意向更有力。',
  ),
  results_syn_stage_mid: localized(
    'At this mid depth ({stage}), practice is beginning to take root in how you actually live — not only in what you know.',
    '在此中期深度（{stage}），修行已開始落實於生活，而不只停留在所知。',
  ),
  results_syn_stage_late: localized(
    'At this late depth ({stage}), the mind can stay clearer through ease and hardship — maturity shows as steadiness, not a finished label.',
    '在此後期深度（{stage}），心較能於順逆中保持清明——成熟顯為安定，而非一個完成的標籤。',
  ),

  results_syn_primary_wood: localized(
    'Your five-element bearing leans to {animal} ({virtue}, {element}): kindness that expands is how this stage prefers to move.',
    '五行方位偏於{animal}（{virtue}・{element}）：仁慈擴展，是此階段慣於行走的方式。',
  ),
  results_syn_primary_fire: localized(
    'Your five-element bearing leans to {animal} ({virtue}, {element}): warm right-relation is how this stage prefers to move.',
    '五行方位偏於{animal}（{virtue}・{element}）：溫明得體，是此階段慣於行走的方式。',
  ),
  results_syn_primary_earth: localized(
    'Your five-element bearing leans to {animal} ({virtue}, {element}): steady trust and follow-through are how this stage prefers to move.',
    '五行方位偏於{animal}（{virtue}・{element}）：信實穩厚、言出能行，是此階段慣於行走的方式。',
  ),
  results_syn_primary_metal: localized(
    'Your five-element bearing leans to {animal} ({virtue}, {element}): clear courage and right boundaries are how this stage prefers to move.',
    '五行方位偏於{animal}（{virtue}・{element}）：義勇分明、界線清楚，是此階段慣於行走的方式。',
  ),
  results_syn_primary_water: localized(
    'Your five-element bearing leans to {animal} ({virtue}, {element}): quiet seeing and patient wisdom are how this stage prefers to move.',
    '五行方位偏於{animal}（{virtue}・{element}）：靜觀與耐得住的智慧，是此階段慣於行走的方式。',
  ),
  results_syn_primary_co: localized(
    'Your five-element bearing is shared between {animals} — two styles carrying the same depth today.',
    '五行方位由{animals}並列——兩種風格今日共同承載同一深度。',
  ),

  results_syn_tend_wood: localized(
    'The thinner direction is {tendAnimal} ({tendVirtue}): without a little more goodwill, even a strong {animal} lead can turn cold or self-enclosed — tend benevolence so depth has a way to meet others.',
    '較薄的方位是{tendAnimal}（{tendVirtue}）：若少了善意的流動，即便{animal}再強，也易顯冷淡或封閉——養護仁，使深度有路通向他人。',
  ),
  results_syn_tend_fire: localized(
    'The thinner direction is {tendAnimal} ({tendVirtue}): without fitting warmth, a strong {animal} lead can become brusque — tend propriety so depth keeps a humane shape.',
    '較薄的方位是{tendAnimal}（{tendVirtue}）：若缺合宜的溫明，即便{animal}再強，也易顯生硬——養護禮，使深度保有人情的形。',
  ),
  results_syn_tend_earth: localized(
    'The thinner direction is {tendAnimal} ({tendVirtue}): without steadier faith, a strong {animal} lead can drift from what was promised — tend trust so depth lands in ordinary life.',
    '較薄的方位是{tendAnimal}（{tendVirtue}）：若信實不穩，即便{animal}再強，也易與承諾脫節——養護信，使深度落實於平常。',
  ),
  results_syn_tend_metal: localized(
    'The thinner direction is {tendAnimal} ({tendVirtue}): without clearer righteousness, a strong {animal} lead can soften past what is fair — tend courage and boundaries so depth can stand upright.',
    '較薄的方位是{tendAnimal}（{tendVirtue}）：若義界不清，即便{animal}再強，也易柔過了公平——養護義，使深度能直立。',
  ),
  results_syn_tend_water: localized(
    'The thinner direction is {tendAnimal} ({tendVirtue}): without quieter wisdom, a strong {animal} lead can rush past what needs seeing — tend patient clarity so depth does not outrun insight.',
    '較薄的方位是{tendAnimal}（{tendVirtue}）：若少了靜觀之智，即便{animal}再強，也易趕過該看見的——養護智，使深度不跑在覺察之前。',
  ),

  results_feedback_match: localized(
    'Your own sense of where you stand matches the result — a sign of clear self-awareness.',
    '你的自我評估與測驗結果一致，表明你對自己的覺悟層次有清晰認知。',
  ),
  results_feedback_low: localized(
    "You rated yourself lower than the result suggests. Stay humble, and keep practicing.",
    '你的自我評估偏低，實際覺悟層次比你想像的更高！保持謙遜並繼續修行。',
  ),
  results_feedback_high: localized(
    'You rated yourself higher than the result suggests — there may be more room to grow than expected. Keep noticing, and keep living it out.',
    '你的自我評估偏高，測驗結果顯示你尚有提升空間。請保持覺察與落實所知。',
  ),
  results_bearingTitle: localized("Today's five-element bearing", '今日五行方位'),
  results_bearingIntro: localized(
    'How the five elements and animals show up in the styles you chose today — a bearing of practice, not a fixed type.',
    '五行與五瑞在你今日所選風格中的顯現——是修行的方位，而非固定的性格標籤。',
  ),
  results_primary: localized('Primary: {stack}', '主方位：{stack}'),
  results_primary_co: localized('Co-primary: {animals}', '並列主方位：{animals}'),
  results_compass_label: localized('Compass of the five animals', '五瑞羅盤'),
  results_animal_primary: localized('{animal} — primary bearing', '{animal}——主方位'),
  results_animal_tend: localized('{animal} — thinnest; to cultivate', '{animal}——最薄，待養'),
  results_animal_strengths: localized('Good at', '所長'),
  results_animal_workOn: localized('Watch for (when strong)', '過強時宜留意'),
  results_animal_cultivate: localized('To cultivate', '可培養'),
  results_animal_whenThin: localized('When this is thin', '偏薄時的樣貌'),
  results_heartTitle: localized('Your note · {date}', '你的心語 · {date}'),
  results_heartFeelings: localized('On my heart', '心裡的話'),
  results_heartImprove: localized('To improve or tend', '想改善或照顧'),
  results_mirrorNote: localized(
    "This is a mirror, not a verdict — it shows where your practice stands, not who you are for good. It can move as your practice deepens. Return when a month or a season has turned.",
    '這是一面鏡子，並非定論——它照見的是你修行目前所在，而非你永遠如此。隨著修行深化，它也會隨之而變。過了一個月或一季，再回來照一照即可。',
  ),
  results_retry: localized('Take it again', '重新測試'),
  results_share: localized('Share', '分享'),
  results_shareCopied: localized('Link copied to clipboard.', '連結已複製到剪貼簿。'),
  results_shareSaved: localized('Image saved.', '圖片已保存。'),
  results_shareFailed: localized('Could not create the share image.', '無法建立分享圖片。'),
  results_history: localized('Past check-ins', '過往檢視'),
  results_noSession_title: localized("No result to show yet.", '無法取得測驗資料，請先完成測驗。'),
  results_noSession_cta: localized('Start the questions', '回去測驗'),

  history_title: localized('Past check-ins', '過往檢視'),
  history_empty: localized('No check-ins saved yet. Complete one, and it will appear here.', '尚無保存的檢視。完成一次後，就會出現在這裡。'),
  history_back: localized('Back', '返回'),
  history_open: localized('Open', '開啟'),
  history_stage: localized('Stage: {name}', '階段：{name}'),
  history_bearing: localized('Bearing: {animal} · {virtue}', '方位：{animal} · {virtue}'),
  history_detailTitle: localized('Check-in · {date}', '檢視 · {date}'),
  history_startNew: localized('Begin a new check-in', '開始新的檢視'),
  history_filterAll: localized('All dates', '全部日期'),
  history_filterClear: localized('Clear date filter', '清除日期篩選'),
  history_monthPrev: localized('Previous month', '上個月'),
  history_monthNext: localized('Next month', '下個月'),
  history_noOnDate: localized('No check-ins on this date.', '此日尚無檢視。'),
  history_calendarLabel: localized('Filter by date', '依日期篩選'),
};

export function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`));
}
