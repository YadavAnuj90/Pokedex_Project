import { useEffect, useState } from "react";
import axios from 'axios';
import './PokemonList.css';
import Pokemon from "../Pokemon/Pokemon";

function PokemonList() {
    const [pokemonList, setPokemonList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const POKEDEX_URL = 'https://pokeapi.co/api/v2/pokemon';

    async function downloadPokemons() {
        try {
            const response = await axios.get(POKEDEX_URL);
            const pokemonResults = response.data.results;

            // Creating an array of promises to fetch detailed data for each Pokémon
            const pokemonResultPromise = pokemonResults.map((pokemon) => axios.get(pokemon.url));
            const pokemonData = await axios.all(pokemonResultPromise);

            // Mapping through each fetched Pokémon data
            const pokeListResult = pokemonData.map((pokeData) => {
                const pokemon = pokeData.data;

                return {
                    id: pokemon.id,
                    name: pokemon.name,
                    image: pokemon.sprites.other?.dream_world?.front_default || pokemon.sprites.front_shiny,
                    types: pokemon.types
                };
            });

            console.log(pokeListResult);  // Corrected the variable

            setPokemonList(pokeListResult);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching Pokémon:", error);
        }
    }

    useEffect(() => {
        downloadPokemons();
    }, []);

    return (
        <div className="pokemon-list-wrapper">
            <div>Pokemon List</div>
            {isLoading ? 'Loading...' :
                pokemonList.map((p) => <Pokemon name={p.name} image={p.image} key={p.id} />)}
        </div>
    );
}

export default PokemonList;
