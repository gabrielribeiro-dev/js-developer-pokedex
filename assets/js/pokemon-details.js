function getPokemonTypesHTML(types) {
    return types.map(type => `<li class="type ${type}">${type}</li>`).join('');
}

async function getPokemonHTML(pokemonId) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const pokemonDetails = await response.json();

    const { name, sprites, types } = pokemonDetails;
    const imageUrl = sprites.other['official-artwork'].front_default;
    const pokemonTypesHTML = types.map(type => `<li class="type ${type.type.name.toLowerCase()}">${type.type.name}</li>`).join('');

    const backgroundColorClass = types.map(type => types[0].type.name.toLowerCase()).join(' ');

    document.body.className = backgroundColorClass;

    return `
        <div>
            <span class="name">${name}</span>
            <span class="number">#${pokemonId}</span>
            <div class="types"> 
                <ol>${pokemonTypesHTML}</ol>
            </div>
            <div class="pokemonDetails">
                <img src="${imageUrl}" alt="${name}">
            </div>

        </div>
    `;
}

function getPokemonIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('pokemon'));
}

async function addPokemonToPage() {
    const pokemonId = getPokemonIdFromURL();
    const pokemonInfoContainer = document.getElementById('pokemonInfo');

    const pokemonHTML = await getPokemonHTML(pokemonId);
    
    pokemonInfoContainer.innerHTML = pokemonHTML;
}

window.onload = addPokemonToPage;

