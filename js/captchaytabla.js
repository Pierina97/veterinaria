"use strict";

document.addEventListener("DOMContentLoaded",
	iniciarPagina);

function iniciarPagina() {

	//VALIDAR FORMULARIO 
	let form = document.querySelector('#formulario-consultas');
	form.addEventListener('submit', agregar);

	function agregar(e) {
		e.preventDefault();
		//para agarrar todos los datos del formulario , mas sencillo
		let formData = new FormData(form);
		//despues del get va lo que ponemos en name en el formulario
		let nombre = formData.get('nombre');
		let email = formData.get('correoelectronico');
		let telefono = formData.get('telefono');
		let consultas = formData.get('consultas');
	}

	/*CAPTCHA*/
	let boton = document.querySelector("#btncaptcha");
	boton.addEventListener("click", cambiarCaptcha);

	let captcha = 1;

	function cambiarCaptcha() {
		document.querySelector("#logocaptcha").src = "imagenes/imagen" + captcha + ".gif";

		captcha = captcha + 1;

		if (captcha > 4) {
			captcha = 1;
		}
	}

	let enviar = document.querySelector("#botonenviar");
	enviar.addEventListener("click", verificarCaptcha);

	function verificarCaptcha() {
		let input = document.querySelector("#input").value.toLowerCase();
		let enviado = 'Su consulta ha sido enviada';
		let rechazado = 'Incorrecto vuelva a intentarlo';

		if (input == 'gato' && captcha == 2) {
			textoConfirmacion.innerHTML = enviado;
		} else if (input == 'perro' && captcha == 3) {
			textoConfirmacion.innerHTML = enviado;
		} else if ((input == 'leon' || input == 'león') && captcha == 4) {
			textoConfirmacion.innerHTML = enviado;
		} else if (input == 'tortuga' && captcha == 1) {
			textoConfirmacion.innerHTML = enviado;
		} else {
			textoConfirmacion.innerHTML = rechazado;
		}
		document.getElementById("formulario-consultas").reset();
	}

	/*mis ANOTACIONES*/
	document.querySelector("#btn-lapiz").addEventListener("click", function () {
		document.querySelector(".container-tablapersonal").classList.toggle("ocultar");
	});

	/*TABLA*/
	document.querySelector("#btn-cargar").addEventListener("click", añadirCompra);
	document.querySelector("#btn-cargar3").addEventListener("click", function () {
		crear(3);
	})

	let arregloClientes = [];
	let url = `https://60d7412f307c300017a5f77c.mockapi.io/api/cliente`;

	/*GET*/
	async function cargaClientes(url) {
		try {
			let respuesta = await fetch(url);
			if (respuesta.status == 200) {
			
				arregloClientes = await respuesta.json();
				tbody.innerHTML = " ";
				for (const cliente of arregloClientes) {
					mostrarTabla(cliente);
				}

			} else {
				console.log("Otro error");
			}
		} catch (error) {
			console.log(error);
		}
	}

	function crear(cantidadFilas) {

		for (let index = 0; index < cantidadFilas; index++) {
			añadirCompra();
		}
	}

	
	async function añadirCompra() {
		let objeto = crearCompra();
		try {
			let respuesta = await fetch(url, {
				"method": "POST",
				"headers": { "Content-Type": "application/json" },
				"body": JSON.stringify(objeto)
			})
			if (respuesta.ok) {
				console.log("http 200");
				cargaClientes(url);
				mostrarTabla(objeto);
			} else if (respuesta.status == 201) {
				console.log("http 201");
			} else {
				console.log("http error");
			}
		} catch (error) {
			console.log(error);
		}
	}

	function crearCompra() {
		let nombre = document.querySelector("#nombre").value;
		let cantidad = Number(document.querySelector("#cantidad").value);
		let producto = document.querySelector("#producto").value;
		let telefono = Number(document.querySelector("#telefono").value);

		let compra = {
			"nombre": nombre,
			"cantidad": cantidad,
			"producto": producto,
			"telefono": telefono
		};
		return compra;
	}

	function mostrarTabla(cliente) {
		let tbody = document.querySelector('#tbody');
		let filas = document.createElement('tr');

		if (cliente.cantidad >= 3 && cliente.producto.toLowerCase() == "rascador") {
			filas.classList.add("fondo-tabla");
		}

		let celda_nombre = document.createElement('td');
		let celda_cantidad = document.createElement('td');
		let celda_producto = document.createElement('td');
		let celda_telefono = document.createElement('td');

		let celda_editar = document.createElement('td');
		let celda_borrar = document.createElement('td');

		let btnEditar = document.createElement('button');
		let btnBorrar = document.createElement('button');

		celda_nombre.innerHTML = cliente.nombre;
		celda_cantidad.innerHTML = cliente.cantidad;
		celda_producto.innerHTML = cliente.producto;
		celda_telefono.innerHTML = cliente.telefono;

		btnEditar.innerHTML = "Editar";
		btnBorrar.innerHTML = "Borrar";

		btnEditar.setAttribute('data-id', cliente.id);
		btnBorrar.setAttribute('data-id', cliente.id);

		btnBorrar.classList.add('btn-borrar');
		btnEditar.classList.add('btn-editar');

		filas.appendChild(celda_nombre);
		filas.appendChild(celda_cantidad);
		filas.appendChild(celda_producto);
		filas.appendChild(celda_telefono);
		filas.classList.add(`fila-${cliente.id}`);

		filas.appendChild(celda_editar);
		filas.appendChild(celda_borrar);

		celda_editar.appendChild(btnEditar);
		celda_borrar.appendChild(btnBorrar);

		tbody.appendChild(filas);

		let botonesBorrar = document.querySelectorAll(".btn-borrar");
		botonesBorrar.forEach(e => {
			e.addEventListener("click", borrar);
		});

		let botonesEditar = document.querySelectorAll(".btn-editar");
		botonesEditar.forEach(e => {
			e.addEventListener("click", modificarCliente);
		});
	}

	async function borrar() {
		let id = this.getAttribute("data-id");
		try {
			let response = await fetch(`${url}/${id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json"
				}
			});

			if (response.ok) {
				cargaClientes(url);

			} else {
				console.log("No se pudo eliminar");
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function modificarCliente() {
		let id = this.getAttribute("data-id");
		let objeto = crearCompra();

		try {
			let respuesta = await fetch(`${url}/${id}`, {
				"method": "PUT",
				"headers": { "Content-Type": "application/json" },
				"body": JSON.stringify(objeto)
			});
			if (respuesta.ok) {
				cargaClientes(url);
			} else if (respuesta.status == 201) {
				console.log("fue 201");
			} else {
				console.log("otro cosa");
			}
		} catch (error) {
			console.log(error);
		}
	}

	//FILTRO
	let btn_filtrar = document.querySelector("#btn-filtrar");
	btn_filtrar.addEventListener("click", function () {

		for (let elem of arregloClientes) {
			let filtro = Number(document.querySelector("#filtro").value);
			if (filtro > elem.cantidad) {
				document.querySelector(`.fila-${elem.id}`).classList.add("ocultar-tabla");
			}
		}
		btn_filtrar.disabled = true;
	});

	document.querySelector("#btn-quitarFiltro").addEventListener("click", function () {
		for (let elem of arregloClientes) {
			let filtro = Number(document.querySelector("#filtro").value);

			if (filtro > elem.cantidad) {
				document.querySelector(`.fila-${elem.id}`).classList.remove("ocultar-tabla");
			}
		}
		btn_filtrar.disabled = false;
	});

	/*PAGINADO*/
	document.querySelector('#btn-decrementar').addEventListener("click", function (e) {
		if(paginaActual>1){
		incrementar(-1);
		paginar();
	}
	});

	document.querySelector("#btn-incrementar").addEventListener("click", function (e) {
		incrementar(1);  
		
		paginar();
	});

	let paginaActual = 1;

	async function paginar() {
		let url = `https://60d7412f307c300017a5f77c.mockapi.io/api/cliente?page=${paginaActual}&limit=4`;
		cargaClientes(url);
	}

	function incrementar(pagina) {
		
		paginaActual += pagina;
		document.querySelector('#pagina').innerHTML = paginaActual;
	}

	cargaClientes(url);
}
