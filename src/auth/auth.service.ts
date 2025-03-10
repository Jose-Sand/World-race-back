import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneOptions, FindOptionsSelect, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role } from './entities/role.entity';
import { CommonService } from 'src/common/common.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { City } from 'src/countries/entities/city.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    private readonly jwtService: JwtService,
    private readonly configSerice: ConfigService,
    private readonly commonService: CommonService,
  ) {}
  async create(createAuthDto: CreateAuthDto) {
    try {
      const pass = await bcrypt.hash(
        createAuthDto.password,
        this.generateSalt(),
      );
      const role = await this.roleRepository.findOneBy({
        name: createAuthDto.role,
      });
      // const city = await this.cityRepository.findOne({
      //   where:{ id: createAuthDto.cityId, },
      //   relations: ['state', 'state.country'],
      // });
      const user = this.userRepository.create({
        name: createAuthDto.name,
        lastName: createAuthDto.lastName,
        email: createAuthDto.email,
        password: pass,
        role,
        // city,
        // countryName: city.state.country.name,
      });
      await this.userRepository.save(user);
      return this.signin(createAuthDto.email, createAuthDto.password);
    } catch (error) {
      this.commonService.handleError(error);
    }
  }

  async findAll() {
    return await this.userRepository.find({ relations: ['role'] });
  }

  async findOne(id: string, type: 'id' | 'email' = 'id', isAuth = false) {
    let user: User;
    const paramsSelect = [
      'id',
      'email',
      'isActive',
      'password',
    ] as FindOptionsSelect<User>;
    if (type === 'email') {
      const where: FindOneOptions<User> = {
        where: {
          email: id,
        },
      };
      if (isAuth) {
        where.select = paramsSelect;
      }
      user = await this.userRepository.findOne(where);
    } else {
      const where: FindOneOptions<User> = {
        where: {
          id,
        },
      };
      if (isAuth) {
        where.select = paramsSelect;
      }
      user = await this.userRepository.findOne(where);
    }
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async signin(username: string, password: string) {
    const user = await this.findOne(username, 'email', true);
    if (!user.isActive) throw new UnauthorizedException('User is not active');
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');
    const token = this.getJwtToken({
      username: user.email,
      user_id: user.id,
    });
    return {
      token,
      id: user.id,
    };
  }

  async update(id: string, data: UpdateAuthDto) {
    await this.findOne(id);

    const newData: Partial<User> = {
      name: data.name,
      lastName: data.lastName,
      email: data.email,
    };
    await this.userRepository.update(id, newData);
    return this.findOne(id);
  }

  async remove(id: string) {
    const auth = await this.findOne(id);
    await this.userRepository.softDelete(id);
    return auth;
  }

  private generateSalt(): string {
    return bcrypt.genSaltSync();
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
