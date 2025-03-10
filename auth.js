import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import app from "./firebase-config.js"; // Firebase設定ファイルをインポート

const auth = getAuth(app);

// 新規ユーザー登録
export const register = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// ログイン処理
export const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// ログアウト処理
export const logout = () => {
  return signOut(auth);
};

// 認証関数
function register(email, password) {
  return firebase.auth().createUserWithEmailAndPassword(email, password);
}

function login(email, password) {
  return firebase.auth().signInWithEmailAndPassword(email, password);
}

function logout() {
  return firebase.auth().signOut();
} 