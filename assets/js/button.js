const aboutBtn = document.getElementById('about-btn');
const statusBtn = document.getElementById('status-btn');
const content = document.getElementById('content');

aboutBtn.addEventListener('click', async () => {
    const pokemonId = getPokemonIdFromUrl();
    const pokemonData = await getPokemonData(pokemonId);
    displayAbout(pokemonData);
});

statusBtn.addEventListener('click', async () => {
    const pokemonId = getPokemonIdFromUrl();
    const pokemonData = await getPokemonData(pokemonId);
    displayBaseStatus(pokemonData);
});

aboutBtn.addEventListener('click', () => {
    aboutBtn.classList.add('selected');
    statusBtn.classList.remove('selected');
});

statusBtn.addEventListener('click', () => {
    statusBtn.classList.add('selected');
    aboutBtn.classList.remove('selected');
});

function getPokemonIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('pokemon'));
}

async function getPokemonData(pokemonId) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const data = await response.json();
    return data;
}

async function displayAbout(pokemonData) {
    const species = pokemonData.species.name;
    const height = pokemonData.height;
    const weight = pokemonData.weight;
    const abilities = pokemonData.abilities.map(ability => ability.ability.name).join(', ');

    let gender = '';
    switch (pokemonData.species.gender_rate) {
        case -1:
            gender = 'Genderless';
            break;
        case 0:
            gender = 'Male only';
            break;
        case 8:
            gender = 'Female only';
            break;
        default:
            gender = 'Male / Female';
            break;
    }

    let eggGroups = '';
    try {
        const eggGroupsResponse = await fetch(pokemonData.species.url);
        const eggGroupsData = await eggGroupsResponse.json();
        eggGroups = eggGroupsData.egg_groups.map(group => group.name).join(', ');
    } catch (error) {
        console.error('Failed to fetch egg groups:', error);
        eggGroups = 'Unknown';
    }

    const html = `
    <table>
    <tr>
        <th>Species</th>
        <td>${species}</td>
    </tr>
    <tr>
        <th>Height</th>
        <td>0.${height}0 (cm)</td>
    </tr>
    <tr>
        <th>Weight</th>
        <td>${weight}0 (g)</td>
    </tr>
    <tr>
        <th>Abilities</th>
        <td>${abilities}</td>
    </tr>
    <tr>
        <td>
            <h3>Breeding</h3>
        </td>
    </tr>
    <tr>
        <th>Gender</th>
        <td>${gender}</td>
    </tr>
    <tr>
        <th>Egg Groups</th>
        <td>${eggGroups}</td>
    </tr>
</table>
    `;
    content.innerHTML = html;
}

function displayBaseStatus(pokemonData) {
    const hp = pokemonData.stats[0].base_stat;
    const attack = pokemonData.stats[1].base_stat;
    const defense = pokemonData.stats[2].base_stat;
    const speed = pokemonData.stats[5].base_stat;

    const html = `
<table>
    <tr>
        <td>
            <p>HP</p>
        </td>
        <td>
            <p class="num" >${hp}</p>
        </td>
        <td style="width: 100%;">
        <div class= "limit-bar">
        <div class="progress-bar" style=" background-color: ${getStatusColor(hp)}; width: ${hp}%;"></div>
        </div>
        </td>
    </tr>

    <tr>
        <td>
            <p>Attack</p>
        </td>
        <td>
            <p class="num" >${attack}</p>
        </td>
        <td style="width: 100%;">
        <div class= "limit-bar">
        <div class="progress-bar" style=" background-color: ${getStatusColor(attack)}; width: ${attack}%;"></div>
        </div>
        </td>
    </tr>

    <tr>
        <td>
            <p>Defense</p>
        </td>
        <td>
            <p class="num" >${defense}</p>
        </td>
        <td style="width: 100%;">
        <div class= "limit-bar">
        <div class="progress-bar" style=" background-color: ${getStatusColor(defense)}; width: ${defense}%;"></div>
        </div>
        </td>
    </tr>

    <tr>
        <td>
            <p>Speed</p>
        </td>
        <td>
            <p class="num" >${speed}</p>
        </td>
        <td style="width: 100%;">
        <div class= "limit-bar">
        <div class="progress-bar" style=" background-color: ${getStatusColor(speed)}; width: ${speed}%;"></div>
        </div>
        </td>
    </tr>

</table>




    `;
    content.innerHTML = html;
}

function getStatusColor(value) {
    return value < 50 ? 'red' : 'green';
}
