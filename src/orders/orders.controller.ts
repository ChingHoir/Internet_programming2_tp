import { Controller, Post, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // POST /orders
  @Post()
  createOrder(@Body() orderDto: any) {
    // Delegate to OrdersService
    return this.ordersService.createOrder(orderDto);
  }
}
