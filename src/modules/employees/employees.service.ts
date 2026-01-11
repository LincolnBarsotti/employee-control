import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const { email, ...data } = createEmployeeDto;

    const existingEmployee = await this.prisma.employee.findUnique({
      where: { email },
    });

    if (existingEmployee) {
      throw new ConflictException('Email já cadastrado');
    }

    return this.prisma.employee.create({
      data: {
        ...data,
        email,
        hireDate: new Date(createEmployeeDto.hireDate),
      },
    });
  }

  async findAll(onlyActive = true) {
    return this.prisma.employee.findMany({
      where: onlyActive ? { isActive: true } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException('Funcionário não encontrado');
    }

    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    await this.findOne(id);

    if (updateEmployeeDto.email) {
      const existingEmployee = await this.prisma.employee.findUnique({
        where: { email: updateEmployeeDto.email },
      });

      if (existingEmployee && existingEmployee.id !== id) {
        throw new ConflictException('Email já cadastrado para outro funcionário');
      }
    }

    const dataToUpdate: any = { ...updateEmployeeDto };

    if (updateEmployeeDto.hireDate) {
      dataToUpdate.hireDate = new Date(updateEmployeeDto.hireDate);
    }

    return this.prisma.employee.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    // Soft delete
    return this.prisma.employee.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async hardDelete(id: string) {
    await this.findOne(id);

    return this.prisma.employee.delete({
      where: { id },
    });
  }

  async getStatistics() {
    const total = await this.prisma.employee.count({
      where: { isActive: true },
    });

    const byDepartment = await this.prisma.employee.groupBy({
      by: ['department'],
      where: { isActive: true },
      _count: true,
    });

    const avgSalary = await this.prisma.employee.aggregate({
      where: { isActive: true },
      _avg: {
        salary: true,
      },
    });

    return {
      totalEmployees: total,
      byDepartment,
      averageSalary: avgSalary._avg.salary,
    };
  }
}