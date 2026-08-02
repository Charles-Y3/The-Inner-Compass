import type { Level } from './types';
import { localized } from '../i18n/types';

// Consolidates what used to be two duplicated, drifting copies of this
// content (LevelsIntroPage.js's `levels` array and ResultsPage.js's
// `levelMap`), and recovers the `stage` field, which existed only as a
// commented-out line in the original `levels` array and was never
// rendered anywhere.
//
// English is a faithful *adaptation*, not a literal translation — same
// meaning, same arc, tradition-neutral register, so a reader with no
// Yiguandao background can answer honestly. Chinese is authored text and
// stays exactly as written; see docs/AUTHORING.md for the glossary.
//
// `weight` is this level's intended share of respondents (see
// data/quiz.ts for how weights become score bands) — deliberately skewed,
// not equal: most people sit in the early/middle stages, and true
// realisation is meant to be rare. The `band` values below are derived
// from these weights via `computeBands()`; if you change a weight, run
// that function again and update the bands here to match, rather than
// hand-editing the numbers out of sync with the weights.

export const LEVELS: Level[] = [
  {
    id: 'adrift',
    order: 1,
    name: localized('Adrift', '茫然生存'),
    stage: localized('Mundane being — unaware', '凡俗者（未覺階段）'),
    description: localized(
      "Desire, emotion, and habit are still pulling you along, and the deeper nature of life hasn't come into focus yet. It can feel like walking through fog, unsure which way is forward. There's real potential here — awareness just hasn't switched on yet. Noticing the patterns that pull you is the first step toward waking up.",
      '你仍深受慾望、情緒與習慣牽引，對生命的本質缺乏覺察。生活如同行走在霧中，方向感模糊。這個階段的你，其實充滿潛力，只是意識還未覺醒。認清自己被牽引的模式，是覺醒的第一步。',
    ),
    encouragement: localized(
      "Try watching your own thoughts and feelings each day — even a one-minute pause can start to build awareness. Ask yourself, \"why am I here?\" and let an inner center form gradually.",
      '試著每天觀照自己的念頭與情緒，即使只是一分鐘的停頓，也能開始覺察。問自己：「我為何而來？」逐步建立內在中心。',
    ),
    weight: 0.22,
    band: { min: 9, max: 16 },
  },
  {
    id: 'troubled',
    order: 2,
    name: localized('Troubled', '苦惱困惑'),
    stage: localized('Mundane being — lost', '凡俗者（迷茫階段）'),
    description: localized(
      "You've started to notice a kind of emptiness and confusion — real questions about life are surfacing, even if a steady direction hasn't arrived yet. Restlessness and dissatisfaction show up often. That confusion is actually a signal, telling you it's time to explore and grow. You're beginning to sense that everyday life alone can't answer your deeper needs.",
      '你已開始覺察空虛與困惑，對人生產生疑問，但仍未找到穩固的方向。內心常有迷惘與不滿。困惑是靈性的訊號，提醒你需要探索和成長。你開始意識到現實生活無法滿足內心深層需求。',
    ),
    encouragement: localized(
      'Stay curious. Try philosophy, religion, psychology, or books on inner life, and start exploring what life means to you. Write your questions down, and talk them through with someone you trust — let outward searching turn into inward reflection.',
      '保持好奇心，嘗試接觸哲學、宗教、心理學或靈修書籍，開始探索生命的意義。把疑問寫下，並與值得信任的人交流，將外在探索轉為內在反思。',
    ),
    weight: 0.24,
    band: { min: 17, max: 25 },
  },
  {
    id: 'seeking',
    order: 3,
    name: localized('Seeking', '尋求探索'),
    stage: localized('Mundane being — searching', '凡俗者（探求階段）'),
    description: localized(
      "You're actively searching now — trying different methods and ideas, paying real attention to meaning and self for the first time. This is a period of gathering knowledge and experience, though it still leans outward. Remember: wisdom doesn't live only in books and teachers, it's in daily life too.",
      '你開始積極尋找智慧，接觸各種方法與思想，對生命意義與自我有初步關注。此階段是知識與經驗的積累期，但仍偏向外求。智慧不僅在書本與老師，也在日常生活中。',
    ),
    encouragement: localized(
      "Turn what you learn into everyday observation — try looking at your difficulties and relationships from a new angle. Practice watching yourself and reflecting inward, so the wisdom you've gathered from outside slowly becomes your own.",
      '將所學轉化為生活觀察，試著用新的視角看待困難與關係。練習自我觀照與內心反思，逐漸讓外求的智慧內化。',
    ),
    weight: 0.20,
    band: { min: 26, max: 32 },
  },
  {
    id: 'awakening',
    order: 4,
    name: localized('Awakening', '初悟覺醒'),
    stage: localized('Cultivator — beginning', '修行者（入門階段）'),
    description: localized(
      "You've had glimpses of clarity and ease, and ideas like \"suffering comes from attachment\" are starting to make real sense — though it isn't steady yet. This is the early bud of spiritual awakening: brief insight breaking through, like morning light through the dark. The real work now is turning that insight into something that lasts.",
      '你已偶爾體驗到清明與輕安，開始理解「痛苦來自執著」等原理，但穩定性尚不足。這是靈性覺醒的萌芽期，短暫的領悟如晨光穿透黑夜。真正的挑戰是將領悟持續化，成為生活常態。',
    ),
    encouragement: localized(
      'Practice everyday self-awareness — treat every feeling, thought, and decision as a chance to practice. Build small daily habits: reading the classics and the sages, keeping a reflection journal, a little quiet sitting — let the awakening settle in slowly.',
      '練習日常自我覺察，將每個情緒、念頭、決定都當作修行的契機。建立日常小習慣，例如多讀聖賢典籍、反思日記、簡單冥想，讓覺醒慢慢鞏固。',
    ),
    weight: 0.16,
    band: { min: 33, max: 38 },
  },
  {
    id: 'transforming',
    order: 5,
    name: localized('Transforming', '轉化蛻變'),
    stage: localized('Cultivator — practicing', '修行者（實踐階段）'),
    description: localized(
      "Your awareness is showing up in how you actually act, day to day. Emotion no longer runs the show quite the way it used to — something in you is genuinely changing. This is the leap from knowledge to wisdom, from knowing to doing. You're living more intentionally, and handling relationships and hard moments with more ease.",
      '你的覺察已能落實到日常行為中，情緒逐漸不再掌控你，你的內在正在轉化。這是由知識到智慧的跨越，從「知道」到「做到」。你開始用心生活，處理關係與困境更有從容。',
    ),
    encouragement: localized(
      "Keep practicing patience and compassion until wisdom becomes your natural response, not something you have to force. When a challenge comes, watch your own mind, and treat the difficulty itself as material for practice.",
      '持續練習包容與慈悲，將智慧化作自然的反應，而非刻意。遇到挑戰時，觀照自己心念，將困境視為修行材料。',
    ),
    weight: 0.10,
    band: { min: 39, max: 42 },
  },
  {
    id: 'transcending',
    order: 6,
    name: localized('Transcending', '超越通達'),
    stage: localized('Cultivator — transcending', '修行者（超脫階段）'),
    description: localized(
      "Good times and hard times both meet you at ease now — your mind stays open, wisdom and compassion move together, and your actions and inner life line up. This stage sits close to completion, though there's still deeper room to move beyond self-centeredness. Real freedom is a mind that isn't fixed on anything — flowing with circumstance instead of gripping it.",
      '你已能順境逆境皆安，心境自在，包容萬事，智慧與慈悲並行。行動與內心高度統一。這階段已非常接近圓滿，但仍可更深地超越自我中心。真正的自由在於「無所住而生其心」，隨緣而不執著。',
    ),
    encouragement: localized(
      "Stay humble, and let what you've learned flow back out to others. Keep watching your own mind, so praise and blame, gain and loss, stop pulling you around — let compassion and wisdom show up on their own.",
      '保持謙卑，將智慧回饋於人群。練習隨時觀照心念，不被榮辱得失牽動，讓慈悲與智慧自然流露。',
    ),
    weight: 0.05,
    band: { min: 43, max: 44 },
  },
  {
    id: 'union',
    order: 7,
    name: localized('True Oneness', '覺悟合一'),
    stage: localized('Enlightened being — complete', '開悟者（圓滿階段）'),
    description: localized(
      'Mind and true nature have met — you and the larger whole are no longer two separate things. You move through the world helping yourself and others as circumstance allows, unattached, unobstructed. This is the complete stage: every action, feeling, and thought naturally carries wisdom and compassion.',
      '你已明心見性，心靈與宇宙本然合一，隨緣度己度人，不著世間，自在無礙。此為圓滿境界，所有行為、情緒、念頭皆自然顯現智慧與慈悲。',
    ),
    encouragement: localized(
      "Keep the beginner's heart. Let this awakening show up as ordinary compassion and wisdom, nothing more. Stay steady even when the world is loud. Keep walking alongside others and guiding them — let this awakening become a light for someone else, too.",
      '保持初心，把覺悟化作平凡中的慈悲與智慧。即使世界紛亂，也能安然。持續陪伴與引導他人，讓覺悟成為光照。',
    ),
    weight: 0.03,
    band: { min: 45, max: 45 },
  },
];
