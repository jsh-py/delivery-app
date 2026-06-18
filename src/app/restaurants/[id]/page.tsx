import React from 'react';
import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import RestaurantDetailClient from '@/components/RestaurantDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RestaurantDetailPage({ params }: PageProps) {
  const { id } = await params;

  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    include: {
      menus: {
        orderBy: { name: 'asc' },
      },
      reviews: {
        include: {
          user: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!restaurant) {
    notFound();
  }

  return (
    <RestaurantDetailClient
      restaurant={restaurant}
      menus={restaurant.menus}
      reviews={restaurant.reviews}
    />
  );
}
