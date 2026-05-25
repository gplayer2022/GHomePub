// 設問たち
const flexQuestions = [
  {
    no: '01',
    tags: [
      'red', 'blue', 'green',
    ],
    cssText: `flex-direction: row-reverse;`,
  },
  {
    no: '02',
    tags: [
      'red', 'blue',
    ],
    cssText: `justify-content: center;`,
  },
  {
    no: '03',
    tags: [
      'red', 'blue', 'green',
    ],
    cssText: `flex-direction: column-reverse;
      justify-content: space-evenly;`,
  },
  {
    no: '04',
    tags: [
      'red', 'blue', 'green',
    ],
    cssText: `align-items: flex-end;`,
  },
  {
    no: '05',
    tags: [
      'red', 'blue', 'green',
    ],
    cssText: `flex-direction: column-reverse;
      align-items: center;
      justify-content: space-around;`,
  },
  {
    no: '06',
    tags: [
      'red', 'blue', 'green', `yellow`, `brown`, 'red', 'blue', 'green', `yellow`,
    ],
    cssText: `flex-wrap: wrap;`,
  },
  {
    no: '07',
    tags: [
      'red', 'blue', 'green', `yellow`, `brown`, 'red', 'blue', 'green', `yellow`,
    ],
    cssText: `flex-wrap: wrap;
      justify-content: space-between;
      flex-direction: column-reverse;
      align-items: flex-end;`,
  },
];

// 結果一覧に結果を表示し、ローカルストレージにデータを格納する
function showResult2ResultList(yourResultListElem, isCorrect) {
  if (isCorrect) {
    yourResultListElem.textContent = '〇';
    localStorage.setItem(yourResultListElem.dataset.resultId, "〇");
  } else {
    yourResultListElem.textContent = '×';
    localStorage.setItem(yourResultListElem.dataset.resultId, "×");
  }
}

// 正誤の表示
function showResult(yourResultElem, isCorrect) {
  yourResultElem.replaceChildren();
  const pElem = document.createElement('p');
  pElem.classList.add('clare-line');
  if (isCorrect) {
    pElem.textContent = '正解です。';
  } else {
    pElem.textContent = '不正解です。';
  }
  yourResultElem.appendChild(pElem);
  yourResultElem.classList.remove('hidden');
}

// ドットの表示を切り替える
// 実際の設問の切り替えは別
function updateStep(step) {
  const stepProgressElems = document.querySelectorAll('#step-progress span');
  stepProgressElems.forEach((stepProgressElem, index) => {
    const formattedIndex = String(index + 1).padStart(2, '0');
    if (step === formattedIndex) {
      stepProgressElem.textContent = '●';
    } else {
      stepProgressElem.textContent = '○';
    }
  });
}

// 指定されたステップを表示する
// 実際の設問を表示
function showStep(step) {
  for (let i = 0; i < flexQuestions.length; i++) {
    const formattedIndex = String(i + 1).padStart(2, '0');
    const storyElem = document.getElementById(`story-${formattedIndex}`);
    if (step === formattedIndex) {
      storyElem.classList.add('active');
    } else {
      storyElem.classList.remove('active');
    }
  }
  // 問題先頭位置にスクロールする
  const stepProgressElem = document.getElementById('step-progress');
  const y = stepProgressElem.getBoundingClientRect().top + window.scrollY - 140;
  window.scrollTo({
    top: y,
    behavior: 'smooth',
  });
}

// ローカルストレージから復元して表示
function restoreProgress(questions) {
  let topIncompleteStep = null;
  questions.forEach(({ no }, index) => {
    const yourResultListElem = document.getElementById(`your-result-list-${no}`);
    const key = yourResultListElem.dataset.resultId;
    const value = localStorage.getItem(key);
    // 結果一覧表を復元
    if (value) {
      yourResultListElem.textContent = value;
    }
    // 最初の未実施設問または不正解設問を取得
    if (!value || value === '×') {
      if (!topIncompleteStep) {
        topIncompleteStep = String(index + 1).padStart(2, '0');
      }
    }
  });
  // 全問終了済の場合は最初の設問に戻す
  const step = topIncompleteStep || '01';
  if (step !== '01') {
    updateStep(step);
    showStep(step);
  }
}

function clearProgress(questions) {
  questions.forEach(({ no }) => {
    const yourResultListElem = document.getElementById(`your-result-list-${no}`);
    const key = yourResultListElem.dataset.resultId;
    localStorage.removeItem(key);
    // UI をクリアする
    yourResultListElem.textContent = '';
  })
}

function checkAnswer(modelElem, answerElem, cssText) {
  const modelStyle = getComputedStyle(modelElem);
  const answerStyle = getComputedStyle(answerElem);
  // チェック対象のプロパティたちを取得
  const targetProps = [];
  const declarations = cssText.replace(/\n/g, '').split(/;\s*/);
  for (let declaration of declarations) {
    if (!declaration) {
      continue;
    }
    const [property, ...rest] = declaration.trim().split(':');
    const value = rest.join(':');
    if (!property || !value) {
      continue;
    }
    targetProps.push(property);
  }
  // ブラウザの解釈結果を利用して判定する
  // ただし、正答基準なので、ユーザ回答に余計な宣言があるとすり抜ける
  let isCorrect = true;
  for (let targetProp of targetProps) {
    if (modelStyle[targetProp] !== answerStyle[targetProp]) {
      isCorrect = false;
      break;
    }
  }
  // 座標判定
  const modelChildren = modelElem.children;
  const answerChildren = answerElem.children;
  if (modelChildren.length !== answerChildren.length) {
    isCorrect = false;
  } else {
    for (let i = 0; i < modelChildren.length; i++) {
      const modelClientRect = modelChildren[i].getBoundingClientRect();
      const answerClientRect = answerChildren[i].getBoundingClientRect();
      // 誤差考慮して 1px 超過で判定する
      if (1 < Math.abs(modelClientRect.left - answerClientRect.left) ||
        1 < Math.abs(modelClientRect.top - answerClientRect.top)) {
        isCorrect = false;
        break;
      }
    }
  }
  return isCorrect;
}

function setImgTag(tags, cssPanelModelElem, cssPanelAnswerElem) {
  // 問題用エレメント
  // 例 : <img class="item red-item" src="images/frame-red.png" alt="">
  for (let tag of tags) {
    const modelImgElem = document.createElement('img');
    modelImgElem.classList.add('item');
    modelImgElem.classList.add(`${tag}-item`);
    modelImgElem.src = `images/frame-${tag}.png`;
    modelImgElem.alt = '';
    cssPanelModelElem.appendChild(modelImgElem);
  }
  // 回答用エレメント
  // 例 : <img class="item red-item" src="images/manhole-red.png" alt="">
  for (let tag of tags) {
    const answerImgElem = document.createElement('img');
    answerImgElem.classList.add('item');
    answerImgElem.classList.add(`${tag}-item`);
    answerImgElem.src = `images/manhole-${tag}.png`;
    answerImgElem.alt = '';
    cssPanelAnswerElem.appendChild(answerImgElem);
  }
}

// CSS を設定する
function setCss2Elem(cssText, elem) {
  elem.style.cssText = '';
  const declarations = cssText.replace(/\n/g, '').split(/;\s*/);
  for (let declaration of declarations) {
    if (!declaration) {
      continue;
    }
    const [property, value] = declaration.trim().split(/:/);
    if (!property || !value) {
      continue;
    }
    elem.style.setProperty(property.trim(), value.trim());
  }
}

function main() {
  for (let flexQuestion of flexQuestions) {
    const cssPanelModelElem = document.getElementById(`css-panel-model-${flexQuestion.no}`);
    const cssPanelAnswerElem = document.getElementById(`css-panel-answer-${flexQuestion.no}`);
    const yourAnswerIElem = document.getElementById(`your-answer-${flexQuestion.no}`);
    const showYourAnswerButtonIElem = document.getElementById(`show-answer-${flexQuestion.no}`);
    const answerCardElem = document.getElementById(`answer-${flexQuestion.no}-card`);
    const yourResultElem = document.getElementById(`your-result-${flexQuestion.no}`);
    const yourResultListElem = document.getElementById(`your-result-list-${flexQuestion.no}`);
    setCss2Elem(flexQuestion.cssText, cssPanelModelElem);
    setImgTag(flexQuestion.tags, cssPanelModelElem, cssPanelAnswerElem);
    // ユーザ回答用イベントリスナ
    yourAnswerIElem.addEventListener('input', (e) => {
      setCss2Elem(e.currentTarget.value, cssPanelAnswerElem);
    });
    // 解説表示用のイベントリスナ
    const displayHintElem = document.getElementById(`display-hint-${flexQuestion.no}`);
    displayHintElem.addEventListener('click', (event) => {
      event.currentTarget.parentElement.classList.add('hidden');
      document.getElementById(`story-hint-${flexQuestion.no}`).classList.remove('hidden');
    });
    // 回答表示ボタン
    showYourAnswerButtonIElem.addEventListener('click', () => {
      // 正誤判定
      const isCorrect = checkAnswer(cssPanelModelElem, cssPanelAnswerElem, flexQuestion.cssText);
      showResult(yourResultElem, isCorrect);
      showResult2ResultList(yourResultListElem, isCorrect);
      answerCardElem.classList.remove('hidden');
    });
  }
  // ローカルストレージからデータを読み込む
  restoreProgress(flexQuestions);
  // 「次へ」ボタンで次の問題を表示する
  const toNextIElems = document.querySelectorAll('.to-next-step');
  toNextIElems.forEach((toNextElem, index) => {
    toNextElem.addEventListener('click', (e) => {
      const step = e.currentTarget.dataset.nextStep;
      updateStep(step);
      showStep(step);
    });
  })
  // ドットクリックで問題を表示
  const stepProgressElems = document.querySelectorAll('#step-progress span');
  stepProgressElems.forEach((stepProgressElem, index) => {
    stepProgressElem.addEventListener('click', (event) => {
      const step = event.currentTarget.dataset.step;
      updateStep(step);
      showStep(step);
    });
  });
  // 結果一覧をクリアする
  const clearYourProgressButtonIElem = document.getElementById('clear-your-progress-button');
  clearYourProgressButtonIElem.addEventListener('click', (e) => {
    clearProgress(flexQuestions);
  });
}

document.addEventListener('DOMContentLoaded', main);
