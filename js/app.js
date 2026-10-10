let series = [];

const listaSeries = document.getElementById("listaSeries");
const status = document.getElementById("status");
const campoBusca = document.getElementById("campoBusca");
const filtroGenero = document.getElementById("filtroGenero");
const filtroAno = document.getElementById("filtroAno");
const ordenarAno = document.getElementById("ordenarAno");

async function carregarSeries(){
    try{
        status.textContent = "Carregando séries...";
        const resposta = await fetch('./series.json');

        if(!resposta.ok){
            throw new Error("Não foi possível carreg        ar o arquivo JSON.");
        }

        const dados = await resposta.json();
        series = Array.isArray(dados) ? dados : (dados.series ?? []);

        status.textContent = `${series.length} série(s) carregada(s).`;
        mostrarSeries(series);

    } catch (erro) {
        status.textContent = `Erro: ${erro.message}`;
    }
}

function mostrarSeries(lista){
    listaSeries.innerHTML = "";

if (lista.length === 0) {
    listaSeries.innerHTML = "<p> Nenhuma série encontrada.</p>";
    return;
}
    lista.forEach((serie) => {
        const card=document.createElement("div");
        card.classList.add("card");

        card.innerHTML=`
        <div class="card-content">
            <h2>${serie.titulo}</h2>
            <p><strong>Ano: </strong> ${serie.ano}</p>
            <p><strong>Gênero: </strong> ${serie.genero}</p>
            <p><strong>Temporadas: </strong> ${serie.temporadas}</p>
        </div>
        <img src="${serie.imagem}" alt="${serie.titulo}" class="card-image">
        `;
        listaSeries.appendChild(card);
    });
}

function aplicarFiltros() {
    const termo = campoBusca.value.trim().toLowerCase();
    let lista = [...series];

    if (filtroGenero.value !== "todos") {
        lista = lista.filter((serie) => serie.genero === filtroGenero.value);
    }

    if (filtroAno.value !== "todos") {
        lista = lista.filter((serie) => String(serie.ano) === filtroAno.value);
    }

    if (termo) {
        lista = lista.filter((serie) =>
            serie.titulo.toLowerCase().includes(termo)
        );
    }

    if (ordenarAno.value === "maisAntigo") {
        lista.sort((a, b) => a.ano - b.ano);
    } else if (ordenarAno.value === "maisRecente") {
        lista.sort((a, b) => b.ano - a.ano);
    }

    mostrarSeries(lista);
    status.textContent = `${lista.length} série(s) encontrada(s).`;
}

campoBusca.addEventListener("input", aplicarFiltros);
filtroGenero.addEventListener("change", aplicarFiltros);
filtroAno.addEventListener("change", aplicarFiltros);
ordenarAno.addEventListener("change", aplicarFiltros);

carregarSeries()