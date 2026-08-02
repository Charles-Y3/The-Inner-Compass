import type { Aspect } from './types';
import { localized } from '../i18n/types';

// Nine life aspects. Each pair: direction (five peer animal styles) then
// depth (maturity 1→5) on the same scene. English is a faithful adaptation;
// Chinese is authored ground truth.

export const ASPECTS: Aspect[] = [
  {
    id: 'criticism',
    direction: {
      id: 'criticism-dir',
      kind: 'direction',
      prompt: localized(
        'When someone criticizes you, what do you most naturally do?',
        '當有人批評你時，你最自然的反應是什麼？',
      ),
      options: [
        {
          bearingId: 'wood',
          label: localized(
            'Soften toward them; look for the hurt or need under the words',
            '心軟下來靠近對方，尋找話語底下的傷痛或需求',
          ),
        },
        {
          bearingId: 'fire',
          label: localized(
            'Respond with composure and proper respect, even if it stings',
            '即使刺痛，仍以鎮定與合宜的尊重回應',
          ),
        },
        {
          bearingId: 'earth',
          label: localized(
            "Stay steady; don't abandon what you know is true",
            '保持穩定，不放棄自己所知的真實',
          ),
        },
        {
          bearingId: 'metal',
          label: localized(
            'Sort fair from unfair and stand where justice is',
            '分辨公道與不公，站在正義的一邊',
          ),
        },
        {
          bearingId: 'water',
          label: localized(
            'Go quiet first; understand before you answer',
            '先安靜下來，想清楚再回答',
          ),
        },
      ],
    },
    depth: {
      id: 'criticism-depth',
      kind: 'depth',
      prompt: localized(
        'In that moment, how well can you stay clear instead of being ruled by hurt or pride?',
        '在那一刻，你能否保持清明，而不被受傷或自尊牽著走？',
      ),
      options: [
        { value: 1, label: localized('Almost always flooded — strike back or shut down', '幾乎總是被淹沒——反擊或封閉') },
        { value: 2, label: localized('Usually reactive; only rarely regain balance afterward', '大多反應激烈，事後少能找回平衡') },
        { value: 3, label: localized('Sometimes notice and adjust a little', '有時能覺察並稍微調整') },
        { value: 4, label: localized('Usually stay open enough to learn something', '大部分能保持開放，從中學習') },
        { value: 5, label: localized('Almost always steady — take what nourishes, release the rest', '幾乎總能平穩——取有益的，放下其餘') },
      ],
    },
  },
  {
    id: 'setback',
    direction: {
      id: 'setback-dir',
      kind: 'direction',
      prompt: localized(
        'When a real setback hits (failure, sudden hardship), what do you most naturally do?',
        '當真正的挫敗降臨（失敗、突如其來的困境），你最自然的做法是？',
      ),
      options: [
        {
          bearingId: 'wood',
          label: localized(
            "Reach for connection — don't face it alone; let care in",
            '尋求連結——不獨自硬撐，讓關懷進來',
          ),
        },
        {
          bearingId: 'fire',
          label: localized(
            "Keep dignity and orderly steps; don't fall apart in public or private form",
            '保持尊嚴與有序的步伐，不在人前或私底下潰散',
          ),
        },
        {
          bearingId: 'earth',
          label: localized(
            'Hold to your commitments; one steady next step',
            '守住承諾，踏穩下一步',
          ),
        },
        {
          bearingId: 'metal',
          label: localized(
            'Face it squarely; cut what must be cut and act',
            '正視它，該斷則斷，起身行動',
          ),
        },
        {
          bearingId: 'water',
          label: localized(
            'Withdraw into stillness until you see the pattern',
            '先退入安靜，直到看清其中的格局',
          ),
        },
      ],
    },
    depth: {
      id: 'setback-depth',
      kind: 'depth',
      prompt: localized(
        'Under setback, how well can you meet difficulty without collapsing or fleeing?',
        '面對挫敗時，你能否迎向困難，而不崩潰或逃避？',
      ),
      options: [
        { value: 1, label: localized('Easily knocked flat; hard to continue', '容易被擊倒，難以繼續') },
        { value: 2, label: localized('Often discouraged; occasional recovery', '常感沮喪，偶爾能恢復') },
        { value: 3, label: localized('Sometimes calm enough to work the problem', '有時能冷靜下來處理問題') },
        { value: 4, label: localized('Usually balanced and composed', '大部分能保持平衡與沉著') },
        { value: 5, label: localized('Almost always settled — hardship as path material', '幾乎總能安住——視困境為修行材料') },
      ],
    },
  },
  {
    id: 'help',
    direction: {
      id: 'help-dir',
      kind: 'direction',
      prompt: localized(
        'You see someone who needs help, but you are busy. What do you most naturally do?',
        '你看見有人需要幫助，但自己很忙。你最自然會怎麼做？',
      ),
      options: [
        {
          bearingId: 'wood',
          label: localized(
            'Feel with them and lean in with warmth if you can',
            '感同身受，若能便以溫暖靠近',
          ),
        },
        {
          bearingId: 'fire',
          label: localized(
            'Help in a fitting way — appropriate, not showy or chaotic',
            '以合宜的方式幫助——得體，不張揚也不混亂',
          ),
        },
        {
          bearingId: 'earth',
          label: localized(
            "Do what you said you would in life; help if it doesn't break trust elsewhere",
            '先守住對生活的承諾；若不損及其他信約，再伸出援手',
          ),
        },
        {
          bearingId: 'metal',
          label: localized(
            'Act on what is right to do, even if inconvenient',
            '做該做的事，即使不便',
          ),
        },
        {
          bearingId: 'water',
          label: localized(
            'Read the whole situation first — help that truly serves, or wisely not',
            '先看清全局——真正有益才幫，或明智地暫緩',
          ),
        },
      ],
    },
    depth: {
      id: 'help-depth',
      kind: 'depth',
      prompt: localized(
        'When help is needed, how free are you from indifference and from helping only for image?',
        '當有人需要幫助時，你能否免於冷漠，也不只為形象而幫忙？',
      ),
      options: [
        { value: 1, label: localized('Almost never involve yourself', '幾乎從不介入') },
        { value: 2, label: localized('Help rarely, often from mood or self-interest', '很少幫助，多半出於情緒或私利') },
        { value: 3, label: localized('Sometimes willing; it feels mixed', '有時願意，心態卻混雜') },
        { value: 4, label: localized('Usually offer real goodwill', '大部分能真心善意伸出手') },
        { value: 5, label: localized('Almost always help naturally, without bargaining', '幾乎總是自然幫忙，不求交換') },
      ],
    },
  },
  {
    id: 'fortune',
    direction: {
      id: 'fortune-dir',
      kind: 'direction',
      prompt: localized(
        'When life goes well — luck, praise, unexpected gain — what do you most naturally do?',
        '當生活順遂——好運、稱讚、意外所得——你最自然會怎麼做？',
      ),
      options: [
        {
          bearingId: 'wood',
          label: localized(
            'Share the warmth outward; let others in on the good',
            '把溫暖分享出去，讓他人也沾上這份好',
          ),
        },
        {
          bearingId: 'fire',
          label: localized(
            "Receive it with graceful thanks; don't swagger",
            '優雅感謝地領受，不張揚得意',
          ),
        },
        {
          bearingId: 'earth',
          label: localized(
            "Stay even; don't let success rewrite your word to yourself",
            '保持平穩，不讓成功改寫對自己的信約',
          ),
        },
        {
          bearingId: 'metal',
          label: localized(
            "Use the advantage cleanly; don't waste or cling in fear of loss",
            '乾淨地運用優勢，不浪費，也不因怕失去而緊抓',
          ),
        },
        {
          bearingId: 'water',
          label: localized(
            'Enjoy lightly; see how quickly conditions turn',
            '輕輕享受，看清境遇轉得有多快',
          ),
        },
      ],
    },
    depth: {
      id: 'fortune-depth',
      kind: 'depth',
      prompt: localized(
        'In good fortune, how well can you stay clear instead of getting drunk on it?',
        '在順境中，你能否保持清明，而不被衝昏頭？',
      ),
      options: [
        { value: 1, label: localized("Swept up; can't think straight", '完全沉醉，無法冷靜思考') },
        { value: 2, label: localized('Often overexcited; rare awareness', '常過度興奮，少有覺察') },
        { value: 3, label: localized('Sometimes enjoy it with a little perspective', '有時能享受並保有一點距離') },
        { value: 4, label: localized('Usually grateful and even-keeled', '大部分能感恩且心態平穩') },
        { value: 5, label: localized('Almost always steady — glad, not possessed', '幾乎總能平穩——歡喜而不被佔有') },
      ],
    },
  },
  {
    id: 'conflict',
    direction: {
      id: 'conflict-dir',
      kind: 'direction',
      prompt: localized(
        'In a sharp disagreement with someone close, what do you most naturally do?',
        '與親近的人激烈爭執時，你最自然會怎麼做？',
      ),
      options: [
        {
          bearingId: 'wood',
          label: localized(
            'Soften the gap; protect the relationship first',
            '柔化距離，先守護關係',
          ),
        },
        {
          bearingId: 'fire',
          label: localized(
            'Keep respectful speech and boundaries of conduct',
            '保持尊重的言辭與行為分寸',
          ),
        },
        {
          bearingId: 'earth',
          label: localized(
            "Stay true to what was agreed; don't twist for comfort",
            '忠於約定，不為舒服而扭曲',
          ),
        },
        {
          bearingId: 'metal',
          label: localized(
            'Name what is fair and unfair without flinching',
            '直說公道與不公，毫不退縮',
          ),
        },
        {
          bearingId: 'water',
          label: localized(
            'Slow the tempo; see both sides before pushing',
            '放慢節奏，看清雙方再推進',
          ),
        },
      ],
    },
    depth: {
      id: 'conflict-depth',
      kind: 'depth',
      prompt: localized(
        'In conflict, how well can you stay present without hatred or collapse?',
        '在衝突中，你能否安住當下，而不仇恨或崩潰？',
      ),
      options: [
        { value: 1, label: localized('Almost always attack or totally withdraw', '幾乎總是攻擊或徹底退縮') },
        { value: 2, label: localized('Mostly reactive; rare repair afterward', '大多情緒反應，事後少能修復') },
        { value: 3, label: localized('Sometimes listen and adjust', '有時能傾聽並調整') },
        { value: 4, label: localized('Usually firm and kind enough to stay in dialogue', '大部分能堅定又善意地維持對話') },
        { value: 5, label: localized('Almost always clear — truth and care together', '幾乎總能清明——真實與關懷並行') },
      ],
    },
  },
  {
    id: 'duty',
    direction: {
      id: 'duty-dir',
      kind: 'direction',
      prompt: localized(
        'Under work or responsibility pressure, what do you most naturally do?',
        '在工作或責任壓力下，你最自然會怎麼做？',
      ),
      options: [
        {
          bearingId: 'wood',
          label: localized(
            "Remember people matter more than the grind; don't harden",
            '記得人比勞役更重要，不讓心變硬',
          ),
        },
        {
          bearingId: 'fire',
          label: localized(
            'Keep rhythm and proper effort; finish with care for form',
            '保持節奏與合宜的用力，有禮有序地完成',
          ),
        },
        {
          bearingId: 'earth',
          label: localized(
            'Simply carry what you took on',
            '單純扛起自己接下的責任',
          ),
        },
        {
          bearingId: 'metal',
          label: localized(
            'Cut distraction; do the hard necessary thing',
            '切斷分心，做那件艱難卻必要的事',
          ),
        },
        {
          bearingId: 'water',
          label: localized(
            'Pace yourself; see what actually matters in the load',
            '調整步調，看清重擔裡什麼才真正重要',
          ),
        },
      ],
    },
    depth: {
      id: 'duty-depth',
      kind: 'depth',
      prompt: localized(
        'Under pressure, how well can you stay composed instead of complaining or escaping?',
        '在壓力下，你能否保持沉著，而不抱怨或逃避？',
      ),
      options: [
        { value: 1, label: localized('Quick to complain or avoid', '容易抱怨或逃避') },
        { value: 2, label: localized('Often anxious; duty done reluctantly', '常感焦慮，勉強完成責任') },
        { value: 3, label: localized('Sometimes calm and resourceful', '有時能冷靜且想辦法') },
        { value: 4, label: localized('Usually focused, not overwhelmed', '大部分能專注，不被壓垮') },
        { value: 5, label: localized('Almost always treat pressure as training', '幾乎總能視壓力為磨練') },
      ],
    },
  },
  {
    id: 'money',
    direction: {
      id: 'money-dir',
      kind: 'direction',
      prompt: localized(
        'Facing a money decision (spend, save, give, chase), what do you most naturally do?',
        '面對金錢抉擇（花、存、給、追）時，你最自然會怎麼做？',
      ),
      options: [
        {
          bearingId: 'wood',
          label: localized(
            'Lean toward generosity when someone is in need',
            '當有人有需要時，傾向慷慨',
          ),
        },
        {
          bearingId: 'fire',
          label: localized(
            'Handle it with clean, appropriate conduct — no mess, no show',
            '以乾淨合宜的方式處理——不混亂、不炫耀',
          ),
        },
        {
          bearingId: 'earth',
          label: localized(
            'Keep faith with budgets, debts, and promises',
            '守住預算、債務與承諾的信用',
          ),
        },
        {
          bearingId: 'metal',
          label: localized(
            'Choose what is upright — refuse greasy gain',
            '選擇正直之路——拒絕不潔之利',
          ),
        },
        {
          bearingId: 'water',
          label: localized(
            'See through craving; hold lightly',
            '看透貪求，輕輕持有',
          ),
        },
      ],
    },
    depth: {
      id: 'money-depth',
      kind: 'depth',
      prompt: localized(
        'Toward money, how free are you from greed and anxious clinging?',
        '對金錢，你能否免於貪婪與焦慮的緊抓？',
      ),
      options: [
        { value: 1, label: localized('Always craving or anxious', '總是貪求或焦慮') },
        { value: 2, label: localized('Often swayed by wanting more', '常被想要更多牽動') },
        { value: 3, label: localized('Sometimes reasonable; occasional excess', '有時理性，偶爾過度') },
        { value: 4, label: localized('Usually clear-headed, not seduced', '大部分頭腦清明，不被迷惑') },
        { value: 5, label: localized('Almost always at ease — use wisely, share freely', '幾乎總能心安——善用並樂於分享') },
      ],
    },
  },
  {
    id: 'intimacy',
    direction: {
      id: 'intimacy-dir',
      kind: 'direction',
      prompt: localized(
        'When someone close is hurting, what do you most naturally offer?',
        '當親近的人受傷時，你最自然會給予什麼？',
      ),
      options: [
        {
          bearingId: 'wood',
          label: localized(
            'Warm presence and kindness first',
            '先給溫暖的陪伴與善意',
          ),
        },
        {
          bearingId: 'fire',
          label: localized(
            'Attentive, respectful support — the right words and timing',
            '專心而尊重的支持——合宜的話語與時機',
          ),
        },
        {
          bearingId: 'earth',
          label: localized(
            'Reliable follow-through — show up when you said you would',
            '可靠的兌現——說到就做到地出現',
          ),
        },
        {
          bearingId: 'metal',
          label: localized(
            'Honest words that protect what is right, even if hard',
            '誠實的話，守護該守護的，即使難說',
          ),
        },
        {
          bearingId: 'water',
          label: localized(
            'Quiet space and listening until the truth of their pain is clear',
            '安靜的空間與傾聽，直到看清對方疼痛的真相',
          ),
        },
      ],
    },
    depth: {
      id: 'intimacy-depth',
      kind: 'depth',
      prompt: localized(
        'In intimacy, how well can you meet another without using them for your own comfort?',
        '在親密關係中，你能否真誠相遇，而不把對方當作自己的慰藉工具？',
      ),
      options: [
        { value: 1, label: localized('Mostly self-centered in close bonds', '在親近關係裡大多以自我為中心') },
        { value: 2, label: localized('Occasional care; often reactive or demanding', '偶爾關心，常反應激烈或需索') },
        { value: 3, label: localized('Sometimes patient and real', '有時能耐心且真實') },
        { value: 4, label: localized('Usually goodwill and respect', '大部分能善意與尊重') },
        { value: 5, label: localized('Almost always compassionate presence', '幾乎總能慈悲地臨在') },
      ],
    },
  },
  {
    id: 'ordinary',
    direction: {
      id: 'ordinary-dir',
      kind: 'direction',
      prompt: localized(
        'In a small, ordinary moment of the day, what do you most naturally lean on?',
        '在日常微小的片刻裡，你最自然倚靠的是什麼？',
      ),
      options: [
        {
          bearingId: 'wood',
          label: localized(
            'A soft heart toward whoever is nearby',
            '對身旁的人保持柔軟的心',
          ),
        },
        {
          bearingId: 'fire',
          label: localized(
            'Doing the small thing properly',
            '把小事也做得合宜',
          ),
        },
        {
          bearingId: 'earth',
          label: localized(
            "Being where you said you'd be; simple consistency",
            '身在自己說過會在的地方；簡單的一致',
          ),
        },
        {
          bearingId: 'metal',
          label: localized(
            "Not cutting corners on what's right, even when tiny",
            '即便微小，也不在正當之事上抄捷徑',
          ),
        },
        {
          bearingId: 'water',
          label: localized(
            'A short pause of awareness before the next move',
            '下一步前，短暫的覺察停頓',
          ),
        },
      ],
    },
    depth: {
      id: 'ordinary-depth',
      kind: 'depth',
      prompt: localized(
        'In ordinary moments, how often can you stay aware instead of lost on autopilot?',
        '在日常片刻中，你能否保持覺察，而不陷入自動化？',
      ),
      options: [
        { value: 1, label: localized('Almost always absent-minded', '幾乎總是漫不經心') },
        { value: 2, label: localized('Occasionally notice; easily lost again', '偶爾覺察，又容易迷失') },
        { value: 3, label: localized('Sometimes catch yourself and adjust', '有時能抓住自己並調整') },
        { value: 4, label: localized('Usually present through the day', '大部分能在一天中保持臨在') },
        { value: 5, label: localized("Almost always clear with whatever you're doing", '幾乎總能對當下所做保持清明') },
      ],
    },
  },
];

/** All depth question ids — used for stage scoring completeness checks. */
export const DEPTH_QUESTION_IDS = ASPECTS.map((a) => a.depth.id);
