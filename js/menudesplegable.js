
	"use strict";

	/*MENU DESPLEGABLE*/
	document.addEventListener("DOMContentLoaded",
	  iniciarPagina);

	function iniciarPagina(){
		
	document.querySelector("#btn-menu").addEventListener("click",function(){
		document.querySelector(".menu").classList.toggle("menu-desplegable");
	});


	}