const pokeApi = {}; //criação da Api

function convertPokeApiDetailToPokemon(pokeDetail) {
  //Função que recebe e converte (recebe) o dados (detalhes) da api no molde da classe criada no pokemon-model.js
  const pokemon = new Pokemon(); //Instanciação da classe
  pokemon.number = pokeDetail.id; //atributo number da classe recebe o atributo id vindo da API Oficial
  pokemon.name = pokeDetail.name; //atributo name da classe recebe o atributo name da api oficial

  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name); //constante quer recebe um array com os tipos do pokemon
  const [type] = types; //usando a funcionalidade de destruction, pegamos o primeiro item do array de tipos que será usado como tipo principal

  pokemon.types = types; //atributo da classe que rebe o array tipos
  pokemon.type = type; //atrubuto que recebe o tipo principal do pokemon

  pokemon.photo = pokeDetail.sprites.other.dream_world.front_default; //atributo da classe que recebe a foto do pokemon.
  //Acima é um exemplo da busca profunda até p atributo da api oficial (sprites.other.dream_world.front_default) é o caminho dentro do JSON retornando da api até chegar na foto.

  return pokemon; //retorno da classe instanciada e preenchida com os atributos.
}

pokeApi.getPokemonDetail = (pokemon) => {
  //ARROW FUNCTION: função será chamada dentro da função getPokemons. Essa função fará requisição à URL que contém os detalhes dos pokemons (de onte retiramos o tipo)
  return fetch(pokemon.url) //FETCH: usado para fazer uma promise. Vai acessar a URL e trazer os detalhes
    .then((response) => response.json()) //recebe uma response e e converte os dados para um json
    .then(convertPokeApiDetailToPokemon); //tendo o json, aplica a função que converte o json para o molde da classe
};

pokeApi.getPokemons = (offset = 0, limit = 5) => { //função quer pega todos os pokemons, os parametros limitam a exibição de 5 pokemons por pagina.
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`; //constante que recebe a url

  return fetch(url) //retorno das promises
    .then((response) => response.json()) //com o retorno da promise convertemos os dados para um json
    .then((jsonBody) => jsonBody.results) //o retorno acima é guardado em jsonBody, de onde extraimos o result
    .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail)) //o retorno são todos os pokemons, onde aplicamos uma função map que chama a função getPokemonDetail
    //essa função percorre cada pokemon e traz os detalhes.
    .then((detailRequests) => Promise.all(detailRequests)) //Promise.All aguarda que todas as requisições aos detalhes sejam resolvidas
    .then((pokemonsDetails) => pokemonsDetails); //retorno dos detlahes.
};
