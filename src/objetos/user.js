export class User {

    constructor(uid, email, usuario, fechaNacimiento, partidasJugadas, partidasGanadas, fechaUltimaPartida) {
        this.uid = uid;
        this.email = email;
        this.usuario = usuario;
        this.fechaNacimiento = fechaNacimiento;
        this.partidasJugadas = partidasJugadas;
        this.partidasGanadas = partidasGanadas;
        this.fechaUltimaPartida = fechaUltimaPartida
    }

    /**
     * Funcion para crear un objeto User a partir de un documento de firebase, en este caso
     * el docuemnto sera "Usuarios".
     * 
     * @param {string} uid Identificador de firebase.
     * @param {string} email Correo del usuario.
     * @param {Object} docData Datos del usuario obtenido de firebase.
     * @returns Retorna el nuevo objeto User creado.
     */
    static createUserFromFireBase(uid, email, docData) {
        return new User(
            uid,
            email,
            docData.Usuario,
            docData.Fecha_Nacimiento,
            docData.Partidas_Jugadas,
            docData.Partidas_Ganadas,
            docData.Fecha_Ultima_Partida
        );
    }

    /**
     * Funcion para crear los datos deseados en firebase a partir del 
     * objeto User.
     * @returns Devuelve el objeto en el formato que firebase desea.
     */   
    toFirebase() {
        return {
            Usuario: this.usuario,
            Fecha_Nacimiento: this.fechaNacimiento,
            Partidas_Jugadas: this.partidasJugadas,
            Partidas_Ganadas: this.partidasGanadas,
            Fecha_Ultima_Partida: this.fechaUltimaPartida
        }
    }

    /**
     * Funcion para guardar la informacion del usuario en el SessionStorage.
     * @returns Devuelve el objeto para guardar.
     */
    toSessionObject() {
        return {
            uid: this.uid,
            email: this.email,
            Usuario: this.usuario,
            Partidas_Jugadas: this.partidasJugadas,
            Partidas_Ganadas: this.partidasGanadas,
            Fecha_Nacimiento: this.fechaNacimiento,
            Fecha_Ultima_Partida: this.fechaUltimaPartida,
            // 3 dias en milisegundos
            expira: new Date().getTime() + 3 * 24 * 60 * 60 * 1000 
        };
    }

    /**
     * Actualiza las tanto las partidas ganadas como las partidas jugadas,
     * tras finalizar un combate o partida.
     * @param {boolean} victory True si se gano la partida, false si perdio.
     */
    registerMatchResult(victory) {
        this.partidasJugadas += 1;
        if (victory) {
            this.partidasGanadas += 1;
        }
        this.fechaUltimaPartida = new Date();
    }
}
