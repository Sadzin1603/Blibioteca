const SUPABASE_URL = "https://mlnpnmmiiqvfckzlbbey.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sbnBubW1paXF2ZmNremxiYmV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NjExNzcsImV4cCI6MjA3ODQzNzE3N30.kmJYWJXXcyzP6759WqyPxJbnbFhcUxw5hk3c1BUtJxs";
const { createClient } = supabase; // importa a função do SDK
const client = createClient(SUPABASE_URL, SUPABASE_KEY);


// ====== ARQUIVOS ======
const formArquivo = document.getElementById("formArquivo");
const listaArquivos = document.getElementById("listaArquivos");

formArquivo.addEventListener("submit", async (e) => {
    e.preventDefault();
    const file = document.getElementById("fileInput").files[0];

    if (!file) return;

    const fileName = `${Date.now()}-${file.name}`;
    
    const { data, error } = await client.storage.from("box").upload(fileName, file);
    console.log("Resultado do upload:", data, error);


    if (error) {
        alert("Erro ao enviar: " + error.message);
        return;
    }

    carregarArquivos();
});

async function carregarArquivos() {
    const { data, error } = await client.storage.from("box").list("", { sortBy: { column: "created_at", order: "desc" } });

    if (error) {
        console.error(error);
        return;
    }

    listaArquivos.innerHTML = "";
    for (const file of data) {
        const { data: urlData } = client.storage.from("box").getPublicUrl(file.name);
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
      <p>${file.name}</p>
      <a href="${urlData.publicUrl}" target="_blank">Baixar</a>
    `;
        listaArquivos.appendChild(card);
    }
}

// ====== LINKS ======
const formLink = document.getElementById("formLink");
const listaLinks = document.getElementById("listaLinks");

formLink.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = document.getElementById("tituloLink").value;
    const url = document.getElementById("urlLink").value;

    const { error } = await client.from("links").insert([{ titulo, url }]);
    if (error) {
        alert("Erro ao salvar link: " + error.message);
        return;
    }

    formLink.reset();
    carregarLinks();
});

async function carregarLinks() {
    const { data, error } = await client.from("links").select("*").order("id", { ascending: false });
    if (error) return;

    listaLinks.innerHTML = "";
    data.forEach(link => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${link.url}" target="_blank">${link.titulo}</a>`;
        listaLinks.appendChild(li);
    });
}

// ====== Inicialização ======
carregarArquivos();
carregarLinks();
