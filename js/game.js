// 仮名の一覧
const Kanas = {
  'あ': ['a',], 'い': ['i',], 'う': ['u',], 'え': ['e',], 'お': ['o',],
  'か': ['ka',], 'き': ['ki',], 'く': ['ku',], 'け': ['ke',], 'こ': ['ko',],
  'さ': ['sa',], 'し': ['si', 'shi',], 'す': ['su',], 'せ': ['se',], 'そ': ['so',],
  'た': ['ta',], 'ち': ['ti', 'chi',], 'つ': ['tu', 'tsu',], 'て': ['te',], 'と': ['to',],
  'な': ['na',], 'に': ['ni',], 'ぬ': ['nu',], 'ね': ['ne',], 'の': ['no',],
  'は': ['ha',], 'ひ': ['hi',], 'ふ': ['hu', 'fu',], 'へ': ['he',], 'ほ': ['ho',],
  'ま': ['ma',], 'み': ['mi',], 'む': ['mu',], 'め': ['me',], 'も': ['mo',],
  'や': ['ya',], 'ゆ': ['yu',], 'よ': ['yo',],
  'ら': ['ra',], 'り': ['ri',], 'る': ['ru',], 'れ': ['re',], 'ろ': ['ro',],
  'わ': ['wa',], 'ゐ': ['wi',], 'ゑ': ['we',], 'を': ['wo',], 'ん': ['nn',],
  'が': ['ga',], 'ぎ': ['gi',], 'ぐ': ['gu',], 'げ': ['ge',], 'ご': ['go',],
  'ざ': ['za',], 'じ': ['ji', 'zi',], 'ず': ['zu',], 'ぜ': ['ze',], 'ぞ': ['zo',],
  'だ': ['da',], 'ぢ': ['di',], 'づ': ['du',], 'で': ['de',], 'ど': ['do',],
  'ば': ['ba',], 'び': ['bi',], 'ぶ': ['bu',], 'べ': ['be',], 'ぼ': ['bo',],
  'ぱ': ['pa',], 'ぴ': ['pi',], 'ぷ': ['pu',], 'ぺ': ['pe',], 'ぽ': ['po',],
  // 拗音
  'きゃ': ['kya',], 'きゅ': ['kyu',], 'きょ': ['kyo',],
  'しゃ': ['sya', 'sha',], 'しゅ': ['syu', 'shu',], 'しょ': ['syo', 'sho',],
  'ちゃ': ['tya', 'cha',], 'ちゅ': ['tyu', 'chu',], 'ちょ': ['tyo', 'cho',],
  'にゃ': ['nya',], 'にゅ': ['nyu',], 'にょ': ['nyo',],
  'ひゃ': ['hya',], 'ひゅ': ['hyu',], 'ひょ': ['hyo',],
  'ふぁ': ['fa',], 'ふぃ': ['fi',], 'ふゅ': ['fyu',], 'ふぇ': ['fe',], 'ふぉ': ['fo',],
  'みゃ': ['mya',], 'みゅ': ['myu',], 'みょ': ['myo',],
  'りゃ': ['rya',], 'りゅ': ['ryu',], 'りょ': ['ryo',],
  'ぎゃ': ['gya',], 'ぎゅ': ['gyu',], 'ぎょ': ['gyo',],
  'じゃ': ['ja', 'zya',], 'じゅ': ['ju', 'zyu',], 'じょ': ['jo', 'zyo',],
  'ぢゃ': ['dya',], 'ぢゅ': ['dyu',], 'ぢょ': ['dyo',],
  'びゃ': ['bya',], 'びゅ': ['byu',], 'びょ': ['byo',],
  'ぴゃ': ['pya',], 'ぴゅ': ['pyu',], 'ぴょ': ['pyo',],
  // 促音
  'っか': ['kka',], 'っき': ['kki',], 'っく': ['kku',], 'っけ': ['kke',], 'っこ': ['kko',],
  'っさ': ['ssa',], 'っし': ['sshi', 'ssi',], 'っす': ['ssu',], 'っせ': ['sse',], 'っそ': ['sso',],
  'った': ['tta',], 'っち': ['cchi', 'tti',], 'っつ': ['ttsu', 'ttu',], 'って': ['tte',], 'っと': ['tto',],
  'っな': ['nna',], 'っに': ['nni',], 'っぬ': ['nnu',], 'っね': ['nne',], 'っの': ['nno',],
  'っは': ['hha',], 'っひ': ['hhi',], 'っふ': ['hhu', 'ffu',], 'っへ': ['hhe',], 'っほ': ['hho',],
  'っま': ['mma',], 'っみ': ['mmi',], 'っむ': ['mmu',], 'っめ': ['mme',], 'っも': ['mmo',],
  'っや': ['yya',], 'っゆ': ['yyu',], 'っよ': ['yyo',],
  'っら': ['rra',], 'っり': ['rri',], 'っる': ['rru',], 'っれ': ['rre',], 'っろ': ['rro',],
  'っわ': ['wwa',], 'っゐ': ['wwi',], 'っゑ': ['wwe',], 'っを': ['wwo',], 'っん': ['nnn',],
  'っが': ['gga',], 'っぎ': ['ggi',], 'っぐ': ['ggu',], 'っげ': ['gge',], 'っご': ['ggo',],
  'っざ': ['zza',], 'っじ': ['jji', 'zzi',], 'っず': ['zzu',], 'っぜ': ['zze',], 'っぞ': ['zzo',],
  'っだ': ['dda',], 'っぢ': ['ddi',], 'っづ': ['ddu',], 'っで': ['dde',], 'っど': ['ddo',],
  'っば': ['bba',], 'っび': ['bbi',], 'っぶ': ['bbu',], 'っべ': ['bbe',], 'っぼ': ['bbo',],
  'っぱ': ['ppa',], 'っぴ': ['ppi',], 'っぷ': ['ppu',], 'っぺ': ['ppe',], 'っぽ': ['ppo',],
  // 促音 + 拗音
  'っきゃ': ['kkya',], 'っきゅ': ['kkyu',], 'っきょ': ['kkyo',],
  'っしゃ': ['ssya', 'ssha',], 'っしゅ': ['ssyu', 'sshu',], 'っしょ': ['ssyo', 'ssho',],
  'っちゃ': ['ttya', 'ccha',], 'っちゅ': ['ttyu', 'cchu',], 'っちょ': ['ttyo', 'ccho',],
  'っにゃ': ['nnya',], 'っにゅ': ['nnyu',], 'っにょ': ['nnyo',],
  'っひゃ': ['hhya',], 'っひゅ': ['hhyu',], 'っひょ': ['hhyo',],
  'っみゃ': ['mmya',], 'っみゅ': ['mmyu',], 'っみょ': ['mmyo',],
  'っりゃ': ['rrya',], 'っりゅ': ['rryu',], 'っりょ': ['rryo',],
  'っぎゃ': ['ggya',], 'っぎゅ': ['ggyu',], 'っぎょ': ['ggyo',],
  'っじゃ': ['jja', 'zzya',], 'っじゅ': ['jju', 'zzyu',], 'っじょ': ['jjo', 'zzyo',],
  'っぢゃ': ['ddya',], 'っぢゅ': ['ddyu',], 'っぢょ': ['ddyo',],
  'っびゃ': ['bbya',], 'っびゅ': ['bbyu',], 'っびょ': ['bbyo',],
  'っぴゃ': ['ppya',], 'っぴゅ': ['ppyu',], 'っぴょ': ['ppyo',],
};

// 仮名だけを扱うクラス
class Kana {
  // ローマ字候補たち
  #romans = [];
  // 現在選択中のローマ字の場所（インデクス）
  #currentIndex;
  // 現在選択中のローマ字（外部公開用）
  #tempRoman;
  // ローマ字候補が確定済か
  #hasConfirmed;
  // 使った文字数
  #kanaCount;
  // 仮名
  #yomi;

  // 現在選択中のローマ字候補
  get tempRoman() {
    return this.#tempRoman;
  }
  // 現在選択中のローマ字の場所（インデクス）
  get currentIndex() {
    return this.#currentIndex;
  }
  // 使った仮名文字数
  get kanaCount() {
    return this.#kanaCount;
  }
  // 仮名
  get yomi() {
    return this.#yomi;
  }

  // コンストラクタ
  constructor(kana) {
    this.selectRomans(kana);
    this.#currentIndex = 0;
    this.#tempRoman = this.#romans[0];
    if (this.#romans.length === 1) {
      this.#hasConfirmed = true;
    } else {
      this.#hasConfirmed = false;
    }
  }

  // 設定された 3 文字の仮名からローマ字候補たちを設定する
  selectRomans(kana) {
    // 促音+拗音、もしくは最後の拗音・促音や、最後の一文字の場合
    if (Object.hasOwn(Kanas, kana)) {
      this.#yomi = kana;
      this.#romans = Kanas[this.#yomi];
      this.#kanaCount = kana.length;
    }
    // 促音、もしくは拗音の場合
    else if (Object.hasOwn(Kanas, kana.slice(0, 2))) {
      this.#yomi = kana.slice(0, 2);
      this.#romans = Kanas[this.#yomi];
      this.#kanaCount = 2;
    }
    // それ以外
    else {
      this.#yomi = kana[0];
      this.#romans = Kanas[this.#yomi];
      this.#kanaCount = 1;
    }
  }

  // ユーザの入力したキーが正しいかどうか判定する
  input(yourKey) {
    // ユーザ入力の判定
    let isCorrect = false;
    // ローマ字候補が確定済の場合
    if (this.#hasConfirmed) {
      if (this.#tempRoman[this.#currentIndex] === yourKey) {
        isCorrect = true;
        this.#currentIndex++;
      }
    }
    // ローマ字候補が未確定の場合
    else {
      // 現在のローマ字位置の文字が全てのローマ字候補で同じかどうか
      let isSameChar = true;
      let tempChar = this.#romans[0][this.#currentIndex];
      for (let i = 1; i < this.#romans.length; i++) {
        if (tempChar !== this.#romans[i][this.#currentIndex]) {
          isSameChar = false;
          break;
        }
      }
      // どのローマ字候補も現在のインデクスで同じ文字の場合
      if (isSameChar) {
        if (this.#tempRoman[this.#currentIndex] === yourKey) {
          isCorrect = true;
          this.#currentIndex++;
        }
      }
      // 現在のローマ字位置で、ローマ字候補に違いがある場合
      else {
        for (let i = 0; i < this.#romans.length; i++) {
          if (this.#romans[i][this.#currentIndex] === yourKey) {
            this.#hasConfirmed = true;
            this.#tempRoman = this.#romans[i];
            this.#currentIndex++;
            isCorrect = true;
            break;
          }
        }
      }
    }
    return isCorrect;
  }

  // クリアしたかどうか
  hasCleared() {
    return this.#tempRoman.length === this.#currentIndex;
  }
}

// 百人一首の場合、一首の全体
// 俳句の場合、一句の全体など
export class Phrase {
  // 元の一首（漢字混じり）
  #origin;
  // 平仮名
  #yomi;
  // 未入力 Kana インスタンスの配列
  #unenteredKanas = [];
  // 入力中の Kana インスタンス
  #currentKana = null;
  // 入力済 Kana インスタンスの配列
  #enteredKanas = [];
  // 入力済ローマ字
  #enteredRoman = '';
  // 入力済ローマ字を渡すイベントハンドラ
  #handOverRomans = [];
  // 正入力数
  #correctCount = 0;
  // 誤入力数
  #incorrectCount = 0;
  // キー入力列
  #keystrokeSequence = '';
  // 正誤列 `111011` など
  #binaryResponse = '';
  // 総正入力数
  static #totalCorrectCount = 0;
  // 総誤入力数
  static #totalIncorrectCount = 0;

  get currentKana() {
    return this.#currentKana;
  }
  get enteredRoman() {
    return this.#enteredRoman;
  }
  get correctCount() {
    return this.#correctCount;
  }
  get incorrectCount() {
    return this.#incorrectCount;
  }
  get keystrokeSequence() {
    return this.#keystrokeSequence;
  }
  get binaryResponse() {
    return this.#binaryResponse;
  }
  static get totalCorrectCount() {
    return Phrase.#totalCorrectCount;
  }
  static set totalCorrectCount(value) {
    Phrase.#totalCorrectCount = value;
  }
  static get totalIncorrectCount() {
    return Phrase.#totalIncorrectCount;
  }
  static set totalIncorrectCount(value) {
    Phrase.#totalIncorrectCount = value;
  }

  constructor(origin, yomi) {
    this.#origin = origin;
    this.#yomi = yomi;
    this.initializeKanas();
  }

  // インプット済ローマ字を渡すためのハンドラ用リスナ add
  addHandOverRomanListener(handler) {
    this.#handOverRomans.push(handler);
  }
  // インプット済ローマ字を渡すためのハンドラ用リスナ remove
  removeHandOverRomanListener(handler) {
    this.#handOverRomans = this.#handOverRomans.filter((h) => h !== handler);
  }

  // ローマ字を初期化する
  initializeKanas() {
    const connectedYomi = this.#yomi.replace(/\s/g, '');
    for (let i = 0; i < connectedYomi.length; i++) {
      let candidateKana = connectedYomi.slice(i, i + 3);
      const kana = new Kana(candidateKana);
      this.#unenteredKanas.push(kana);
      i += (kana.kanaCount - 1)
    }
  }

  // ユーザ入力を受け取り判定する
  input(yourKey) {
    // アルファベットキーでない場合
    if (!/^[A-Za-z]$/.test(yourKey)) {
      return;
    }
    if (!this.#currentKana) {
      // 全て入力済の場合
      if (this.#unenteredKanas.length === 0) {
        return;
      }
      this.#currentKana = this.#unenteredKanas.shift();
    }
    this.#keystrokeSequence += yourKey;
    // 正入力の場合
    if (this.#currentKana.input(yourKey)) {
      this.#binaryResponse += '1';
      this.#correctCount++;
      Phrase.#totalCorrectCount++;
      let entered = this.#currentKana.tempRoman.slice(0, this.#currentKana.currentIndex);
      let unentered = this.#currentKana.tempRoman.slice(this.#currentKana.currentIndex);
      for (const handOverRoman of this.#handOverRomans) {
        handOverRoman(entered, unentered);
      }
    }
    // 誤入力の場合
    else {
      this.#binaryResponse += '0';
      this.#incorrectCount++;
      Phrase.#totalIncorrectCount++;
    }
    // Kana インスタンスをクリアされた場合
    if (this.#currentKana.hasCleared()) {
      this.#enteredKanas.push(this.#currentKana);
      this.#enteredRoman += this.#currentKana.tempRoman;
      this.#currentKana = null;
    }
  }

  // 未入力ローマ字（入力中カナ部分は除く）を構成する
  composeUnenteredRoman() {
    let unenteredRoman = '';
    for (const kana of this.#unenteredKanas) {
      unenteredRoman += kana.tempRoman;
    }
    return unenteredRoman;
  }

  // 入力済のカナ（入力中のカナは除く）を構成する
  composeEnteredYomi() {
    let enteredYomi = '';
    for (const kana of this.#enteredKanas) {
      enteredYomi += kana.yomi;
    }
    return enteredYomi;
  }

  // 未入力のカナ（入力中のカナは除く）を構成する
  composeUnenteredYomi() {
    let unenteredYomi = '';
    for (const kana of this.#unenteredKanas) {
      unenteredYomi += kana.yomi;
    }
    return unenteredYomi;
  }

  // 一首全体をクリアしたかどうか
  hasCleared() {
    return (this.#unenteredKanas.length === 0) && !this.#currentKana;
  }
}

// クラス Referee の状態管理用疑似列挙体
const GameState = {
  ready: 'ready',
  playing: 'playing',
  cleared: 'cleared',
  result: 'result',
};

// ゲーム進行役
export class Referee {
  #utas = [];
  #currentIndex = 0;
  #currentPhrase = null;
  #state = GameState.ready;
  #remainingTime = 60 * 3;
  #finishHandlers = [];
  #phraseFinishHandlers = [];
  #totalPhraseIndex = 0;
  #boundKeyDownHandler = this.keydownHandler.bind(this);

  static get totalCorrectCount() {
    return Phrase.totalCorrectCount;
  }
  static get totalIncorrectCount() {
    return Phrase.totalIncorrectCount;
  }

  // データを読み込む
  async loadPhrases(uri) {
    View.showOrigin('問題文読み込み中……');
    const response = await fetch(uri);
    this.#utas = await response.json();
    this.#utas = this.#utas.utas;
    this.randomizeUtas();
  }

  // 終了時用イベントハンドラを追加登録する
  addFinishListener(handler) {
    this.#finishHandlers.push(handler);
  }

  // 終了時用イベントハンドラを登録解除する
  removeFinishListener(handler) {
    this.#finishHandlers = this.#finishHandlers.filter((h) => h !== handler);
  }

  // 一首終了時用イベントハンドラを追加登録する
  addPhraseFinishListener(handler) {
    this.#phraseFinishHandlers.push(handler);
  }

  // 一首終了時用イベントハンドラを登録解除する
  removePhraseFinishListener(handler) {
    this.#phraseFinishHandlers = this.#phraseFinishHandlers.filter((h) => h !== handler);
  }

  // データをランダムに並び替ええる
  randomizeUtas() {
    for (let i = this.#utas.length - 1; 0 < i ; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.#utas[i], this.#utas[j]] = [this.#utas[j], this.#utas[i]];
    }
  }

  // カウントダウン
  startCountDown() {
    View.clearContents();
    let i = 3;
    const intervalId = setInterval(() => {
      View.showYomi(null, i, null);
      if (i === 0) {
        clearInterval(intervalId);
        this.start();
      }
      i--;
    }, 1000);
  }

  // 時間を計測する
  measure3Minutes() {
    View.showRemainingTime(this.#remainingTime);
    const intervalId = setInterval(() => {
      this.#remainingTime--;
      View.showRemainingTime(this.#remainingTime);
      if (this.#remainingTime <= 0) {
        clearInterval(intervalId);
      }
    }, 1000);
  }

  // 早打ち開始
  start() {
    this.#currentIndex = 0;
    this.#totalPhraseIndex = 0;
    Phrase.totalCorrectCount = 0;
    Phrase.totalIncorrectCount = 0;
    this.measure3Minutes();
    this.loadPhrase();
    this.#state = GameState.playing;
    document.addEventListener('keydown', this.#boundKeyDownHandler);
  }

  // キーダウンイベントの中味
  keydownHandler(e) {
    this.handleKey(e.key);
  }

  // 早打ち終了
  async finishGame() {
    this.#state = GameState.result;
    for (const finishHandler of this.#finishHandlers) {
      await finishHandler();
    }
    View.showResult(Phrase.totalCorrectCount, Phrase.totalIncorrectCount);
    document.removeEventListener('keydown', this.#boundKeyDownHandler);
  }

  // 次の歌を読み込む
  loadPhrase() {
    const uta = this.#utas[this.#currentIndex];
    this.#currentPhrase = new Phrase(uta.origin, uta.yomi);
    // 表示
    View.showOrigin(uta.origin);
    View.showYomi(
      null, null, this.#currentPhrase.composeUnenteredYomi());
    View.showRoman(
      null, null, null, this.#currentPhrase.composeUnenteredRoman().toUpperCase());
    View.showAuthor(uta.author, uta.authorKana);
    // 入力中のローマ字に関するイベント処理の登録
    this.#currentPhrase.addHandOverRomanListener(
      (entered, unentered) => {
        // 表示
        View.showYomi(this.#currentPhrase.composeEnteredYomi(),
          this.#currentPhrase.currentKana.yomi,
          this.#currentPhrase.composeUnenteredYomi());
        View.showRoman(this.#currentPhrase.enteredRoman.toUpperCase(), entered.toUpperCase(),
          unentered.toUpperCase(), this.#currentPhrase.composeUnenteredRoman().toUpperCase()
        );
      }
    );
  }

  // 現在の一首を対象に入力を受け付けて、必要なら次判定処理に進める
  async handleKey(key) {
    if (this.#state !== GameState.playing) {
      return;
    }
    this.#currentPhrase.input(key);
    if (this.#currentPhrase.hasCleared()) {
      for (const phraseFinishHandler of this.#phraseFinishHandlers) {
        await phraseFinishHandler(this.#totalPhraseIndex,
          this.#currentPhrase.keystrokeSequence, this.#currentPhrase.binaryResponse);
      }
      await this.nextPhrase();
    }
  }

  // 継続判定して、次の歌を読み込む
  async nextPhrase() {
    this.#currentIndex++;
    this.#totalPhraseIndex++;
    if (this.#remainingTime <= 0) {
      await this.finishGame();
      return;
    }
    if (this.#utas.length <= this.#currentIndex) {
      this.randomizeUtas();
      this.#currentIndex = 0;
    }
    this.loadPhrase();
  }
}

// 表示用クラス
export class View {
  static #remainingTimeElem = document.getElementById('remaining-time');
  static #questionOriginElem = document.getElementById('question-origin');
  static #questionKanaElem = document.getElementById('question-kana');
  static #questionRomanElem = document.getElementById('question-roman');
  static #authorOriginElem = document.getElementById('author-origin');
  static #authorKanaElem = document.getElementById('author-kana');
  static #correctCountElem = document.getElementById('correct-count');
  static #incorrectCountElem = document.getElementById('incorrect-count');

  // 表示を初期化する
  static clearContents() {
    this.#remainingTimeElem.textContent = '';
    this.#questionOriginElem.textContent = '';
    this.#questionKanaElem.textContent = '';
    this.#questionRomanElem.textContent = '';
    this.#authorOriginElem.textContent = '';
    this.#authorKanaElem.textContent = '';
    this.#correctCountElem.textContent = '';
    this.#incorrectCountElem.textContent = '';
  }

  // 残り時間を表示する
  static showRemainingTime(remainingTime) {
    this.#remainingTimeElem.textContent = `${remainingTime} [s]`;
  }

  // ローマ字を表示する
  static showRoman(entered, currentEntered, currentUnentered, unentered) {
    // 入力済
    const enteredRomanSpanEl = document.createElement('span');
    enteredRomanSpanEl.classList.add('entered-roman');
    enteredRomanSpanEl.textContent = entered;
    // 現在入力中の入力済
    const currentEnteredRomanSpanEl = document.createElement('span');
    currentEnteredRomanSpanEl.classList.add('current-entered-roman');
    currentEnteredRomanSpanEl.textContent = currentEntered;
    // 現在入力中の未入力
    const currentUnenteredRomanSpanEl = document.createElement('span');
    currentUnenteredRomanSpanEl.classList.add('current-unentered-roman');
    currentUnenteredRomanSpanEl.textContent = currentUnentered;
    // 未入力
    const unenteredRomanSpanEl = document.createElement('span');
    unenteredRomanSpanEl.classList.add('unentered-roman');
    unenteredRomanSpanEl.textContent = unentered;
    // 表示
    this.#questionRomanElem.replaceChildren();
    this.#questionRomanElem.appendChild(enteredRomanSpanEl);
    this.#questionRomanElem.appendChild(currentEnteredRomanSpanEl);
    this.#questionRomanElem.appendChild(currentUnenteredRomanSpanEl);
    this.#questionRomanElem.appendChild(unenteredRomanSpanEl);
  }

  // 仮名を表示する
  static showYomi(entered, current, unentered) {
    // 入力済
    const enteredYomiSpanEl = document.createElement('span');
    enteredYomiSpanEl.classList.add('entered-yomi');
    enteredYomiSpanEl.textContent = entered;
    // 現在入力中
    const currentYomiSpanEl = document.createElement('span');
    currentYomiSpanEl.classList.add('current-yomi');
    currentYomiSpanEl.textContent = current;
    // 未入力
    const unenteredYomiSpanEl = document.createElement('span');
    unenteredYomiSpanEl.classList.add('unentered-yomi');
    unenteredYomiSpanEl.textContent = unentered;
    // 表示
    this.#questionKanaElem.replaceChildren();
    this.#questionKanaElem.appendChild(enteredYomiSpanEl);
    this.#questionKanaElem.appendChild(currentYomiSpanEl);
    this.#questionKanaElem.appendChild(unenteredYomiSpanEl);
  }

  // 漢字仮名混じりで表示する
  static showOrigin(origin) {
    this.#questionOriginElem.textContent = origin;
  }

  // 著者とその読み仮名
  static showAuthor(authorOrigin, authorYomi) {
    this.#authorOriginElem.textContent = authorOrigin;
    if (authorYomi) {
      this.#authorKanaElem.textContent = `（${authorYomi}）`;
    }
  }

  // 結果を表示する
  static showResult(correctCount, incorrectCount) {
    this.#correctCountElem.textContent = correctCount;
    this.#incorrectCountElem.textContent = incorrectCount;
  }
}
