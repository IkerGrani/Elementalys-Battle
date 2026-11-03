import { auth, db } from "../firebase.js";
import { 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from "https://esm.sh/firebase/auth";
import { 
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    Timestamp
} from "https://esm.sh/firebase/firestore";
import { User } from '../objetos/user.js';

export class UserDAO {

    /**
     * Funcion para llamar al documento de firebase para poder obtener
     * todos los datos deseados de un usuario mediante su uid y opcionalmente
     * su email tambien.
     * 
     * @param {string} uid UID del usuario.
     * @param {string} email Identificador del usuario.
     * @returns Retorna el objeto User con los datos de firebase. Si no se encuentras devuelve null.
     */
    static async getUserByUid(uid, email = "") {
        try {
            const docRef = doc(db, "Usuarios", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return User.createUserFromFireBase(uid, email, docSnap.data());
            }

            return null;   
        } catch (error) {
            console.error("Error al obtener el usuario por UID:", error);
            throw error;
        }
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
    static async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // Se obtiene el documento ("Usuarios") asociado al usuario logeado
            let user = await UserDAO.getUserByUid(firebaseUser.uid, firebaseUser.email);

            return user;   
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            throw error;
        }
    }

    /**
     * Funcion para registrar al nuevo usuario en firebase.
     * Se crea el usuario firebase auth y el documento "Usuarios" asociado en firestore.
     * @param {string} email Correo electronico.
     * @param {string} password Contraseña.
     * @param {string} usuario Nombre de usuario.
     * @param {string} fechaNacimiento Fecha de nacimiento.
     * @returns Objeto User creado.
     */
    static async register(email, password, usuario, fechaNacimiento) {
        try {
            // Se crea el usuario en firebase auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // Se crea una nuevo objeto User
            const newUser = new User(
                firebaseUser.uid,
                firebaseUser.email,
                usuario,
                fechaNacimiento,
                0,
                0,
                Timestamp.now()
            );

            // Guardamos los datos en la colección "Usuarios" de firestore
            await UserDAO.saveUser(newUser);

            return newUser;
        } catch (error) {
            console.error("Error al registrar usuario:", error);
            throw error;
        }
    }

    /**
     * Se guarda o se sobrescribe los datos del usuario en el documento "Usuarios".
     * @param {User} user Objeto user.
     */
    static async saveUser(user) {
        try {
            const userRef = doc(db, "Usuarios", user.uid);
            await setDoc(userRef, user.toFirebase(), { merge: true });   
        } catch (error) {
            console.error("Error al guardar datos del usuario:", error);
            throw error;
        }
    }

    /**
     * Actualiza datos del perfil del usuario(nombre y fecha de nacimiento).
     * 
     * @param {string} uid Identificador del usuario para actualizar.
     * @param {string} usuario Nuevo nombre de usuario.
     * @param {string} fechaNacimiento Nueva fecha de nacimiento.
     */
    static async updateProfileData(uid, usuario, fechaNacimiento) {
        try {
            const userRef = doc(db, "Usuarios", uid);
            
            // Actualizar en Firestore
            await updateDoc(userRef, {
                Usuario: usuario,
                Fecha_Nacimiento: fechaNacimiento
            });

        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
            throw error;
        }
    }

    /**
     * Se obtiene todos los usuarios de firebase (para la pantalla ranking).
     * 
     * @returns {<Array<User>} Lista con todos los usuarios.
     */
    static async getAllUsers() {
        try {
            const querySnapshot = await getDocs(collection(db, "Usuarios"));
            const users = [];

            querySnapshot.forEach((docSnap) => {
                const data = docSnap.data();
                // Le pasamos el id del documento como uid
                users.push(User.createUserFromFireBase(docSnap.id, "", data));
            });

            return users;
        } catch (error) {
            console.error("Error al obtener todos los usuarios:", error);
            return [];
        }
    }

    /**
     * Funcion para cerrar sesion en firebase.
     */
    static async logout() {
       try {
            await signOut(auth);
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            throw error;
        }
    }

}