import { Controller, Get, Param } from '@nestjs/common';
import { StatesService } from '../services/states.service';

@Controller('states')
export class StatesController {
  constructor(private readonly statesService: StatesService) {}

  @Get()
  findAll() {
    return this.statesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statesService.findOne(+id);
  }

  @Get('country/:id')
  findOneByCountryId(@Param('id') id: string) {
    return this.statesService.findOneBystateId(+id);
  }
}
