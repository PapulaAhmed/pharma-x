// addProduct.mjs
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1iSrsPpx_xVXnSZUMpwLHTtkK-WU1PpU",
  authDomain: "pharmax-uniq.firebaseapp.com",
  databaseURL: "https://pharmax-uniq-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pharmax-uniq",
  storageBucket: "pharmax-uniq.appspot.com",
  messagingSenderId: "976307445771",
  appId: "1:976307445771:web:dc00905dbf3d4fcf9fa70e",
  measurementId: "G-0CS9Y9HXB3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addProduct() {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ItemID: 1,
      ItemName: "Example Product",
      Category: "Category A",
      Description: "This is an example product",
      Manufacturer: "Example Manufacturer",
      Supplier: "Example Supplier",
      QuantityInStock: 100,
      UnitPrice: 19.99,
      ExpirationDate: new Date("2025-12-31"),
      BatchNumber: "BATCH123",
      ReorderLevel: 10,
      ReorderQuantity: 20,
      StorageLocation: "Warehouse 1",
      DateAdded: new Date(),
      LastUpdated: new Date()
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}

addProduct();
