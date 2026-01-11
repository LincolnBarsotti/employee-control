import { IsDateString, IsEmail, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Cargo é obrigatório' })
  position: string;

  @IsString()
  @IsNotEmpty({ message: 'Departamento é obrigatório' })
  department: string;

  @IsNumber({}, { message: 'Salário deve ser um número' })
  @Min(0, { message: 'Salário não pode ser negativo' })
  @Type(() => Number)
  salary: number;

  @IsDateString({}, { message: 'Data de contratação inválida' })
  @IsNotEmpty({ message: 'Data de contratação é obrigatória' })
  hireDate: string;
}
