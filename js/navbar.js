//jshint esversion: 6

barra = document.getElementById("barra");
if(objetoSesion.login_username == null){
  barra.innerHTML = `
  <li class="nav-item active">
    <a class="nav-link" href="signin.html">Registrarse</a>
  </li>
  <li class="nav-item active">
    <a class="nav-link" href="signin.html">Acceder</a>
  </li>
  `;
}
else{
  barra.innerHTML = `
  <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="#">${objetoSesion.login_username}</a>
    <div class="dropdown-menu" style="left: -2rem !important;" aria-labelledby="navbarDropdown">
      <a class="dropdown-item"  id ="cerrarSesion" href="index.html">Cerrar sesión</a>
    </div>
  </li>
  `;
  const cerrarSesion = document.getElementById("cerrarSesion");
  cerrarSesion.addEventListener('click', () =>{
    console.log("a");
    let objetoSesion = JSON.parse(localStorage.getItem("sesion"));
    objetoSesion.login_username = null;
    localStorage.setItem("sesion", JSON.stringify(objetoSesion));
  });
}
