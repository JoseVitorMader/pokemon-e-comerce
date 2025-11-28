// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getDatabase, ref, onValue, get, child, set, push, update } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqsbnBe3efr3WJUa88i0rzo-NTS9QnkS4",
  authDomain: "e-commerce-732f9.firebaseapp.com",
  projectId: "e-commerce-732f9",
  storageBucket: "e-commerce-732f9.firebasestorage.app",
  messagingSenderId: "278630013422",
  appId: "1:278630013422:web:a762764c76f90e9871d6ff"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getDatabase(app);

// Subscribe to realtime products list. Callback receives array of products.
export function subscribeProducts(callback) {
  const productsRef = ref(db, "products");
  // onValue returns an unsubscribe function when passed to off
  return onValue(productsRef, (snapshot) => {
    const data = snapshot.val() || {};
    const list = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
    callback(list);
  });
}

// Get a single product by id (one-time)
export async function getProductById(id) {
  const snap = await get(child(ref(db), `products/${id}`));
  if (!snap.exists()) return null;
  return { id, ...snap.val() };
}

// User profile helpers (profiles stored under /profiles/{uid})
export async function fetchUserProfile(uid) {
  if (!uid) return null;
  const snap = await get(child(ref(db), `profiles/${uid}`));
  return snap.exists() ? snap.val() : null;
}

export async function saveUserProfile(uid, profile) {
  if (!uid) throw new Error("Missing uid");
  await set(ref(db, `profiles/${uid}`), profile);
}

// Product CRUD (with userId tracking)
export async function createProduct(productData, userId) {
  const productsRef = ref(db, "products");
  const newProductRef = push(productsRef);
  await set(newProductRef, { ...productData, userId, createdAt: Date.now() });
  return newProductRef.key;
}

export async function updateProduct(productId, updates) {
  await update(ref(db, `products/${productId}`), updates);
}

export async function deleteProduct(productId) {
  await set(ref(db, `products/${productId}`), null);
}

export async function getUserProducts(userId) {
  const snap = await get(child(ref(db), "products"));
  if (!snap.exists()) return [];
  const data = snap.val();
  return Object.keys(data)
    .filter((key) => data[key].userId === userId)
    .map((key) => ({ id: key, ...data[key] }));
}