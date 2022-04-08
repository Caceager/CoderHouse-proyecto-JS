//jshint esversion: 6

const objetoSesion = JSON.parse(localStorage.getItem("sesion"));
//Impedir el acceso a la pagina de login si el usuario ya se encuentra logeado.
if(objetoSesion.login_username != null){
    window.location.href="./index.html";
}

formulario_registro = document.getElementById("login");
formulario_registro.addEventListener("submit", (evento)=>{

  if(objetoSesion.login_username == null){
    let nickname = evento.target.floatingInput.value;
    objetoSesion.login_username = nickname;
    if(localStorage.getItem(`${nickname}`)== null){

      //Se crea un map (diccionario), que debe ser pasada como array al localStorage para que pueda ser correctamente recuperado.
      let diccionario_asientos_reservados = new Map();

      let nuevoUsuario_asientosReservados = JSON.stringify(Array.from(diccionario_asientos_reservados));
      localStorage.setItem(`${nickname}`, nuevoUsuario_asientosReservados);
    }
  }

  const stringSesion = JSON.stringify(objetoSesion);
  localStorage.setItem("sesion", stringSesion);

});
