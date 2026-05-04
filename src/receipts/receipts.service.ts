import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Receipt } from '../database/entities/receipts.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';

@Injectable()
export class ReceiptsService {
  constructor(
    @InjectRepository(Receipt)
    private readonly receiptRepo: Repository<Receipt>,
    private readonly notifications: NotificationsService,
  ) {}

  findAll() {
    return this.receiptRepo.find({ order: { issuedAt: 'DESC' } });
  }

  async findOne(id: string) {
    const receipt = await this.receiptRepo.findOne({
      where: { receiptId: id },
    });
    if (!receipt) {
      throw new NotFoundException(`Receipt ${id} not found`);
    }
    return receipt;
  }

  async create(dto: CreateReceiptDto) {
    const receipt = this.receiptRepo.create({
      issuedAt: new Date(dto.issuedAt),
      name: dto.name,
      price: dto.price,
    });

    const saved = await this.receiptRepo.save(receipt);

    this.notifications.notify('receipt_created', {
      receiptId: saved.receiptId,
      price: saved.price,
    });

    return saved;
  }

  async update(id: string, dto: UpdateReceiptDto) {
    const receipt = await this.findOne(id);

    if (dto.issuedAt) {
      receipt.issuedAt = new Date(dto.issuedAt);
    }
    if (dto.name !== undefined) {
      receipt.name = dto.name;
    }
    if (dto.price !== undefined) {
      receipt.price = dto.price;
    }

    const saved = await this.receiptRepo.save(receipt);

    this.notifications.notify('receipt_updated', {
      receiptId: saved.receiptId,
      price: saved.price,
    });

    return saved;
  }

  async remove(id: string) {
    const receipt = await this.findOne(id);
    await this.receiptRepo.remove(receipt);
    return { deleted: true, receiptId: id };
  }
}
