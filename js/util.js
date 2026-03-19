// 公開鍵
const publicKey = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAl0ZXTqUHanj4gZ3atxsG
AwEUCBsjmUwM8UeZv6zaseo9dJRjhvQSKUZyys+cRrrxI5DDbaA++5//SFjgdkDN
TM5Nrq0QO/aFo8PwHkCLPgpo7BzxqMQYlHQRf5UcU/yRjhDj2nThgsq0/AsRXXpM
eXf4qFQniJKPtLzjOcRCnGjib8i/B27BrViqU7Hs2/Yiv0aiIl7QnpsVnyHbS2Af
O6OM6ecOa37FrzhR5YooLoc2Sl9q7oGOZytssPkM/oowwyFzIsyKCtGIeErIAJDn
wlktksGBKUu5SmljO+BLVq4E56QdWkIvqyfg8Yg2D1QLjb3o5ZqGxOGGYtbUG4JN
LwIDAQAB`;

// 桁指定で丸める
export function exRound(number, digits = 0) {
  const factor = 10 ** digits;
  return Math.round(number * factor) / (factor * 1.0);
}

// 算術平均を求める
export function calcMean(numbers) {
  let mean = 0;
  if (0 < numbers.length) {
    mean = numbers.reduce((sum, number) => {
      return sum + number;
    }, 0) / numbers.length;
  }
  return mean;
}

// 署名を検証する
export async function verifySignature(signatureBase64, message) {
  const importedPublicKey = await importSshPublicKey(publicKey);
  const textEncoder = new TextEncoder();
  const signatureBytes = Uint8Array.from(atob(signatureBase64), (char) => char.charCodeAt(0));
  const valid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    importedPublicKey,
    signatureBytes,
    textEncoder.encode(message)
  );
  return valid;
}

// 元の公開鍵文字列から SubtleCrypto が扱える公開鍵オブジェクトに変換する
function importSshPublicKey(key) {
  // Ascii to Binary で DER(Distinguished Encoding Rules) の ASN.1 形式でバイナリ配列化
  // Uint8Array.from は 配列や文字列を元に、バイト列を作る
  const keyBytes = Uint8Array.from(atob(key), (char) => char.charCodeAt(0));
  // 公開鍵標準構造 SPKI (Subject Public Key Info) として読み込む
  // crypto.subtle.importKey は Promise を返す
  return crypto.subtle.importKey(
    'spki',
    keyBytes.buffer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['verify',]
  );
}

// ログイン状態管理
export const State = Object.freeze({
  PRE_LOGIN: 0,
  HAS_LOGGED_IN: 1,
  NAME_REGISTERD: 2,
});