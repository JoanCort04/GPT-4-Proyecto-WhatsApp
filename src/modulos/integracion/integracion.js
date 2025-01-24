//JAVADOCS: este modulo se encarga de llamar a la api blablabla nigers
import { Error_API} from "../error/controlErrores.js";

// el servidor de l'api ha d'estar encés perquè funcioni xd

fetch("http://localhost:5000/llistamics")
  .then((response) => {
    if (!response.ok) {
      throw new Error_API(`API o red aturada`);
    }
    return response.json(); // Parse the JSON response
  })
  .then((data) => console.log(data)) // Log the received data
  .catch((error) =>
    console.error("There was a problem with the fetch operation:", error)
  ); // Handle errors

async function enviaLogin() {
  let response = await fetch("/article/fetch/post/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(user),
  });
}
