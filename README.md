# 🚀 Gestion Solicitudes Frontend

📌 **Breve descripción:**  
Este proyecto es una aplicación frontend desarrollada en Angular para gestionar solicitudes de usuarios, permitiendo la creación, edición y seguimiento de solicitudes.

---

## 📋 Requisitos Previos

Antes de instalar el proyecto, asegúrate de tener instalado:

- **Node.js** (versión 19 o superior) 🟢
- **npm** (versión 9 o superior) 📦
- **Angular CLI** (versión 17 o superior) 🅰️

Puedes verificar las versiones instaladas ejecutando los siguientes comandos:

```bash
node -v
npm -v
ng version
```

---

## ⚙️ Instalación

Sigue estos pasos para instalar y configurar el proyecto:

1. **📥 Clonar el repositorio:**

```bash
git clone https://github.com/HenryMJL/Gestion-de-Solicitudes-Frontend.git
cd Gestion-de-Solicitudes-Frontend
```

2. **📦 Instalar dependencias:**

```bash
npm install
npm install -g @angular/cli@17
```

3. **🚀 Iniciar la aplicación:**

```bash
ng serve
```

La aplicación estará disponible en http://localhost:4200/.

---
## 🔑 Credenciales de Prueba

Para probar la aplicación, puedes utilizar las siguientes credenciales de prueba:

- **Usuario:** `admin@wareking.com`
- **Contraseña:** `12345678`

Estas credenciales te permitirán acceder a la aplicación y explorar sus funcionalidades sin necesidad de crear una cuenta nueva.

---


## 📤 Despliegue

Para desplegar la aplicación en un entorno de producción, sigue estos pasos:

1. **⚙️ Construir la aplicación:**

```bash
ng build --prod
```

2. **📂 Subir los archivos generados en la carpeta** dist/ **al servidor de hosting.**

---

## 📂 Estructura del Proyecto

Explicación de la estructura de carpetas y archivos del proyecto:

```bash
src/
│── app/
│   ├── 📁 components/    # Componentes reutilizables de la aplicación
│   ├── 📁 services/      # Servicios para manejar lógica de negocio y API calls
│   ├── 📁 interceptors/  # Interceptores HTTP para manejar solicitudes y respuestas
│   ├── 📁 pages/         # Páginas principales de la aplicación
│   ├── 📁 guards/        # Guards para proteger rutas y gestionar autenticación
│── 📁 environments/      # Configuraciones de entornos (desarrollo y producción)
```

---

## 🛠️ Tecnologías Utilizadas

Este proyecto utiliza las siguientes tecnologías:

🅰️ **Angular 17**  
📜 **TypeScript**  
🔄 **RxJS**  
🚀 **Angular CLI**  
🌍 **Node.js**  
📦 **npm**  
🎨 **Bootstrap**  
🎭 **Angular Material**  
📊 **ng2-charts**  
📈 **chart.js**

---

## 📌 Uso

Para utilizar la aplicación, sigue estos pasos:

1. **🔑 Inicia sesión con tus credenciales.**
2. **📋 Navega por el menú e interactúa con la aplicación.**
3. **✏️ Crea, edita o sigue una solicitud según sea necesario.**

---

## 📐 Decisiones Técnicas

- **Uso de Angular**: Se eligió **Angular 17** por su arquitectura basada en componentes, su soporte robusto para formularios reactivos y su integración con RxJS.
- **Gestión de estado con RxJS**: Permite manejar eventos asincrónicos de manera eficiente sin depender de librerías externas como NgRx.
- **Interceptors en HTTP**: Facilitan la inyección automática del token de autenticación y la gestión centralizada de errores de API.

---

## ⚠️ Manejo de Errores

Los errores se manejan de la siguiente manera:

**🖥️ Frontend:** Uso de interceptores HTTP para capturar y manejar errores.  
**🖥️ Backend:** Respuestas de error estructuradas y códigos de estado HTTP adecuados.

---

## 🔐 Autenticación y Autorización

El sistema de autenticación implementado en este proyecto se basa en **Laravel Sanctum**, permitiendo la gestión segura de la autenticación y los permisos de usuario.

En el frontend, Angular se encarga de almacenar y gestionar el token de acceso proporcionado por **Laravel Sanctum**, asegurando su inclusión en cada solicitud a las API protegidas. De este modo, se garantiza el acceso seguro a los recursos del backend, restringiendo las operaciones según los permisos del usuario autenticado.

---

## 🎯 Estándares de Código

Las reglas y convenciones de código utilizadas incluyen:

🎨 **Prettier** para formateo de código.  
🔍 **ESLint** para análisis estático de código.

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo `LICENSE` para más detalles.

```text
MIT License

© [2025] Henry Jimenez

Se concede permiso, de forma gratuita, a cualquier persona que obtenga una copia
de este software y los archivos de documentación asociados (el "Software"), para
utilizar el Software sin restricciones, incluyendo sin limitación los derechos
de uso, copia, modificación, fusión, publicación, distribución, sublicencia y/o
venta de copias del Software, y para permitir a las personas a quienes se les
proporcione el Software a hacer lo mismo, sujeto a las siguientes condiciones:

El aviso de copyright anterior y este aviso de permiso se incluirán en todas las
copias o partes sustanciales del Software.

EL SOFTWARE SE PROPORCIONA "TAL CUAL", SIN GARANTÍA DE NINGÚN TIPO, EXPRESA O
IMPLÍCITA, INCLUYENDO PERO NO LIMITADO A GARANTÍAS DE COMERCIALIZACIÓN, IDONEIDAD
PARA UN PROPÓSITO PARTICULAR Y NO INFRACCIÓN. EN NINGÚN CASO LOS AUTORES O
TITULARES DEL COPYRIGHT SERÁN RESPONSABLES DE NINGUNA RECLAMACIÓN, DAÑO U OTRA
RESPONSABILIDAD, YA SEA EN UNA ACCIÓN CONTRACTUAL, AGRAVIO O CUALQUIER OTRA FORMA,
DERIVADA DE O EN CONEXIÓN CON EL SOFTWARE O EL USO U OTRO TIPO DE ACCIONES EN EL
SOFTWARE.
```
