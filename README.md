# ⚔️ Elementalys Beasts: Battle

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

Minijuego de combate estratégico por turnos, inspirado en mecánicas clásicas tipo Pokémon y con criaturas propias llamadas **Beasts**.

---

## Descripción del Proyecto

El juego consiste en un minijuego de combate por turnos inspirado en los juegos clásicos 
como Pokémon, ambientado en nuestro caso con criaturas propias denominadas Beasts. El 
pilar del juego se basa en la estrategia de equipo y en la predicción de combate mediante 
diferentes elementos, en nuestro caso, cada elemento supera a dos tipos y es superado 
por otros dos. .

### Sistema de combate 
El sistema utiliza 5 atributos de combate. El diseño de tener doble ventaja y doble debilidad 
garantiza que cualquier elemento sea superable en combate.:

* **PHY (Físico)** ➔ Fuerte contra *AGL* e *INT* | Débil contra *STR* y *TEQ*.
* **STR (Fuerza)** ➔ Fuerte contra *TEQ* y *PHY* | Débil contra *AGL* e *INT*.
* **AGL (Agilidad)** ➔ Fuerte contra *STR* e *INT* | Débil contra *PHY* y *TEQ*.
* **TEQ (Técnica)** ➔ Fuerte contra *PHY* y *AGL* | Débil contra *STR* e *INT*.
* **INT (Inteligencia)** ➔ Fuerte contra *STR* y *TEQ* | Débil contra *PHY* y *AGL*.

---

## Funcionalidades y Vistas de la Aplicación

1. **Menú Principal:**
   - Centro de navegación hacia todas las secciones del juego.
   - **Acceso restringido:** Redirige a login/registro si el usuario intenta jugar, ver el ranking o cambiar opciones sin autenticarse.

2. **Campo de Batalla:**
   - **Arena visual:** Enfrentamiento por turnos en perspectiva clásica (sprite de espaldas para el jugador y frontal para el rival) con barras de vida (HP) y nombres.
   - **Toma de decisiones:** Menú para seleccionar ataques elementales o desplegar una ventana emergente (*modal*) para relevar entre las 3 criaturas del equipo.
   - **Historial e intentos:** Caja de eventos con descripciones del turno actual, registro detallado (*Log*) de acciones y contador de partidas jugadas en la sesión.

3. **Catálogo de Beasts:**
   - Pantalla visual con tarjetas individuales para cada beast.
   - Muestra nombre, sprite, estadísticas base de combate (HP, ATK, DEF) y su atributo.
   - Incluye botón de retorno directo al Menú Principal.

4. **Gestión de Usuarios y Perfil:**
   - **Pestaña Login:** Formulario de autenticación básica (usuario y contraseña) con redirección al Menú Principal.
   - **Pestaña Registro / Perfil:** Formulario reutilizable (nombre, usuario, contraseña, fecha de nacimiento y correo) que se presenta vacío para altas nuevas o precargado para editar los datos si la sesión ya está activa.

5. **Tabla de Clasificación:**
   - Cuadro de honor con el Top 10 de mejores jugadores ordenados por victorias acumuladas.
   - Detalle por fila: posición, avatar, nombre, puntuación y sello temporal (fecha y hora).
   - Acciones de control: Botón de reseteo del ranking y botón de retorno al inicio.

6. **Panel de Opciones:**
   - Ajustes de accesibilidad visual y personalización de interfaz para el usuario (tamaño tipográfico, fuentes y contraste/grosor).

---

## 📁 Estructura del Proyecto

```text
elementalys-battle/
├── assets/                   # Recursos para la página
│   ├── images/
│   ├── fonts/
│   └── icons/
├── other/                    # Recursos adicionales del proyecto
├── pages/                    # Documentos html del proyecto  
├── src/                      # Lógica de programación
├── styles/                   # Hojas de estilo
├── README.md                 # Documentación general del repositorio
└── index.html                # Punto de entrada principal
```