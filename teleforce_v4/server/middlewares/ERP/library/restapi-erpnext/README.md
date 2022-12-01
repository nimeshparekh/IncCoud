# restapi-erpnext 
Este modulo esta diseñado para consumir a la API REST de APIRESTERPNext V10+ usala para consumir los servicios de su APIRESTERPNext, esta libreria esta realizada apartir de la base y aporte de  pawanpandey4zip y pawangspandey,
basandonos en la documentacion de frape y dandole opcion a los desarrolladores MEAN se hace publica esta libreria con el fin de reusarla y mejorarla 

# Dice frappe en su Documentación
Frappe.io se envía con una API HTTP que se puede clasificar en Llamadas a procedimiento remoto (RPC), para llamar a los métodos de la lista blanca y la transferencia de estado representacional (REST), para manipular recursos.

La URL base es https: // {su instancia de frappe}. Todas las solicitudes que se muestran aquí deben agregarse al final de su URL base. Por ejemplo, si su instancia es demo.erpnext.com, GET / api / resource / User significa GET https://demo.erpnext.com/api/resource/User.

Todos los documentos en Frappe están disponibles a través de una API RESTful con el prefijo / api / resource /. Puede realizar todas las operaciones de CRUD en ellos:

## Crear

Puede crear un documento enviando una solicitud POST al punto final, / api / resource / {doctype}.

## Leer

Puede obtener un documento por su nombre utilizando el punto final, / api / resource / {doctype} / {name}

## Actualizar

Puede crear un documento enviando una solicitud PUT al punto final, / api / resource / {doctype} / {nombre}. Esto actúa como una solicitud de PATCH HTTP en la que no tiene que enviar todo el documento sino solo las partes que desea cambiar.

## Borrar

Puede eliminar un documento por su nombre enviando una solicitud DELETE al punto final, / api / resource / {doctype} / {name}.


```js
var APIRESTERPNext = require('restapi-erpnext');

var APIRESTERPNext = new APIRESTERPNext({
    username : 'Usuario',
    password : 'Clave',
    baseUrl  : 'http://localhost:8000' //Erpnext Instalado V10+ Porduccion u Develop
})

```

## Installation

```bash
$ npm install restapi-erpnext
```

## Recursos
 
Puede Usar  los Métodos de petición HTTP (GET, POST,PUT,DELETE) + EL recurso a usar ejemplo Metodo GET
Los Argumentos de la funcion trabajan de la siguiente manera

'/api/resource/User', 'GET', null

1. Recurso a Utilizar (Este puede ser de tipo '/api/resource/User' o 'api/method/frappe.auth.get_logged_user')
2. Metodo (GET, GETID ,POST,PUT,DELETE)
3. Parametros del recurso; En dado caso que sea tipo  GET  Este ultimo se envia NUll para los demas caso este es Obligatorio, Si intentas Acceder al recurso enviando los parametros nullos Devolvera Error *500 

Nota: Si deseas enviar mas parametros en el HEADER de la peticion Escribeme : fredyteheran91@gmail.com


```js

//Vamos a traer todos los Usuarios Registrados en NUestro ERP  

APIRESTERPNext.sainterpnext('/api/resource/User', 'GET', null).then(function (res) {
  console.log('Resultado', res);
})
//Puedes Probar los demas Metodos.
```

