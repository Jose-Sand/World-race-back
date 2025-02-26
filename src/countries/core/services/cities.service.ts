import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from 'src/countries/entities/city.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CitiesService {

  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ){}

  findAll() {
    return this.cityRepository.createQueryBuilder('city')
    .leftJoinAndSelect('city.state', 'state')
    .leftJoinAndSelect('state.country', 'country')
    .select(["city.id", "city.name", "state.id", "state.name", "country.id", "country.name"])
    .execute();
  }

  findOne(id: number) {
    return this.cityRepository.createQueryBuilder('city')
    .leftJoinAndSelect('city.state', 'state')
    .leftJoinAndSelect('state.country', 'country')
    .where('city.id = :id', { id })
    .select(["city.id", "city.name", "state.id", "state.name", "country.id", "country.name"])
    .getOne();
  }

  findOneByStateId(id: number) {
    return this.cityRepository.createQueryBuilder('city')
    .leftJoinAndSelect('city.state', 'state')
    .leftJoinAndSelect('state.country', 'country')
    .where('state.id = :id', { id })
    .select(["city.id", "city.name", "state.id", "state.name", "country.id", "country.name"])
    .execute();;
  }
}
