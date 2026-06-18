'use server';

import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

interface OrderItemInput {
  menuId: string;
  quantity: number;
  price: number;
}

interface OrderInput {
  restaurantId: string;
  totalPrice: number;
  items: OrderItemInput[];
}

export async function createOrder(data: OrderInput) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: '로그인이 필요합니다.' };
  }

  if (!data.restaurantId || data.items.length === 0) {
    return { error: '잘못된 주문 정보입니다.' };
  }

  try {
    const newOrder = await prisma.$transaction(async (tx) => {
      // 1. Create the order record
      const order = await tx.order.create({
        data: {
          userId: user.id,
          restaurantId: data.restaurantId,
          totalPrice: data.totalPrice,
          status: 'PENDING',
        },
      });

      // 2. Create the order item records
      const orderItemsData = data.items.map((item) => ({
        orderId: order.id,
        menuId: item.menuId,
        quantity: item.quantity,
        price: item.price,
      }));

      await tx.orderItem.createMany({
        data: orderItemsData,
      });

      return order;
    });

    return { success: true, orderId: newOrder.id };
  } catch (error) {
    console.error('Order creation error:', error);
    return { error: '주문 중 오류가 발생했습니다. 다시 시도해 주세요.' };
  }
}
