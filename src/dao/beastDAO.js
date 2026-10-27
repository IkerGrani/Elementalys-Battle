import { collection, getDocs } from "https://esm.sh/firebase/firestore";
import { db } from "../firebase.js";
import { Beast } from '../objetos/beast.js';

export class BeastDAO {
    static async obtenerTodos() {
        const beasts = [];
        const querySnapshot = await getDocs(collection(db, "Beasts"));

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Mapeamos los datos de Firestore a nuestra clase Beast
            const beast = new Beast(
                data.Nombre,
                data.Descripcion,
                data.Imagen,
                data.Tipo,
                data.Vida,
                data.Ataque,
                data.Defensa
            );
            beasts.push(beast);
        });

        return beasts;
    }
}
