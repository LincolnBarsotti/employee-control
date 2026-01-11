import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorator/decorator.decorator';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { UserRole } from '@prisma/client';

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeesController {

  constructor(private readonly employeesService: EmployeesService) {}



  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.VIEWER)
  findAll() {
    return this.employeesService.findAll();
  }

  @Get('statistics')
  @Roles(UserRole.ADMIN, UserRole.VIEWER)
  getStatistics() {
    return this.employeesService.getStatistics();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.VIEWER)
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.employeesService.remove(id);
  }

  @Delete(':id/hard')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  hardDelete(@Param('id') id: string) {
    return this.employeesService.hardDelete(id);
  }
}