
// Codigo que chequea el Local Storage en busca del item 'usser'
// Si verifica el logeo del usuario con el accessToken (JWT) retorna le HEADER con la AUTORIZACION de la peticion http.
// De otra manera retorna un objeto vacio.
export default function authHeader() {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.accessToken){
        return { Authorization: 'Bearer ' + user.accessToken};
    } else {
        return {};
    }
}