import React from 'react';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import OrdersClient from '@/components/OrdersClient';

export default async function OrdersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?redirect=/orders');
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      restaurant: true,
      review: true,
      orderItems: {
        include: {
          menu: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return <OrdersClient orders={orders} />;
}
