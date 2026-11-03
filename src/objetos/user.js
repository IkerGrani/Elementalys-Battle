export class User {

    constructor(uid, email, usuario, fechaNacimiento, partidasJugadas, partidasGanadas, fechaUltimaPartida) {
        this.uid = uid,
        this.email = email,
        this.usuario = usuario,
        this.fechaNacimiento = fechaNacimiento,
        this.partidasJugadas = partidasJugadas,
        this.partidasGanadas = partidasGanadas,
        this.fechaUltimaPartida = fechaUltimaPartida
    }

    createUserFromFireBase() {
        return new User({
            uid: uid,
            email: email,
            usuario: docData.Usuario,
            fechaNacimiento: docData.Fecha_Nacimiento,
            partidasJugadas: docData.Partidas_Jugadas,
            partidasGanadas: docData.Partidas_Ganadas,
            fechaUltimaPartida: docData.Fecha_Ultima_Partida
        });
    }

    /**
     * Funcion para crear los datos deseados en firebase a partir del 
     * objeto User.
     */    
    toFirebase() {
        
    }

}
