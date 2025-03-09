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