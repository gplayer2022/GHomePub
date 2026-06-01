// 設問たち
const regexQuestions = [
  {
    no: '01',
    regex: /unn?ko/
  },
  {
    no: '02',
    regex: /un.ko/
  },
  {
    no: '03',
    regex: /go*gle/
  },
  {
    no: '04',
    regex: /go+gle/
  },
  // {
  //   no: '05',
  //   regex: /go{3,5}gle/
  // },
  // {
  //   no: '06',
  //   regex: /[AaEe]lice/
  // },
  // {
  //   no: '07',
  //   regex: /[0-9]{3}/
  // },
  // {
  //   no: '08',
  //   regex: /[^0-9]{3}/
  // },
  // {
  //   no: '09',
  //   regex: /(Final|Initial)Fantasy/
  // },
  // {
  //   no: '10',
  //   regex: /^F.+/
  // },
  // {
  //   no: '11',
  //   regex: /\\d{3}-\\d{4}/
  // },
  // {
  //   no: '12',
  //   regex: /^abc(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/
  // },
];

// 結果一覧に結果を表示し、ローカルストレージにデータを格納する
function showResult2ResultList(yourResultListElem, isCorrects) {
  if (!isCorrects.includes(false)) {
    yourResultListElem.textContent = '〇';
    localStorage.setItem(yourResultListElem.dataset.resultId, "〇");
  } else {
    yourResultListElem.textContent = '×';
    localStorage.setItem(yourResultListElem.dataset.resultId, "×");
  }
}

// 正誤の表示
function showResult(yourResultElem, isCorrects) {
  yourResultElem.replaceChildren();
  const pElem = document.createElement('p');
  pElem.classList.add('clare-line');
  let text = '[';
  if (isCorrects[0]) {
    text += '正解, ';
  } else {
    text += '不正解, ';
  }
  if (isCorrects[1]) {
    text += '正解';
  } else {
    text += '不正解';
  }
  text += '] です。'
  pElem.textContent = text;
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
  for (let i = 0; i < regexQuestions.length; i++) {
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

// 進捗を初期化する
function clearProgress(questions) {
  questions.forEach(({ no }) => {
    const yourResultListElem = document.getElementById(`your-result-list-${no}`);
    const key = yourResultListElem.dataset.resultId;
    localStorage.removeItem(key);
    // UI をクリアする
    yourResultListElem.textContent = '';
  })
}

// ユーザ回答に正誤判定する
function checkAnswer(yourRegexMatchedIElem, yourRegexUnmatchedIElem, regexQuestion) {
  let isCorrects = [false, false];
  if (yourRegexMatchedIElem.value.trim() !== '') {
    isCorrects[0] = regexQuestion.regex.test(yourRegexMatchedIElem.value);
  }
  if (yourRegexUnmatchedIElem.value.trim !== '') {
    isCorrects[1] = !regexQuestion.regex.test(yourRegexUnmatchedIElem.value);
  }
  return isCorrects;
}

function main() {
  for (let regexQuestion of regexQuestions) {
    const questionElem = document.getElementById(`question-${regexQuestion.no}`);
    const yourRegexMatchedIElem = document.getElementById(`your-regex-matched-${regexQuestion.no}`);
    const yourRegexUnmatchedIElem = document.getElementById(`your-regex-unmatched-${regexQuestion.no}`);
    const showYourAnswerButtonIElem = document.getElementById(`show-answer-${regexQuestion.no}`);
    const answerCardElem = document.getElementById(`answer-${regexQuestion.no}-card`);
    const yourResultElem = document.getElementById(`your-result-${regexQuestion.no}`);
    const yourResultListElem = document.getElementById(`your-result-list-${regexQuestion.no}`);
    // 解説表示用のイベントリスナ
    const displayHintElem = document.getElementById(`display-hint-${regexQuestion.no}`);
    displayHintElem.addEventListener('click', (event) => {
      event.currentTarget.parentElement.classList.add('hidden');
      document.getElementById(`story-hint-${regexQuestion.no}`).classList.remove('hidden');
    });
    // 回答表示ボタン
    showYourAnswerButtonIElem.addEventListener('click', () => {
      // 正誤判定
      const isCorrects = checkAnswer(yourRegexMatchedIElem, yourRegexUnmatchedIElem, regexQuestion);
      showResult(yourResultElem, isCorrects);
      showResult2ResultList(yourResultListElem, isCorrects);
      answerCardElem.classList.remove('hidden');
    });
  }
  // ローカルストレージからデータを読み込む
  restoreProgress(regexQuestions);
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
    clearProgress(regexQuestions);
  });
}

document.addEventListener('DOMContentLoaded', main);
