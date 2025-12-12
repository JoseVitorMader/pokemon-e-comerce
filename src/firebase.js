// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  runTransaction
} from "firebase/firestore";

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
export const db = getFirestore(app);

// Subscribe to realtime products list. Callback receives array of products.
export function subscribeProducts(callback) {
  const productsRef = collection(db, "products");
  // onSnapshot returns an unsubscribe function
  return onSnapshot(productsRef, (snapshot) => {
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(list);
  });
}

// Get a single product by id (one-time)
export async function getProductById(id) {
  const productRef = doc(db, "products", id);
  const snap = await getDoc(productRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

// User profile helpers (profiles stored under /profiles/{uid})
export async function fetchUserProfile(uid) {
  if (!uid) return null;
  const profileRef = doc(db, "profiles", uid);
  const snap = await getDoc(profileRef);
  return snap.exists() ? snap.data() : null;
}

export async function saveUserProfile(uid, profile) {
  if (!uid) throw new Error("Missing uid");
  const profileRef = doc(db, "profiles", uid);
  await setDoc(profileRef, profile, { merge: true });
}

// Product CRUD (with userId tracking)
export async function createProduct(productData, userId) {
  const productsRef = collection(db, "products");
  const docRef = await addDoc(productsRef, {
    ...productData,
    userId,
    createdAt: Date.now()
  });
  return docRef.id;
}

export async function updateProduct(productId, updates) {
  const productRef = doc(db, "products", productId);
  await updateDoc(productRef, updates);
}

export async function deleteProduct(productId) {
  const productRef = doc(db, "products", productId);
  await deleteDoc(productRef);
}

export async function getUserProducts(userId) {
  const productsRef = collection(db, "products");
  const q = query(productsRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Save user's cart to Firestore (under `carts/{userId}`)
export async function saveCartToDb(userId, cart) {
  if (!userId) throw new Error("Missing userId");
  const cartRef = doc(db, "carts", userId);
  await setDoc(cartRef, { items: cart || [], updatedAt: Date.now() }, { merge: true });
}

// Place an order: atomically write order and decrement product stock
// Returns orderId
export async function placeOrder(userId, orderData, cartItems) {
  if (!userId) throw new Error("Missing userId");
  if (!cartItems || cartItems.length === 0) throw new Error("Cart is empty");

  // Use transaction to ensure stock consistency
  const orderRef = doc(collection(db, "orders"));

  const orderId = await runTransaction(db, async (transaction) => {
    // For each cart item, check stock and decrement
    for (const item of cartItems) {
      const pRef = doc(db, "products", item.id);
      const pSnap = await transaction.get(pRef);
      if (!pSnap.exists()) {
        throw new Error(`Produto não encontrado: ${item.id}`);
      }
      const pdata = pSnap.data();
      // If stock is defined, enforce decrement
      if (pdata.stock !== undefined && pdata.stock !== null) {
        const currentStock = Number(pdata.stock || 0);
        if (currentStock < item.qty) {
          throw new Error(`Estoque insuficiente para ${pdata.name || item.id}`);
        }
        transaction.update(pRef, { stock: currentStock - item.qty });
      }
    }

    // Build order payload
    const payload = {
      userId,
      items: cartItems.map((it) => ({ id: it.id, name: it.name, price: it.price, qty: it.qty })),
      total: orderData.total || 0,
      shippingCost: orderData.shippingCost || 0,
      finalTotal: orderData.finalTotal || 0,
      customer: {
        name: orderData.name || null,
        address: orderData.address || null,
        phone: orderData.phone || null,
        cep: orderData.cep || null
      },
      paymentMethod: orderData.paymentMethod || 'unknown',
      status: orderData.status || 'pending',
      createdAt: Date.now()
    };

    transaction.set(orderRef, payload);
    return orderRef.id;
  });

  return orderId;
}