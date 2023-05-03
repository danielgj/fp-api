import { Body, Controller, Get, Param, Post, UseFilters } from '@nestjs/common';
import { CreateUserDTO } from './dtos/createUser.dto';
import { UserService } from './user.service';
import { UserNotFoundExceptionFilter } from './exceptionFilters/userNotFoundException.filter';
import { User } from './entities/user.entity';
import { UserAlreadyExistExceptionFilter } from './exceptionFilters/userAlreadyExistException.filter';
import { Public } from '../auth/decorators/public.decorator';
import { Admin } from '../auth/decorators/admin.decorator';
import {
  ApiUnauthorizedResponse,
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
@UseFilters(UserNotFoundExceptionFilter)
@UseFilters(UserAlreadyExistExceptionFilter)
export class UserController {
  constructor(private userService: UserService) {}

  @Admin()
  @Get()
  @ApiOperation({
    description:
      'Retrieves the list of all the users enrolled in tha platform.',
  })
  @ApiOkResponse({ description: 'User list succesfully retrieved.' })
  @ApiUnauthorizedResponse({
    description: 'Caller not authorized to retrieve user list.',
  })
  async findAllUsers(): Promise<User[]> {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  @ApiOperation({
    description: 'Query user details based on the user ID',
  })
  @ApiOkResponse()
  @ApiUnauthorizedResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse()
  async findUserById(@Param('id') id: string): Promise<User> {
    return this.userService.findUserById(id);
  }

  @Public()
  @Post()
  @ApiOperation({
    description:
      'Register a new user and log it in the system, returning teh access_token',
  })
  @ApiCreatedResponse({
    description: 'User sucesfully created',
  })
  async registerUser(@Body() user: CreateUserDTO): Promise<any> {
    return this.userService.registerUser(user);
  }
}
