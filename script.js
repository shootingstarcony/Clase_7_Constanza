        // Referencias a los tres <tbody> vacíos del HTML, donde iremos insertando filas
            const tbodyAmerica = document.querySelector("#america");
            const tbodyEuropa = document.querySelector("#europa");
            const tbodyOtros = document.querySelector("#otros");

            // Dirección desde donde vamos a pedir los datos (JSON).
            const ENDPOINT = "https://api.myjson.online/v1/records/b22ba02f-1846-4c66-9d2a-1909b7c36cb3";

            // Listas de países para clasificar cada universidad por continente.
            // "some()" revisará, dentro del forEach, si AL MENOS UNO de estos strings aparece en u.location
            const paisesAmerica = ["Argentina", "Brazil", "Canada", "Chile", "Colombia", "Mexico", "United States"];
            const paisesEuropa = ["Austria", "Belgium", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Ireland", "Italy", "Netherlands", "Sweden", "Switzerland", "United Kingdom"];

            // Contadores para el resumen final (cuántas universidades cayeron en cada grupo)
            var cuenta_america = 0;
            var cuenta_europa = 0;
            var cuenta_otros = 0;

            // 1) fetch(ENDPOINT) hace la petición y devuelve una PROMESA:
            //    algo que "a futuro" se resolverá con la respuesta del servidor.
            fetch(ENDPOINT)
                // 2) Cuando la promesa se resuelve, entramos a este primer .then()
                //    con la respuesta "cruda" (todavía no es el JSON, es el objeto Response)
                .then((respuesta) => {
                    // .ok es true si el status HTTP está entre 200 y 299 (todo bien)
                    if (!respuesta.ok) {
                        throw new Error("Error HTTP: " + respuesta.status);
                    }
                    // .json() también devuelve una promesa: hay que leer/parsear el body
                    return respuesta.json();
                })
                // 3) Este segundo .then() recibe los datos ya convertidos en objeto/array JS
                .then((datos) => {
                    const universidades = datos.data;
                    console.log("Datos recibidos:", universidades); // útil para revisar la forma de los datos

                    // 4) Recorremos cada universidad y decidimos en qué tabla va
                    universidades.forEach((u) => {
                        const esAmericana = paisesAmerica.some((pais) => u.location.includes(pais));
                        const esEuropea = paisesEuropa.some((pais) => u.location.includes(pais));

                        // location viene como "Ciudad, País": nos quedamos con lo que sigue después de la coma
                        const pais = u.location.split(", ").pop();

                        // 5) Según la clasificación, agregamos una fila (<tr>) al <tbody> que corresponde.
                        //    "+=" con innerHTML AGREGA la fila nueva sin borrar las anteriores.
                        if (esAmericana) {
                            tbodyAmerica.innerHTML += `<tr><td>${u.rank}</td><td>${u.name}</td><td>${pais}</td></tr>`;
                            cuenta_america = cuenta_america + 1;
                        } else if (esEuropea) {
                            tbodyEuropa.innerHTML += `<tr><td>${u.rank}</td><td>${u.name}</td><td>${pais}</td></tr>`;
                            cuenta_europa = cuenta_europa + 1;
                        } else {
                            tbodyOtros.innerHTML += `<tr><td>${u.rank}</td><td>${u.name}</td><td>${pais}</td></tr>`;
                            cuenta_otros = cuenta_otros + 1;
                        }
                    });

                    // 6) Con los conteos finales, llenamos la tabla de resumen
                    document.querySelector("#puntos_americanos").innerHTML = bolitas(cuenta_america);
                    document.querySelector("#puntos_europeos").innerHTML = bolitas(cuenta_europa);
                    document.querySelector("#puntos_otros").innerHTML = bolitas(cuenta_otros);
                })
                // 7) .catch() atrapa cualquier error de la cadena de arriba (red caída, JSON inválido, etc.)
                .catch((error) => {
                    console.error("Algo salió mal:", error);
                });

            // 0) Esta es una función para mostrar un número de bolitas correspondientes al valor que reemplace x. Por ejemplo: bolitas(3) => " ● ● ● "
            function bolitas(x) {
                var visual = "";
                for (let i = 0; i < x; i++) {
                    visual += " ● ";
                }
                return "<span>" + visual + "</span>";
            }
