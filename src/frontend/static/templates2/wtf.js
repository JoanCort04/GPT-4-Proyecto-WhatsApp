function carregar() {
  fetch("http://127.0.0.1:8000/grups?username=user2")
    .then((response) => {
      console.log(response.status); // Should be 200 for success
      if (!response.ok) {
        throw new Error("Error al obtener los grupos");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data); // Check the structure here
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

carregar();
