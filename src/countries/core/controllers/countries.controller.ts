import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CountriesService } from '../services/countries.service';
import { CreateCountryDto } from '../../dto/create-country.dto';
import { UpdateCountryDto } from '../../dto/update-country.dto';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  findAll() {
    return this.countriesService.findAll();
  }

  @Get('first-ten')
  findFirstTen(){
    return this.countriesService.findFirstTen();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.countriesService.findOne(+id);
  }
}
