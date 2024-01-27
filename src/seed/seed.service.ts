import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';


@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ) { }

  // a pie
  // async executeSeed(){

  //   const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');

  //   data.results.forEach(async ({ name, url }) => {
  //     const segments = url.split('/');
  //     const no = +segments[segments.length - 2];

  //     let createPokemonDto: CreatePokemonDto = { no: no, name: name.toLowerCase()}
  //     const pokemon =  await this.pokemonModel.create( createPokemonDto )

  //   })

  //   return data.results[500];
  // }
  //con promesas
  // async executeSeed(){

  //   await this.pokemonModel.deleteMany({});//delete * from pokemons;

  //   const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');

  //   const insertPromisesArray = [];

  //   data.results.forEach(async ({ name, url }) => {
  //     const segments = url.split('/');
  //     const no = +segments[segments.length - 2];

  //     // let createPokemonDto: CreatePokemonDto = { no: no, name: name.toLowerCase()}
  //     // const pokemon =  await this.pokemonModel.create( createPokemonDto )

  //     insertPromisesArray.push(
  //       this.pokemonModel.create({ name, no })
  //     )

  //   })

  //   await Promise.all( insertPromisesArray );

  //   return 'Seed executed';
  // }
  //por lotes
  async executeSeed() {

    await this.pokemonModel.deleteMany({});//delete * from pokemons;

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');

    const pokemonToInsert: { name: string, no: number }[] = [];

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];

      // let createPokemonDto: CreatePokemonDto = { no: no, name: name.toLowerCase()}
      // const pokemon =  await this.pokemonModel.create( createPokemonDto )

      pokemonToInsert.push({ name, no });

    })

    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'Seed executed';
  }

}
