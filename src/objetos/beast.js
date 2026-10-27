export class Beast {
    constructor(nombre, descripcion, imagen, tipo, vida, ataque, defensa) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.imagen = imagen;
        this.tipo = tipo;
        this.vida = vida;
        this.ataque = ataque;
        this.defensa = defensa;
    }

    usarAtaque1() {
        console.log(`${this.nombre} usa Ataque normal!`);
        return this.ataque1.dano + this.ataque;
    }

    usarAtaque2() {
        console.log(`${this.nombre} usa Ataque elemental!`);
        return this.ataque2.dano + this.ataque;
    }



}
