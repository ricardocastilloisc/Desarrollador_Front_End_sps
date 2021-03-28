# NotesApp
RICARDO ORLANDO CASTILLO OLIVERA  .·.

*Este proyecto esta en Angular version 11.1.3.*

Para instalar el proyecto  tendras que ir a 
*/Desarrollador_Front_End_sps/stack_angular/notes_app_sps/NotesApp*

Ejecutar 

***npm install***

Para ejecutar el proyecto en es ejecutar el el comando

***ng s***

Podras acceder al proyeto en 

*http://localhost:4200*

Para ejecuat el back end tendras que ir  a:

*/Desarrollador_Front_End_sps/stack_angular/notes_app_sps_back_end*

Ejecutar 

***npm install***

y para ejecutar el backEnd tendra que usar el comando:

***node app***

Las apis estaran disponibles con:

*http://localhost:5000*


**Consideraciones :**
> Debes tener instalado mongodb referenciado una base de datos por defecto la base de datos se llama **notes****

La unica api que funcionara sin restricciones de token sera de crear nuevo usuario para poder crear nuevo usario tendra que hacer un POST en cualquier herramienta (sea POSTMAN)

Ejemplo

POST:  *http://localhost:5000/servicio/api_notes_app/users*

*{
    "nombre": "user",
    "email": "admin@yopmail.com",
    "password": "123",
    "rol": 1
}
*
##### #### ### ## # Mas datos de importancia 

**Portal en AWS:**
http://54.156.219.57/#/login

**Video Explicativo del flujo del portal Youtube:**
https://www.youtube.com/watch?v=AYOYUBB1s3g

**Documentación de apis**
https://documenter.getpostman.com/view/5868078/TzCJdoqH
