import {
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

let url = 'https://typing-7ktrzq0xp-gplayers-projects.vercel.app';
const dir = '/api/crypto';
url = `${url}${dir}`;

// 結果を問い合わせる
export async function inquireResult(auth, gameSessionId, level) {
  const userToken = await auth.currentUser.getIdToken();
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`,
    },
    body: JSON.stringify({
      gameSessionId: gameSessionId,
      level: level,
    }),
  });
  const result = await response.json();
  return result;
}

// キー押下イベントを Vercel にポストする
export async function postKeystrokeSequence(auth, gameSessionId, totalPhraseIndex, keystrokeSequence, binaryResponse) {
  const userToken = await auth.currentUser.getIdToken();
  const events = {
    type: 'insert',
    gameSessionId: gameSessionId,
    totalPhraseIndex: totalPhraseIndex.toString(),
    keystrokeSequence: keystrokeSequence,
    binaryResponse: binaryResponse,
    timestamp: serverTimestamp(),
  }
  const response = await fetch(url, {
    method: 'POST',
    keepalive: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`,
    },
    body: JSON.stringify(events),
  });
  const data = await response.json();
  return data;
}
