import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { State } from 'src/countries/entities/state.entity';

@Injectable()
export class StatesService {

  constructor(
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
  ){}

  findAll() {
    return this.stateRepository.find();
  }

  findOne(id: number) {
    return this.stateRepository.findOneBy({id});
  }

  findOneBystateId(id: number) {
    return this.stateRepository.find({
      where: {
        country: {
          id,
        }
      }
    });
  }
}
