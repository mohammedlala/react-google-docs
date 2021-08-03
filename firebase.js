import firebase from 'firebase';

const firebaseConfig = {
	apiKey: 'AIzaSyB6cf60M0bZrHCO6RfKmGgskNmmLDvbmxE',
	authDomain: 'react--docs.firebaseapp.com',
	projectId: 'react--docs',
	storageBucket: 'react--docs.appspot.com',
	messagingSenderId: '530700594460',
	appId: '1:530700594460:web:5e71cf45c67bc4e8d41ed9',
};

const app = !firebase.apps.length
	? firebase.initializeApp(firebaseConfig)
	: firebase.app();

const db = app.firestore();
export { db };
