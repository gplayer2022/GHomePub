import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  getDoc,
  getDocs,
  collection,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

// Import the functions you need from the SDKs you need
import { initializeApp, } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics, } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgTfWL3mb9TiA7VGPZQR7R7j7E5fBLYz8",
  authDomain: "g-home-pub.firebaseapp.com",
  projectId: "g-home-pub",
  storageBucket: "g-home-pub.firebasestorage.app",
  messagingSenderId: "618745631368",
  appId: "1:618745631368:web:961cf690f0626a51ab053d",
  measurementId: "G-2PXFC4FTTX"
};

// Firebase を初期化する
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const analytics = getAnalytics(app);

// ダミーアドレス
const email = 'gplayers@internal.local';

// 質問を書き込む、あるいは表示を更新する
async function insertQuestion() {
  const yourQuestionIElem = document.getElementById('your-question');
  const yourNameIElem = document.getElementById('your-name');
  const yourName = yourNameIElem.value.trim() === '' ? 'ななし' : yourNameIElem.value.trim();
  if (yourQuestionIElem.value.trim() !== '') {
    await addDoc(collection(firestore, "questions"), {
      question: yourQuestionIElem.value,
      name: yourName,
      timestamp: serverTimestamp(),
    });
    yourQuestionIElem.value = '';
  }
}

// 質問たちを読み込んで表示する
async function selectQuestions() {
  const docs = await getDocs(
    query(
      collection(firestore, 'questions')),
    orderBy('timestamp', 'desc')
  );
  const ulElem = document.getElementById('question-list');
  ulElem.replaceChildren();
  docs.forEach(function (doc) {
    const liElem = document.createElement('li');
    const questionId = doc.id;
    liElem.textContent = `${doc.data().question}（${doc.data().name}）`;
    liElem.dataset.docId = questionId;
    liElem.classList.add('dummy-link');
    const question = {
      no: 1,
      name: doc.data().name,
      discussion: doc.data().question,
      timestamp: formatTimestamp(doc.data().timestamp),
    };
    // 質問押下イベントを登録する
    liElem.addEventListener('click', async function () {
      const discussionsCardElem = document.getElementById('discussions-card');
      discussionsCardElem.classList.remove('hidden');
      // 質疑応答一覧を取得する
      await selectDiscussions(questionId, question);
    });
    ulElem.appendChild(liElem);
  });
}

// 回答を書き込み、回答欄を更新する
async function insertDiscussion() {
  const discussionListElem = document.getElementById('discussion-list');
  const questionId = discussionListElem.dataset.id;
  const yourDiscussionIElem = document.getElementById('your-discussion');
  const yourDiscussionNameIElem = document.getElementById('your-discussion-name');
  const yourName = yourDiscussionNameIElem.value.trim() === '' ? 'ななし' : yourDiscussionNameIElem.value.trim();
  const question = {
    no: 1,
    name: discussionListElem.dataset.name,
    discussion: discussionListElem.dataset.discussion,
    timestamp: discussionListElem.dataset.timestamp,
  };
  if (yourDiscussionIElem.value.trim() !== '') {
    await addDoc(collection(firestore, "questions", questionId, 'discussions'), {
      discussion: yourDiscussionIElem.value,
      name: yourName,
      timestamp: serverTimestamp(),
    });
    yourDiscussionIElem.value = '';
  }
  await selectDiscussions(questionId, question);
}

// 質疑応答一覧を取得する
async function selectDiscussions(questionId, question) {
  const docs = await getDocs(query(
    collection(firestore, 'questions', questionId, 'discussions'),
    orderBy('timestamp', 'asc')
  ));
  const discussionListElem = document.getElementById('discussion-list');
  discussionListElem.dataset.id = questionId;
  discussionListElem.dataset.no = 1;
  discussionListElem.dataset.name = question.name;
  discussionListElem.dataset.discussion = question.discussion;
  discussionListElem.dataset.timestamp = question.timestamp;
  discussionListElem.replaceChildren();
  append2DiscussionList(discussionListElem, question);
  let no = 2;
  docs.forEach(function (doc) {
    const discussion = {
      no: no++,
      name: doc.data().name,
      discussion: doc.data().discussion,
      timestamp: formatTimestamp(doc.data().timestamp),
    }
    // 表示フォーマット
    // <dl><dt>1 : 名前 : 2025/12/25(Thu) 0:00:00</dt><dd>コメント</dd></dl>
    append2DiscussionList(discussionListElem, discussion);
  });
  const discussIElem = document.getElementById('discuss');
  discussIElem.onclick = insertDiscussion;
}

// 回答欄に回答を追加する
function append2DiscussionList(discussionListElem, discussion) {
  const dlElem = document.createElement('dl');
  const dtElem = document.createElement('dt');
  const ddElem = document.createElement('dd');
  const noSpanElem = document.createElement('span');
  const nameSpanElem = document.createElement('span');
  const timestampSpanElem = document.createElement('span');
  noSpanElem.classList.add('no');
  nameSpanElem.classList.add('name');
  timestampSpanElem.classList.add('timestamp');
  noSpanElem.textContent = `${discussion.no} : `;
  nameSpanElem.textContent = discussion.name;
  timestampSpanElem.textContent = ` : ${discussion.timestamp}`;
  ddElem.textContent = discussion.discussion;
  dtElem.appendChild(noSpanElem);
  dtElem.appendChild(nameSpanElem);
  dtElem.appendChild(timestampSpanElem);
  dlElem.appendChild(dtElem);
  dlElem.appendChild(ddElem);
  discussionListElem.appendChild(dlElem);
}

// Firestore の timestamp 型の値を適切なフォーマットに直す
function formatTimestamp(timestamp) {
  const date = timestamp.toDate();
  const yyyy = String(date.getFullYear());
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const weekDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
  const hh = String(date.getHours()).padStart(2, '0');
  const MM = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}/${mm}/${dd} (${weekDay}) ${hh}:${MM}:${ss}`;
}

// ログイン状態によって、表示を切り替える
async function toggleDisplay(hasLoggedIn) {
  const preLoginElem = document.getElementById('pre-login');
  const questionElem = document.getElementById('question');
  const questionsCardElem = document.getElementById('questions-card');
  if (hasLoggedIn) {
    preLoginElem.classList.add('hidden');
    questionElem.classList.remove('hidden');
    questionsCardElem.classList.remove('hidden');
    await selectQuestions();
  } else {
    preLoginElem.classList.remove('hidden');
    questionElem.classList.add('hidden');
    questionsCardElem.classList.add('hidden');
  }
}

// メインメソッド
function main() {
  // すでにログイン済かどうかをチェックして表示を切り替える
  onAuthStateChanged(auth, async function (user) {
    if (user) {
      await toggleDisplay(true);
    } else {
      await toggleDisplay(false);
    }
  });
  // ログインボタン押下イベント登録
  document.getElementById('login').addEventListener('click', async function () {
    const passwordIElem = document.getElementById('password');
    try {
      await signInWithEmailAndPassword(auth, email, passwordIElem.value);
      await toggleDisplay(true);
    } catch (e) {
      const loginMessageElem = document.getElementById('login-message');
      loginMessageElem.textContent = 'ログインに失敗しました。';
      await toggleDisplay(false);
    }
  });
  // 質問する / 更新するボタン押下イベント登録
  document.getElementById('ask').addEventListener('click', async function () {
    await insertQuestion();
    await selectQuestions();
  });
}

document.addEventListener('DOMContentLoaded', main);