//jshint esversion:6
//Almacena la URL en una string
const urlString = window.location.search;
//Crea un objeto a partir de esa URL, con sus parametros.
const params = new URLSearchParams(urlString);
//Extrae el parametro deseado.
const idFuncion = params.get('funcion');



//A partir de la id, obtiene el objeto de la funcion objetivo.
funcionObjetivo = lista_funciones.filter(funcion => funcion.id ==idFuncion)[0];

const contenedorInfoFuncion = document.createElement('div');
contenedorInfoFuncion.classList.add("contenedor");
contenedorInfoFuncion.innerHTML = `
  <h1>${funcionObjetivo.nombre}</h1>
  <img class = "imagen-sala" src="../sources/portada-${funcionObjetivo.id}.jpg">
  <p>Tipo: ${funcionObjetivo.tipo}</p>
  <p>Lenguaje: ${funcionObjetivo.lenguaje}</p>
  <p>Fecha de estreno: ${funcionObjetivo.fecha}</p>
`;

const contenedor = document.getElementById("contenedor");
contenedor.appendChild(contenedorInfoFuncion);


function reservarBoton(){
  const nick = objetoSesion.login_username;

  //Se recupera el mapa almacenado como array.
  let mapa = new Map(JSON.parse(localStorage.getItem(nick)));
  mapa.set(funcionObjetivo.id, funcionObjetivo.sala.asientosReservados);
  console.log(mapa);
  //Se vuelve a guardar el mapa como un array.
  localStorage.setItem(`${objetoSesion.login_username}`, JSON.stringify(Array.from(mapa)));

  objetoSesion.sesion_lista_funciones = lista_funciones;
  localStorage.setItem("sesion", JSON.stringify(objetoSesion));
  Toast.fire({
    title: 'Los asientos han sido reservados.',
    icon: 'success'
  });
}


const boton = document.getElementById("reservar");
reservar.addEventListener('click', ()=>{
  if(objetoSesion.login_username == null){
    Swal.fire({
      title: 'Es necesario registrarse para reservar asientos.',
      icon: 'warning',
      iconColor: '#aa00aa',
      confirmButtonText: 'Registrarse',
      denyButtonText: 'Ingresar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonColor: '#aa00aa',
      denyButtonColor: '#aa00aa',
      background: "#000000",
      backdrop: "rgba(255,255,255,0.1)",

    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href="./signin.html";
      } else if (result.isDenied) {
        window.location.href="./signin.html";
      }
    });
  }
  else{
    reservarBoton();
  }
});


const nick = objetoSesion.login_username;
let mapa = new Map(JSON.parse(localStorage.getItem(nick)));
if(nick != null) {
  if(mapa.has(funcionObjetivo.id)){
    funcionObjetivo.sala.asientosReservados = mapa.get(funcionObjetivo.id);
  }
  else{
    funcionObjetivo.sala.asientosReservados = [];
  }
}
const graficoAsientos = new DisplayAsientos(funcionObjetivo.sala);

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  background: 'white',
  color: 'black',
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});
