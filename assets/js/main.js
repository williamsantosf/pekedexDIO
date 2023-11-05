const pokemonList = document.getElementById('pokemonList') //manipulamos o elemento HTML que receberá a lista com os pokemons
const loadMoreButton = document.getElementById('loadMoreButton') //manipulamos o botão de carregar mais pokemons

//aqui definimos o limite de pokemons a serem exibidos ao total e quantos serão carregados á cada interação com o botão.
//offset zerado pois será incrementado a cada interação com o botão
const maxRecords = 151
const limit = 10
let offset = 0;

//função que retorna o card de cada pokemon, com o molde da classe definido anteriormente
function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

//função que carrega mais pokemons
function loadPokemonItens(offset, limit) {                          //recebe os parametros offset (numero de paginas) e limite de pokemons
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {    //aplica  achama a api e guarda os pokemons num array
        const newHtml = pokemons.map(convertPokemonToLi).join('')   //recebe os cards dos pokemons e apliaca a junção (join), com separadador vazio, senao vai uma virgula
        pokemonList.innerHTML += newHtml                            //acrescenta uma lista à pagina, para que todos finquem visíveis. Do contrário, a cada interação os anteriores sumiriam.
    })
}

loadPokemonItens(offset, limit)//a função é executada pelo menos uma vez ao carregar a página

loadMoreButton.addEventListener('click', () => {       //após primeira execução, adicionado evento de click.
    offset += limit                                    //então a página recebe o valor do limite (10)
    const qtdRecordsWithNexPage = offset + limit       //a próxima página será a quantidade da atual + 10.

                                                      //Lógica condicional para sumir com o botão quando a quantidade máxima de Pokemons for atingida:
    if (qtdRecordsWithNexPage >= maxRecords) {        //se qtdRecordsWithNexPage for maior ou igual que 151 (numero máximo de pokemons)
        const newLimit = maxRecords - offset          //novo limite é decrementado do offset
        loadPokemonItens(offset, newLimit)            //e a função para carregar mais pokemons é chamada com novo limite. Ou seja: seja qual for o número máximo
                                                      //de pokemons, sendo a interação a cada 10, quando ultrapassar o limite, exibe apenas o restante e remove o botão da tela.
        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {                                          //caso contrário, permanece carregando pokemons até que a primeira condição seja verdadeira
        loadPokemonItens(offset, limit)
    }
})