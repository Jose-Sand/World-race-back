import { Injectable } from '@nestjs/common';
import { CreateCountryDto } from '../../dto/create-country.dto';
import { UpdateCountryDto } from '../../dto/update-country.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from 'src/countries/entities/country.entity';
import { Repository } from 'typeorm';
import { formatterUsd } from 'src/common/utils/currency';

@Injectable()
export class CountriesService {

  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ){}

  findAll() {
    return this.countryRepository.find({order: {name: 'ASC'}});
  }

  findOne(id: number) {
    return this.countryRepository.findOneBy({id});
  }

  async findFirstTen(){
    const countries = await this.countryRepository.find({
      take: 10,
      order: {
        amount: 'DESC'
      }
    })
    return countries.map(c => ({
      ...c,
      amount: Number(c.amount)
    }))
  }
}
