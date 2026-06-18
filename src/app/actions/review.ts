'use server';

import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export interface ReviewActionState {
  error?: string;
  success?: boolean;
}

export async function createReview(prevState: ReviewActionState, formData: FormData): Promise<ReviewActionState> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: '로그인이 필요합니다.' };
  }

  const orderId = formData.get('orderId') as string;
  const ratingStr = formData.get('rating') as string;
  const content = formData.get('content') as string;

  if (!orderId || !ratingStr || !content) {
    return { error: '모든 필드를 입력해 주세요.' };
  }

  const rating = parseInt(ratingStr, 10);
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return { error: '별점은 1점부터 5점 사이여야 합니다.' };
  }

  if (content.trim().length < 5) {
    return { error: '리뷰 내용은 최소 5자 이상 작성해 주세요.' };
  }

  try {
    // 1. Verify the order exists and belongs to the user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.userId !== user.id) {
      return { error: '유효하지 않은 주문입니다.' };
    }

    // 2. Check if the user already wrote a review for this order
    const existingReview = await prisma.review.findUnique({
      where: { orderId },
    });

    if (existingReview) {
      return { error: '이미 이 주문에 대한 리뷰를 작성하셨습니다.' };
    }

    // 3. Create the review record
    await prisma.review.create({
      data: {
        rating,
        content: content.trim(),
        userId: user.id,
        restaurantId: order.restaurantId,
        orderId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Review creation error:', error);
    return { error: '리뷰 등록 중 오류가 발생했습니다. 다시 시도해 주세요.' };
  }
}
