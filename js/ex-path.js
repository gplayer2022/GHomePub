// 設問たち
const pathQuestions = [
  {
    no: '01',
    tree: {
      root: {
        images: {
          hero: 'png',
          coffee: 'jpg',
          cake: 'jpg',
          bread: 'jpg',
        },
        css: {
          styles: 'css'
        },
        contents: {
          access: 'html',
          index: 'html',
          menu: 'html',
        },
      },
    },
    from: 'index',
    to: 'access',
  },
  {
    no: '02',
    tree: {
      root: {
        contents: {
          css: {
            images: {
              coffee: 'jpg',
              cake: 'jpg',
              tea: 'jpg',
            },
            styles: 'css',
          },
          js: {
            main: 'js',
          },
          index: 'html',
          menu: 'html',
        },
      },
    },
    from: 'index',
    to: 'styles',
  },
  {
    no: '03',
    tree: {
      root: {
        contents: {
          css: {
            styles: 'css',
          },
          images: {
            coffee: 'jpg',
            tea: 'jpg',
          }
        },
        index: 'html',
        menu: 'html',
        hero: 'png',
      },
    },
    from: 'styles',
    to: 'hero',
  },
  {
    no: '04',
    tree: {
      root: {
        tokyoto: {
          taitoku: {
            asakusa: {
              sensoji: 'temple',
              nakamise: 'shop',
              hoppy: 'street',
            },
            ueno: {
              ueno: 'park',
              sinobazu: 'pond',
              saigo: 'statue',
              ameyoko: 'market',
            },
          },
          nakanoku: {
            broadway: {
              sanmall: 'shop',
              sikinomori: 'park',
            },
            araiyakusi: {
              baisyoin: 'temple',
            }
          },
        },
        chibaken: {
          urayasu: {
            disney: 'park',
          }
        }
      },
    },
    from: 'disney',
    to: 'sensoji',
  },
  {
    no: '05',
    tree: {
      root: {
      },
    },
    from: '',
    to: '',
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
  for (let i = 0; i < pathQuestions.length; i++) {
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

// 全てのファイルを絶対パスにする
function composeAbsolutePathRecursively(paths, tree, tempPath) {
  for (let key in tree) {
    if (typeof tree[key] === 'string') {
      paths[key] = `${tempPath}${key}.${tree[key]}`;
    } else {
      let dirName = (key === 'root') ? '' : key;
      const connectedTempPath = `${tempPath}${dirName}/`;
      composeAbsolutePathRecursively(paths, tree[key], connectedTempPath);
    }
  }
}

// 相対パスを導出する
function computeRelativePaths(absolutePaths, from, to) {
  const fromPath = absolutePaths[from];
  const toPath = absolutePaths[to];
  const fromDirs = fromPath.split('/');
  const toDirs = toPath.split('/');
  const length = Math.min(fromDirs.length, toDirs.length);
  let relativePath = '';
  for (let i = 0; i < length; i++) {
    if (fromDirs[i] !== toDirs[i]) {
      relativePath += '../'.repeat(fromDirs.length - i - 1);
      relativePath += toDirs.slice(i).join('/');
      break;
    }
  }
  return [relativePath, `./${relativePath}`];
}

// 設問の木構造を表示する
function showTree(tree, elem) {
  const ulElem = composeTreeElemRecursively(tree);
  elem.appendChild(ulElem);
}

// ディレクトリツリーを再帰的に構成する
function composeTreeElemRecursively(tree) {
  const ulElem = document.createElement('ul');
  for (let key in tree) {
    if (typeof tree[key] === 'string') {
      let liFileElem = document.createElement('li');
      liFileElem.classList.add('file');
      liFileElem.textContent = `${key}.${tree[key]}`;
      ulElem.appendChild(liFileElem);
    } else {
      let liDirElem = document.createElement('li');
      liDirElem.classList.add('dir');
      let dirName = (key === 'root') ? '' : key;
      liDirElem.textContent = `${dirName}/`;
      const childUlElem = composeTreeElemRecursively(tree[key]);
      liDirElem.appendChild(childUlElem);
      ulElem.appendChild(liDirElem);
    }
  }
  return ulElem;
}

// ユーザ回答に正誤判定する
function checkAnswer(yourAnswer, pathQuestion) {
  let isCorrect = false;
  if (yourAnswer.trim() !== '') {
    const absolutePaths = {};
    composeAbsolutePathRecursively(absolutePaths, pathQuestion.tree, '');
    const relativePaths = computeRelativePaths(absolutePaths, pathQuestion.from, pathQuestion.to);
    isCorrect = relativePaths.includes(yourAnswer.trim());
  }
  return isCorrect;
}

// 問 5 を初期化する
function initializeQ5() {
  const pathQuestion = pathQuestions[4];
  // ユーザ解答欄を初期化する
  const yourAnswerIElem = document.getElementById(`your-answer-${pathQuestion.no}`);
  yourAnswerIElem.value = '';
  // ディレクトリツリーを初期化する
  composeRandomTree();
  // 起点と終点を設定する
  const absolutePaths = {};
  composeAbsolutePathRecursively(absolutePaths, pathQuestion.tree, '');
  const entries = shuffleAbsolutePaths(absolutePaths);
  pathQuestion.from = entries[0][0];
  pathQuestion.to = entries[1][0];
  // 設問欄を初期化する
  const randomPathQuestionElem = document.getElementById('random-path-question');
  randomPathQuestionElem.textContent = `${pathQuestion.from}.html から ${pathQuestion.to}.html への相対パスを書いてください。`;
  const questionElem = document.getElementById(`question-${pathQuestion.no}`);
  questionElem.replaceChildren();
  showTree(pathQuestion.tree, questionElem);
  // 解答欄を設定する
  const randomPathAnswerElem = document.getElementById('random-path-answer');
  const relativePaths = computeRelativePaths(absolutePaths, pathQuestion.from, pathQuestion.to);
  randomPathAnswerElem.textContent = `${relativePaths[0]}
<!-- または -->
${relativePaths[1]}`;
  Prism.highlightElement(randomPathAnswerElem);
  // 解答例を隠す
  const answerCardElem = document.getElementById(`answer-${pathQuestion.no}-card`);
  answerCardElem.classList.add('hidden');
  const yourResultElem = document.getElementById(`your-result-${pathQuestion.no}`);
  yourResultElem.replaceChildren();
  yourResultElem.classList.add('hidden');
}

// to と from を設定するために、初期化する
function shuffleAbsolutePaths(absolutePaths) {
  const entries = Object.entries(absolutePaths);
  for (let i = entries.length - 1; 0 < i; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [entries[i], entries[j]] = [entries[j], entries[i]];
  }
  return entries;
}

// ランダムなツリーを作成する
const maxDepth = 3;
let fileCounter = 0;
function composeRandomTree() {
  fileCounter = 0;
  pathQuestions[4].tree.root = {};
  composeRandomTreeRecursively(pathQuestions[4].tree.root, 0);
}

// ランダムなツリーを再帰的に構成する
function composeRandomTreeRecursively(tree, depth) {
  // ディレクトリ・ファイル合計は [2, 5) 個で。
  const dirFileCount = Math.floor(Math.random() * 3) + 2;
  let dirCount = Math.floor(Math.random() * (dirFileCount + 1));
  let fileCount = dirFileCount - dirCount;
  let dirCounter = 0;
  // 最下層の場合
  if (maxDepth - depth <= 0) {
    fileCount = dirFileCount;
    dirCount = 0;
  }
  // ディレクトリを作成する
  for (let i = 0; i < dirCount; i++) {
    dirCounter++;
    let key = `dir${depth + 1}_${dirCounter}`;
    let treeChild = {};
    composeRandomTreeRecursively(treeChild, depth + 1);
    tree[key] = treeChild;
  }
  // ファイルを作成する
  for (let i = 0; i < fileCount; i++) {
    fileCounter++;
    let key = `file${String(fileCounter).padStart(3, '0')}`;
    tree[key] = 'html';
  }
}

function main() {
  initializeQ5();
  for (let pathQuestion of pathQuestions) {
    const questionElem = document.getElementById(`question-${pathQuestion.no}`);
    const yourAnswerIElem = document.getElementById(`your-answer-${pathQuestion.no}`);
    const showYourAnswerButtonIElem = document.getElementById(`show-answer-${pathQuestion.no}`);
    const answerCardElem = document.getElementById(`answer-${pathQuestion.no}-card`);
    const yourResultElem = document.getElementById(`your-result-${pathQuestion.no}`);
    const yourResultListElem = document.getElementById(`your-result-list-${pathQuestion.no}`);
    if (pathQuestion !== pathQuestions[4]) {
      showTree(pathQuestion.tree, questionElem);
    }
    // 解説表示用のイベントリスナ
    const displayHintElem = document.getElementById(`display-hint-${pathQuestion.no}`);
    displayHintElem.addEventListener('click', (event) => {
      event.currentTarget.parentElement.classList.add('hidden');
      document.getElementById(`story-hint-${pathQuestion.no}`).classList.remove('hidden');
    });
    // 回答表示ボタン
    showYourAnswerButtonIElem.addEventListener('click', () => {
      // 正誤判定
      const isCorrect = checkAnswer(yourAnswerIElem.value, pathQuestion);
      showResult(yourResultElem, isCorrect);
      showResult2ResultList(yourResultListElem, isCorrect);
      answerCardElem.classList.remove('hidden');
    });
  }
  // ローカルストレージからデータを読み込む
  restoreProgress(pathQuestions);
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
    clearProgress(pathQuestions);
  });
  // 問 5 更新ボタンイベント
  const showAnotherPathQuestionIElem = document.getElementById('show-another-path-question');
  showAnotherPathQuestionIElem.addEventListener('click', (e) => {
    initializeQ5();
  });
}

document.addEventListener('DOMContentLoaded', main);
