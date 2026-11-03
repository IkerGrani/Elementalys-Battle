import { auth } from "../firebase.js";
import { collection, getDocs } from "https://esm.sh/firebase/firestore";
import { 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile
} from "https://esm.sh/firebase/auth";
import { 
    getFirestore,
    doc,
    setDoc,
    getDoc,
    Timestamp
} from "https://esm.sh/firebase/firestore";
import { db } from "../firebase.js";
import { User } from '../objetos/user.js';

export class UserDAO {

    /**
     * Funcion para llamar al documento de firebase para poder obtener
     * todos los datos deseados de un usuario mediante su uid y opcionalmente
     * su email tambien.
     * 
     * @param {string} uid UID del usuario.
     * @param {string} email Identificador del usuario.
     * @returns Retorna el objeto User con los datos de firebase. Si no se encuentras devuelve false.
     */
    async getUserByUid(uid, email = "") {
        const docRef = doc(db, "Usuarios", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return User.createUserFromFireBase(docSnap.data(), uid, email);
        }

        return false;
    }

    /**
     * Funcion para poder logearse mediante el correo y contraseña.
     * Si las credenciales no son correctas o no se encuentra el usuario con
     * dicho email, se devolvera false, para indicar que fallo el login.
     * 
     * @param {string} email Correo electronico del usuario.
     * @param {string} password Constraseña del usuario.
     * @returns Retorna el objeto User de firebase.
     */
    async login(email, password) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Comprobar si las credenciales son correctas
        if (!userCredential) return false;
        const firebaseUser = userCredential.user;

        // Se obtiene el documento ("Usuarios") asociado al usuario logeado
        let user = await getUserByUid(firebaseUser.uid, firebaseUser.email);
        // Si el usuario o el documento al usuario no existe devolvemos false
        if (!user) return false;

        return user;
    }

    async register(email, password, usuario, fechaNacimiento) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        const newUser = new User({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            usuario: usuario,
            fechaNacimiento: fechaNacimiento,
            partidasJugadas: 0,
            partidasGanadas: 0,
            fechaUltimaPartida: Timestamp.now()
        });

        return newUser;
    }

    /**
     * 
     * @param {*} user 
     */
    async saveUser(user) {
        const userRef = doc(db, "Usuarios", user.uid);
        await setDoc(userRef, user.toFiresbase(), { merge: true });
    }

    /**
     * Funcion para cerrar sesion
     */
    async logout() {
        await signOut(auth);
    }

}