// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";

const firebaseConfig = {
        apiKey: "AIzaSyC7bRbulHJ3D1VWpooXWka42MhOuIKgrVU",
        authDomain: "alisahmart-f8a62.firebaseapp.com",
        databaseURL: "https://alisahmart-f8a62-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "alisahmart-f8a62",
        storageBucket: "alisahmart-f8a62.appspot.com",
        messagingSenderId: "852965892731",
        appId: "1:852965892731:web:89a310bc1794aaf904b8de",
        measurementId: "G-LPBH8TXQEM"
};

const app = initializeApp(firebaseConfig);

export default app;
