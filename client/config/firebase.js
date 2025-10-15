// Firebase Configuration - Temporarily Disabled for Development
console.log("Firebase is temporarily disabled. Please use Supabase integration for backend functionality.");

// Mock Firebase Firestore functions to prevent crashes
export const collection = () => ({ 
  id: 'mock-collection',
  add: () => Promise.resolve({ id: 'mock-doc-id' }),
  get: () => Promise.resolve({ docs: [], empty: true })
});

export const doc = () => ({ 
  id: 'mock-doc',
  get: () => Promise.resolve({ exists: false, data: () => null }),
  set: () => Promise.resolve(),
  update: () => Promise.resolve(),
  delete: () => Promise.resolve()
});

export const addDoc = () => Promise.resolve({ id: 'mock-doc-id' });
export const getDoc = () => Promise.resolve({ exists: false, data: () => null });
export const getDocs = () => Promise.resolve({ docs: [], empty: true });
export const updateDoc = () => Promise.resolve();
export const deleteDoc = () => Promise.resolve();
export const query = (...args) => args;
export const where = (...args) => args;
export const orderBy = (...args) => args;
export const onSnapshot = () => () => {}; // Return unsubscribe function
export const serverTimestamp = () => new Date();
export const GeoPoint = class { constructor(lat, lng) { this.latitude = lat; this.longitude = lng; } };

// Mock Firebase services
export const db = {
  collection: collection,
  doc: doc,
  _isMock: true
};

export const auth = {
  currentUser: null,
  signInWithEmailAndPassword: () => Promise.reject(new Error("Please use Supabase integration")),
  createUserWithEmailAndPassword: () => Promise.reject(new Error("Please use Supabase integration")),
  signOut: () => Promise.resolve(),
  _isMock: true
};

export const storage = {
  ref: () => ({ put: () => Promise.reject(new Error("Please use Supabase integration")) }),
  _isMock: true
};

export const functions = {
  httpsCallable: () => () => Promise.reject(new Error("Please use Supabase integration")),
  _isMock: true
};

// Mock app export
export default { 
  name: "mock-firebase-app",
  _isMock: true 
};
