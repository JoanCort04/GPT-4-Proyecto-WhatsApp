$(document).ready(function () {
  function toggleTheme(isDark) {
    // Cambiar los colores del texto en el footer
    $(
      "footer p.text-gris-clar.font-semibold, footer p.text-blau-clar.text-sm"
    ).css("color", "green");

    const $slider = $(".slider");
    const $sliderCircle = $slider.next();

    const $tabFriends = $("#tabFriends");
    const $tabGroups = $("#tabGroups");

    if (isDark) {
      // Modo oscuro
      $("body")
        .removeClass("bg-blau-molt-clar text-black")
        .addClass("bg-negre text-gris-clar");
      $("aside")
        .removeClass("bg-blau-pastel-5 border-black")
        .addClass("bg-blau-fosc border-black");
      $("header")
        .removeClass("bg-blau-pastel-5 border-black border-double")
        .addClass("bg-blau-fosc border-black");
      $("footer")
        .removeClass("bg-blau-pastel-1 border-blau-pastel-2")
        .addClass("bg-blau-fosc border-black");
      $("section")
        .removeClass(
          "bg-white border-blau-molt-clar bg-blau-fosc border-blau-mig"
        )
        .addClass("bg-blau-clar");

      $("article p").removeClass("text-blau-clar").addClass("text-black");

      $("section p:odd").removeClass("text-black").addClass("text-white");

      $("section p:even")
        .removeClass("text-blau-fosc")
        .addClass("text-blau-pastel-5");

      $("section")
        .eq(2)
        .find("p")
        .removeClass("text-blau-pastel-5")
        .addClass("text-blau-pastel-1");

      // Inputs y botones en modo oscuro
      $("input, button")
        .removeClass(
          "bg-blau-pastel-3 text-black focus:ring-blau-pastel-4 hover:bg-blau-pastel-2"
        )
        .addClass(
          "bg-blau-fosc text-gris-clar focus:ring-blau-clar hover:bg-blau-clar"
        );

      $("section h2").removeClass("text-blau-fosc").addClass("text-gris-clar");

      // Slider y su círculo
      $slider.removeClass("bg-blau-pastel-3").addClass("bg-blau-clar");
      $sliderCircle.addClass("translate-x-6");
      $("header h1").removeClass("text-black").addClass("text-gris-clar");

      // Tabs
      $tabFriends.removeClass("text-blau-mig").addClass("text-gris-clar");
      $tabGroups.removeClass("text-blau-mig").addClass("text-gris-clar");
    } else {
      // Modo claro
      $("body")
        .removeClass("bg-negre text-gris-clar")
        .addClass("bg-blau-molt-clar text-white");
      $("aside")
        .removeClass("bg-blau-fosc border-blau-mig")
        .addClass("bg-blau-pastel-5 border-black");
      $("header")
        .removeClass("bg-blau-fosc border-blau-mig")
        .addClass("bg-blau-pastel-5 border-black border-double");
      $("footer")
        .removeClass("bg-blau-fosc border-blau-mig")
        .addClass("bg-blau-pastel-1 border-blau-pastel-2");
      $("section")
        .removeClass("bg-blau-clar text-gris-clar border-blau-mig")
        .addClass(
          "bg-white border-blau-molt-clar bg-blau-fosc border-blau-mig"
        );

      $("input, button")
        .removeClass(
          "bg-blau-fosc text-gris-clar focus:ring-blau-clar hover:bg-blau-clar"
        )
        .addClass(
          "bg-blau-pastel-3 text-black focus:ring-blau-pastel-4 hover:bg-blau-pastel-2"
        );

      $("section p:odd").removeClass("text-white").addClass("text-blau-clar");

      $("section")
        .eq(2)
        .find("p")
        .removeClass("text-blau-pastel-1")
        .addClass("text-black");

      // Explicitly override the third paragraph (index 2)



      $("section p:even")
        .removeClass("text-blau-pastel-5")
        .addClass("text-blau-fosc");

      $("section h2").removeClass("text-gris-clar").addClass("text-blau-fosc");

      // Slider y su círculo
      $slider.removeClass("bg-blau-clar").addClass("bg-blau-pastel-3");
      $sliderCircle.removeClass("translate-x-6");
      $("header h1").removeClass("text-gris-clar").addClass("text-black");

      // Tabs
      $tabFriends.removeClass("text-gris-clar").addClass("text-blau-mig");
      $tabGroups.removeClass("text-gris-clar").addClass("text-blau-mig");
    }
  }

  // Obtener el estado del tema desde el almacenamiento local
  const isDarkTheme = localStorage.getItem("theme") === "dark";
  $("#theme-toggle").prop("checked", isDarkTheme);
  toggleTheme(isDarkTheme);

  // Cambiar el tema cuando el toggle cambia
  $("#theme-toggle").on("change", function () {
    const isDark = $(this).is(":checked");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    toggleTheme(isDark);
  });

  // Variables de la interfaz de usuario
  const userData = "Usuario actual";
  const rightSidebar = document.getElementById("rightSidebar");
  const chatArea = document.getElementById("chatArea");
  const userInfo = document.getElementById("userInfo");

  rightSidebar.classList.add("translate-x-full");

  userInfo.innerHTML = `<div class="text-gray-600 dark:text-gray-300">${userData}</div>`;

  // Mostrar el sidebar derecho con información
  function showRightSidebar(info) {
    userInfo.innerHTML = `<div class="text-gray-600 dark:text-gray-300">${info}</div>`;
    rightSidebar.classList.remove("translate-x-full");

    if (window.innerWidth < 768) {
      chatArea.classList.add("hidden");
    } else {
      chatArea.classList.add("mr-64");
    }
  }

  // Ocultar el sidebar derecho
  function hideRightSidebar() {
    rightSidebar.classList.add("translate-x-full");

    if (window.innerWidth < 768) {
      chatArea.classList.remove("hidden");
    } else {
      chatArea.classList.remove("mr-64");
    }
  }

  // Mostrar información de usuario al hacer clic
  document.querySelectorAll(".user-trigger").forEach((el) => {
    el.addEventListener("click", () => {
      showRightSidebar(`Información de ${el.textContent}`);
    });
  });

  // Cerrar el sidebar derecho
  document
    .getElementById("closeRightSidebar")
    .addEventListener("click", hideRightSidebar);

  adjustLayout();
  window.addEventListener("resize", adjustLayout);
});

document.addEventListener("DOMContentLoaded", () => {
  const tabFriends = document.getElementById("tabFriends");
  const tabGroups = document.getElementById("tabGroups");
  const friendsList = document.getElementById("friendsList");
  const groupsList = document.getElementById("groupsList");

  // Funciones para mostrar las pestañas
  function showFriends() {
    friendsList.classList.remove("hidden");
    groupsList.classList.add("hidden");
    tabFriends.classList.remove("text-gris-clar");
    tabFriends.classList.add("text-white", "bg-blau-clar/10");
    tabGroups.classList.remove("text-blau-clar", "bg-blau-clar/10");
    tabGroups.classList.add("text-gris-clar");
  }

  function showGroups() {
    friendsList.classList.add("hidden");
    groupsList.classList.remove("hidden");
    tabGroups.classList.remove("text-gris-clar");
    tabGroups.classList.add("text-white", "bg-blau-clar/10");
    tabFriends.classList.remove("text-blau-clar", "bg-blau-clar/10");
    tabFriends.classList.add("text-gris-clar");
  }

  // Establecer el comportamiento por defecto
  tabFriends.addEventListener("click", showFriends);
  tabGroups.addEventListener("click", showGroups);

  showFriends();
});

document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const chatHeader = document.querySelector("header h1.text-lg.font-semibold");
  const userTriggers = document.querySelectorAll(".user-trigger");

  // Función para actualizar el título del chat
  function updateChatTitle(event) {
    const userName =
      event.currentTarget.querySelector("p.text-gris-clar").textContent;
    chatHeader.textContent = `Xat amb ${userName}`;
  }

  // Añadir event listeners a todos los usuarios/grupos
  userTriggers.forEach((trigger) => {
    trigger.addEventListener("click", updateChatTitle);
  });
});


  // Asegurar que el sidebar se cierre al hacer clic en el área del chat
  document.getElementById("chatArea").addEventListener("click", () => {
    if (window.innerWidth < 768) {
      aside.classList.add("-translate-x-full");
    }
  });

 
$(document).ready(function() {
    const $mobileSidebar = $('#mobileSidebar');
    const $chatArea = $('#chatArea');

    // Detectar swipe hacia la derecha en las pestañas
    $('#tabFriends, #tabGroups').on('swiperight', function(event) {
        if ($(window).width() < 768 && !$mobileSidebar.hasClass('-translate-x-full')) {
            $mobileSidebar.addClass('-translate-x-full');
            $chatArea.removeClass('hidden');
            event.preventDefault();
        }
    });
});