//jshint esversion:6



/*
En este archivo estarán las declaraciones y definiciones de funciones y
objetos que se utilizarán en todo el proyecto.
*/



class Sala{
  constructor(asientos){

    //Si se recibe una lista de asientos (de localStorage), la toma. Si no, genera una nueva.
    this.asientos = asientos || this.generarAsientos();

    const objetoSesion = JSON.parse(localStorage.getItem("sesion"));
    this.asientosReservados = [];

  }

  generarAsientos(){
    let filas = [];

    for(let i=0; i<6; i++){
      let columna = [];
      for(let j=0; j<6; j++){
        columna.push(definirAsiento());
      }
      filas.push(columna);
    }
    return filas;
  }

  quitarReserva(fila, columna){
    if(fila <= 6 && columna <= 6){
      if(this.asientos[fila][columna] == 1 && this.asientosReservados.includes(obtenerIdDeCoordenadas([fila, columna]))){
        this.asientos[fila][columna] = 0;
      }
    }
  }
  reservarAsiento(fila, columna){
    if (fila <= 5 && columna <= 5){
      if (this.asientos[fila][columna] == 0){
        //El asiento pasa a estar "ocupado".
        this.asientos[fila][columna] = 1;
      }
    }
  }
}

class FuncionCineTeatro{
  constructor(tipo, nombre, generos, lenguaje, id){
    this.tipo = tipo;
    this.nombre = nombre;
    this.generos = generos;
    this.lenguaje = lenguaje;
    this.id = id;

    this.fecha = generarFechaAleatoria();

    this.sala = new Sala();
  }
}

//Filtrado
class FiltroFunciones{
  constructor(listaDeFunciones){
    this.listaDeFunciones = listaDeFunciones;
    this.funcionesFiltradas = listaDeFunciones;
  }

  filtrar(cat, gen, leng){
    this.funcionesFiltradas = this.listaDeFunciones;
    if (cat != "Todo"){
      this.funcionesFiltradas = this.listaDeFunciones.filter(obj => obj.tipo == cat);
    }
    if (gen != "Todo"){
      this.funcionesFiltradas = this.funcionesFiltradas.filter(obj => obj.generos.includes(gen));
    }
    if (leng != "Todo"){
      this.funcionesFiltradas = this.funcionesFiltradas.filter(obj => obj.lenguaje == leng);
    }
  }
}

class Carrusel{
  constructor(){
    this.carrusel_funciones = document.getElementById("myCarousel");
    this.construirDivsExteriores();
    this.agregarFunciones();
    this.agregarBotones();
  }



  filtrar(param1, param2, param3){
    this.lista_funciones = objetoFiltros.filtrar(param1, param2, param3);
    this.agregarFunciones();
  }



  //Agrega los botones para desplazarse.
  agregarBotones(){
    const botonNext = document.createElement('button');
    botonNext.classList.add("carousel-control-next");
    botonNext.setAttribute("data-bs-target", "#myCarousel");
    botonNext.setAttribute("data-bs-slide", "next");
    botonNext.setAttribute("type", "button");
    botonNext.innerHTML = `
    <span class="carousel-control-next-icon"></span>
    `;

    const botonPrev = document.createElement('button');
    botonPrev.classList.add("carousel-control-prev");
    botonPrev.setAttribute("data-bs-target","#myCarousel");
    botonPrev.setAttribute("data-bs-slide", "prev");
    botonPrev.setAttribute("type", "button");
    botonPrev.innerHTML = `
    <span class="carousel-control-prev-icon"></span>
    `;

    document.getElementById("myCarousel").appendChild(botonNext);
    document.getElementById("myCarousel").appendChild(botonPrev);

  }
  //Invoca al creador de slides y a la funcion insertadora de tarjetas(portadas). Resetea los slides y la lista de funciones.
  agregarFunciones(){

    this.lista_funciones = objetoFiltros.funcionesFiltradas;
    this.crearSlides();
    let cont = 0;
    for(let i = 0; i < this.cantidadSlides; i++){
      const itemActual = document.getElementById(`item${i}`);
      itemActual.innerHTML = "";
      if (this.lista_funciones.length - cont >= 3){
        for (let j = 0; j < 3; j++){
          this.insertarTarjeta(this.lista_funciones[cont], `item${i}`);
          cont++;

        }
      }
      else{
        let cantidadAgregar = this.lista_funciones.length - cont;
        for (let j = 0; j < cantidadAgregar; j++){
          this.insertarTarjeta(this.lista_funciones[cont], `item${i}`);
          cont++;
        }
      }
    }
    agregarListenerAPortadas();
  }

  //construye todos los divs ancestros a los elementos del carrusel.
  construirDivsExteriores(){
    const nuevoCarrusel = document.createElement('div');
    nuevoCarrusel.setAttribute("id", "myCarousel");
    nuevoCarrusel.setAttribute("data-bs-ride", "carousel");
    nuevoCarrusel.classList.add("carousel", "slide");


    this.listaSlidesHtml = document.createElement('ol');
    this.listaSlidesHtml.classList.add("carousel-indicators");



    const contenedorExterior = document.createElement('div');
    contenedorExterior.classList.add("row");
    contenedorExterior.innerHTML = `
    <div id="interiorCarrusel" class="col-10 carousel-inner">
    </div>
    `;
    nuevoCarrusel.appendChild(contenedorExterior);
    document.getElementById("espacioCarrusel").appendChild(nuevoCarrusel);
  }

  //Determina y crea la cantidad de slides e indicadores necesarios.
  crearSlides(){
    //Devuelve la cantidad de slides que va a tener el carrusel.
    this.cantidadSlides = Math.floor(this.lista_funciones.length/3);
    if(this.lista_funciones.length%3 ==1 || this.lista_funciones.length%3 ==2) this.cantidadSlides++;

    //inserta los indicadores de slides del carrusel.
    this.listaSlidesHtml.innerHTML = "";
    for(let i = 0; i < this.cantidadSlides; i++){
      const nuevoSlide = document.createElement('li');
      nuevoSlide.setAttribute('data-bs-target',"#myCarousel");
      nuevoSlide.setAttribute('data-bs-slide-to',`${i}`);
      nuevoSlide.setAttribute('id', `slide${i}`);
      if(i == 0){
        nuevoSlide.classList.add("active");
      }
      this.listaSlidesHtml.appendChild(nuevoSlide);
    }
    document.getElementById("myCarousel").appendChild(this.listaSlidesHtml);

    //Inserta los slides del carrusel.
    const interior = document.getElementById("interiorCarrusel");
    interior.innerHTML = "";
    for(let i = 0; i < this.cantidadSlides; i++){
      const itemCarrusel = document.createElement('div');
      itemCarrusel.classList.add("carousel-item");
      if(i == 0) itemCarrusel.classList.add("active");
      itemCarrusel.innerHTML = `
      <div id="item${i}" class="row"> </div>
      `;


      interior.appendChild(itemCarrusel);
    }
  }

  //inserta una tarjeta(portada) dentro de un slide(idElemento).
  insertarTarjeta(funcionCT, idElemento){
    const id = funcionCT.id;
    const divCarr = document.getElementById(idElemento);
    const nuevaTarjeta = document.createElement('div');
    nuevaTarjeta.classList.add("carrElem", "col-4", "d-flex", "justify-content-center");
    nuevaTarjeta.innerHTML = `
    <img src="../sources/portada-${id}.jpg" id =${funcionCT.id} class="img-fluid itemImage w-100">
    `;

    divCarr.appendChild(nuevaTarjeta);
  }
}



function obtenerCoordenadasDeId(id){
  let coords = id.split("", 3);
  coords.shift();

  return coords;
}

function obtenerIdDeCoordenadas(coords){
  const id = `a${coords[0]}${coords[1]}`;
  return id;
}


function aleatorioEntre(a, b){
  return Math.floor(Math.random()*(a-b) +b);
}

function generarFechaAleatoria(){

  let fechaActual = new Date();
  let mesActual = fechaActual.getMonth();
  let diaActual = fechaActual.getDate();

  const day = aleatorioEntre(diaActual+1, 28);
  const month = aleatorioEntre(mesActual+1, 12);
  const hour = aleatorioEntre(15, 22);
  const year = 2022;
  const fecha = `${day}/${month}/${year} ${hour}:00`;
  return fecha;
}

//Cuando se habla de funciones, refiere a Funcion de cine/Funcion de teatro.
function construirFuncionesCineTeatro(){
  let listaDeFunciones = [];

  //Sao
  listaDeFunciones.push(new FuncionCineTeatro("Cine", "Sword Art Online Progressive", ["Animación", "Aventura", "Acción", "Ciencia Ficción"], "Subtitulado", "sao"));
  //Harry Potter
  listaDeFunciones.push(new FuncionCineTeatro("Cine", "Harry Potter y las Reliquias de la Muerte - Parte 2", ["Aventura", "Fantasía"], "Subtitulado", "hp2"));
  //Romeo y Julieta
  listaDeFunciones.push(new FuncionCineTeatro("Teatro", "Romeo y Julieta", ["Drama", "Romance"], "Español", "ryj"));
  //Hamlet
  listaDeFunciones.push(new FuncionCineTeatro("Teatro", "Hamlet", ["Drama"], "Español", "hamlet"));
  //El Señor de los Anilos
  listaDeFunciones.push(new FuncionCineTeatro("Cine", "El Señor de los Anillos", ["Aventura", "Fantasía"], "Español", "lotr"));
  //matrix
  listaDeFunciones.push(new FuncionCineTeatro("Cine", "Matrix", ["Ciencia Ficción", "Acción", "Aventura", "Fantasía"], "Subtitulado", "matrix"));
  //Rey León
  listaDeFunciones.push(new FuncionCineTeatro("Cine", "Rey León", ["Fantasía", "Animación", "Aventura", "Infantil", "Drama"], "Español", "rl"));
  //La Era de Hielo
  listaDeFunciones.push(new FuncionCineTeatro("Cine", "La Era de Hielo 4", ["Fantasía", "Animación", "Aventura", "Infantil", "Comedia"], "Español", "edh"));
  //Titanic
  listaDeFunciones.push(new FuncionCineTeatro("Cine", "Titanic", ["Drama", "Romance"], "Español", "titanic"));
  //Caperucita Roja
  listaDeFunciones.push(new FuncionCineTeatro("Teatro", "Caperucita Roja", ["Aventura", "Infantil"], "Español", "cr"));
  //El Exorcista
  listaDeFunciones.push(new FuncionCineTeatro("Cine", "El Exorcista", ["Terror"], "Español", "exorcista"));
  //La Máscara
  listaDeFunciones.push(new FuncionCineTeatro("Cine", "La Máscara", ["Comedia"], "Español", "mask"));
  //Efecto Mariposa
  listaDeFunciones.push(new FuncionCineTeatro("Cine", "El Efecto Mariposa 2", ["Drama", "Ciencia Ficción"], "Subtitulado", "em"));


  return listaDeFunciones;
}


function definirAsiento(){

  return Math.random() > 0.5 ?  1 : 0;
}

function agregarListenerAPortadas(){
  const portadas = document.getElementsByClassName("itemImage");
  const arregloPortadas = Array.from(portadas);

  arregloPortadas.forEach(portada =>{
    portada.addEventListener('click', (event) =>{
      mostrarSala(event.target.id);
    });
  });
}




function mostrarSala(funcionID){
  window.location.href=`../pages/sala.html?funcion=${funcionID}`;
}





class DisplayAsientos{
  constructor(sala){
    this.sala = sala;
    this.generarAsientosGrafico(sala);
    this.agregarListenersAsientos();
  }

  generarAsiento(fila, columna, sala){
    const objetoSesion = JSON.parse(localStorage.getItem("sesion"));
    const nuevoAsiento = document.createElement('td');
    const numDisp = sala.asientos[fila][columna];
    let disponibilidad;
    switch(numDisp){
      case 0:
        disponibilidad ="disponible";
        break;
      case 1:
        disponibilidad ="ocupado";
        if(objetoSesion.login_username != null){
          if (sala.asientosReservados.includes(obtenerIdDeCoordenadas([fila, columna]))){
            disponibilidad="seleccionado";
          }
        }
        break;
    }
    nuevoAsiento.innerHTML =`
      <img src="../sources/iconoSilla-${disponibilidad}.svg" class="iconoSilla ${disponibilidad}" id=a${fila}${columna}>
    `;

    return nuevoAsiento;
  }

  generarFila(fila, sala){
    const nuevaFila = document.createElement('tr');
    for(let j = 0; j<6; j++){
      nuevaFila.appendChild(this.generarAsiento(fila, j, sala));
    }

    return nuevaFila;
  }

  generarAsientosGrafico(sala){
    const contenedorAsientos = document.createElement('table');
    contenedor.appendChild(contenedorAsientos);
    for(let i = 0; i<6; i++){
      contenedorAsientos.appendChild(this.generarFila(i, sala));
    }
  }

  agregarListenersAsientos(){
    const lista_asientos = document.getElementsByClassName("iconoSilla");
    const array_asientos = Array.from(lista_asientos);

    array_asientos.forEach(asiento =>{
      asiento.addEventListener('click', (event)=>{
        reservarAsientoDesdeGrafico(event.target.id, event.target.classList);
      });
    });
  }
}

function reservarAsientoDesdeGrafico(id, lista_clases){

  const coords = id.split("", 3);

  let [, coordFila, coordColumna] = coords;

  const clases_asiento = Array.from(lista_clases);
  const disponibilidad = clases_asiento[1];

  if(disponibilidad == "disponible"){
    if(funcionObjetivo.sala.asientosReservados.length < 2){
      funcionObjetivo.sala.reservarAsiento(coordFila, coordColumna);
      const html_asiento = document.getElementById(id);
      html_asiento.classList.remove("disponible");
      html_asiento.classList.add("seleccionado");
      html_asiento.setAttribute('src', `../sources/iconoSilla-seleccionado.svg`);
      funcionObjetivo.sala.asientosReservados.push(id);
    }
    else{
      Toast.fire({
        title: 'Sólo pueden reservarse hasta dos asientos.',
        icon: 'error'
      });
    }
  }
  else if (disponibilidad == "seleccionado"){
    funcionObjetivo.sala.quitarReserva(coordFila, coordColumna);
    const html_asiento = document.getElementById(id);
    html_asiento.classList.remove("seleccionado");
    html_asiento.classList.add("disponible");
    html_asiento.setAttribute('src', `../sources/iconoSilla-disponible.svg`);
    indice = funcionObjetivo.sala.asientosReservados.indexOf(id);
    funcionObjetivo.sala.asientosReservados.splice(indice, 1);
  }
}

if(localStorage.length == 0){
  lista_funciones = construirFuncionesCineTeatro();

  let sesionGeneral = {
    sesion_lista_funciones:  lista_funciones,
    login_username: null
  };

  let sesionTexto = JSON.stringify(sesionGeneral);
  localStorage.setItem("sesion", sesionTexto);
  const objetoSesion = sesionGeneral;
}
const objetoSesion = JSON.parse(localStorage.getItem("sesion"));
lista_funciones = objetoSesion.sesion_lista_funciones;
lista_funciones.forEach( funcion =>{
  funcion.sala = new Sala(funcion.sala.asientos);
});
