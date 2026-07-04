import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  create(createTransactionDto: CreateTransactionDto) {
    return this.prisma.transaction.create({
      data: createTransactionDto,
    });
  }

  findAll() {
    return this.prisma.transaction.findMany({
      orderBy: { date: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.transaction.findUnique({
      where: { id },
    });
  }

  update(id: string, updateTransactionDto: UpdateTransactionDto) {
    return this.prisma.transaction.update({
      where: { id },
      data: updateTransactionDto,
    });
  }

  remove(id: string) {
    return this.prisma.transaction.delete({
      where: { id },
    });
  }
}
