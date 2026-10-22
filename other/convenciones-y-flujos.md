# Guía de Convenciones de Código, Nomenclatura y Flujo de Trabajo
**Proyecto:** Elementalys Battle  
**Curso:** 2º Desarrollo de Aplicaciones Web (2DAW)  
**Autores:** Steven Arce, Iker Sánchez  

---

## 1. Estructura de Carpetas del Proyecto

Para nuestro proyecto hemos seleccionado la siguiente estructura de carpetas:

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

---

## 2. Definición de nomenclatura

Para tener un código mas "limpio", se establecen los siguientes estándares de nombres:

### 2.1. Archivos y Carpetas
* **Formato:** `kebab-case` (minúsculas separadas por guion medio).
* **Ejemplos:** `battle-view.js`, `beasts-data.js`, `main-style.css`.

### 2.2. JavaScript
* **Variables, propiedades, funciones y metodos:** `camelCase`.
  * *Ejemplo:* `currentBeast`, `playerScore`, `sessionAttempts`.
* **Constantes:** `UPPER_SNAKE_CASE`.
  * *Ejemplo:* `MAX_RANKING_ENTRIES = 10`, `ELEMENT_ADVANTAGE_MULTIPLIER = 1.5`.

### 2.3. CSS3 y Clases
* **Formato:** `kebab-case` (minúsculas separadas por guion medio).
* **Ejemplos:** `card-beast`.


### 2.4. Control de Versiones: Ramas de Git
* **Formato:** `nombre-de-la-carpeta/descripcion-corta` (en minúsculas).

---

## 3. Flujo de trabajo y colaboración en GitHub

1. **Rama Principal (`main`):** Código estable y probado. No se hacen *commits* directos.
2. **Rama Desarrollo (`develop`):** Código de desarrollo y pruebas.
3. **Creación de Tarea:** Cada miembro del equipo toma una tarjeta del tablero de Trello e inicia la rama correspondiente a partir de `develop` (`nombre-de-la-carpeta/descripcion-corta`).