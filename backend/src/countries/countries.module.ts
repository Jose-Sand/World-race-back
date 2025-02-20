import { Module } from '@nestjs/common';
import { CountriesService } from './core/services/countries.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { State } from './entities/state.entity';
import { City } from './entities/city.entity';
import { SitesControllers } from './core/controllers';
import { SitesServices } from './core/services';

@Module({
  controllers: [...SitesControllers],
  providers: [...SitesServices],
  imports: [
    TypeOrmModule.forFeature([Country, State, City]),
  ],
})
export class CountriesModule {}
