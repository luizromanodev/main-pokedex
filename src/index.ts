import express, { Request, Response } from 'express';
import path from 'path';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.get('/', (request: Request, response: Response) => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=20")
        .then(res => res.json())
        .then(data => {
            response.render('index', { results: data.results });
        })
        .catch(error => {
            console.error('Erro ao buscar Pokémons:', error);
            response.status(500).send('Erro interno do servidor');
        });
});

app.get('/pokemon', (request: Request, response: Response) => {
    const { name } = request.query;

    if (typeof name === 'string') {
        fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    response.status(404).send('Pokémon não encontrado');
                    return Promise.reject('Pokémon não encontrado');
                }
            })
            .then(pokemonData => {
                response.render('pokemon', { pokemon: pokemonData });
            })
            .catch(error => {
                console.error('Erro ao buscar detalhes do Pokémon:', error);
                response.status(500).send('Erro interno do servidor');
            });
    } else {
        response.status(400).send('Nome do Pokémon inválido');
    }
});

app.listen(3000, () => {
    console.log("Servidor está rodando na porta 3000");
});
