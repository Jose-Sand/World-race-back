import { Injectable } from '@nestjs/common';
import { CreateCountryDto } from '../../dto/create-country.dto';
import { UpdateCountryDto } from '../../dto/update-country.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from 'src/countries/entities/country.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CountriesService {

  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ){}

  findAll() {
    return this.countryRepository.find();
  }

  findOne(id: number) {
    return this.countryRepository.findOneBy({id});
  }
}
