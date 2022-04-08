//jshint esversion:6


let objetoFiltros = new FiltroFunciones(lista_funciones);

carr = new Carrusel(lista_funciones);

//Se capturan los elementos del formulario.
let selectGenre = document.getElementById("selectGenre");
let selectType = document.getElementById("selectType");
let selectLanguage = document.getElementById("selectLanguage");
let menuFiltros = document.getElementById("menuFiltros");


menuFiltros.addEventListener('submit', (evento) =>{
  evento.preventDefault();
  let tipo = selectType.value;
  let gen = selectGenre.value;
  let leng = selectLanguage.value;

  carr.filtrar(tipo, gen, leng);
});
