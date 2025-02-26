import { Controller, Get, Param } from '@nestjs/common';
import { CitiesService } from '../services/cities.service';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  findAll() {
    return this.citiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.citiesService.findOne(+id);
  }

  @Get('state/:id')
  findOneByCountryId(@Param('id') id: string) {
    return this.citiesService.findOneByStateId(+id);
  }
}
