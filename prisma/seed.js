const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear database
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.menu.deleteMany({});
  await prisma.restaurant.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Cleared database.');

  // Create Restaurants and Menus
  await prisma.restaurant.create({
    data: {
      name: '성수 버거 웍스',
      category: '양식/버거',
      image: '/images/burger.jpg',
      description: '수제 패티와 유기농 번으로 만든 성수동 정통 수제 버거 전문점입니다.',
      address: '서울시 성동구 성수동2가 123-45',
      menus: {
        create: [
          { name: '시그니처 비프 버거', price: 9800, description: '100% 소고기 패티와 아메리칸 치즈, 특제 소스가 어우러진 베스트셀러', image: '/images/burger_menu1.jpg' },
          { name: '베이컨 아보카도 버거', price: 11500, description: '바삭한 베이컨과 신선한 아보카도가 듬뿍 들어간 프리미엄 버거', image: '/images/burger_menu2.jpg' },
          { name: '트러플 머쉬룸 버거', price: 12000, description: '진한 트러플 향의 버섯 볶음이 들어간 깊은 풍미의 버거', image: '/images/burger_menu3.jpg' },
          { name: '크리스피 케이준 감자튀김', price: 4500, description: '바삭하게 튀겨낸 케이준 스파이스 감자튀김', image: '/images/fries.jpg' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '마포 원조 족발',
      category: '한식/족발',
      image: '/images/jokbal.jpg',
      description: '30년 전통의 씨육수로 매일 직접 삶아 쫄깃하고 담백한 원조 족발입니다.',
      address: '서울시 마포구 공덕동 456-78',
      menus: {
        create: [
          { name: '원조 한방 족발 (대)', price: 39000, description: '한방 약재로 삶아 잡내 없이 야들야들한 정통 족발', image: '/images/jokbal_menu1.jpg' },
          { name: '매콤 직화 불족발', price: 32000, description: '화끈한 직화 불맛을 입혀 맛있게 매운 중독성 강한 불족발', image: '/images/jokbal_menu2.jpg' },
          { name: '새콤달콤 쟁반막국수', price: 12000, description: '신선한 야채와 매콤새콤한 양념으로 버무린 별미 막국수', image: '/images/makguksu.jpg' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '하오츠 마라탕',
      category: '중식/아시안',
      image: '/images/maratang.jpg',
      description: '사천식 마라 향료와 깊은 사골 육수로 한국인의 입맛을 사로잡은 마라탕 전문점.',
      address: '서울시 서대문구 창천동 12-34',
      menus: {
        create: [
          { name: '대표 마라탕 (기본)', price: 10000, description: '야채, 피쉬볼, 소고기가 듬뿍 들어간 칼칼하고 얼큰한 마라탕', image: '/images/maratang_menu1.jpg' },
          { name: '바삭 꿔바로우 (중)', price: 16000, description: '겉은 바삭하고 속은 쫄깃한 새콤달콤한 정통 꿔바로우', image: '/images/guobaorou.jpg' },
          { name: '마라샹궈', price: 22000, description: '신선한 재료를 매콤알싸한 마라 소스에 볶아낸 사천식 볶음 요리', image: '/images/marashanguo.jpg' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '도쿄 스시야',
      category: '일식/돈까스',
      image: '/images/sushi.jpg',
      description: '신선한 제철 활어와 갓 지은 밥으로 정성껏 쥐어내는 수제 초밥 전문점.',
      address: '서울시 강남구 역삼동 789-12',
      menus: {
        create: [
          { name: '특선 모듬초밥 (12pcs)', price: 22000, description: '광어, 연어, 참치, 장어 등 신선한 생선으로 구성된 대표 초밥 세트', image: '/images/sushi_menu1.jpg' },
          { name: '바삭 안심 돈카츠 세트', price: 14000, description: '겉바속촉 안심 카츠와 미니 우동이 함께 나오는 든든한 세트', image: '/images/tonkatsu.jpg' },
          { name: '연어 덮밥 (사케동)', price: 16000, description: '생연어를 두툼하게 썰어 올려 부드럽고 고소한 덮밥', image: '/images/sakedong.jpg' }
        ]
      }
    }
  });

  await prisma.restaurant.create({
    data: {
      name: '피렌체 파스타',
      category: '양식/이탈리안',
      image: '/images/pasta.jpg',
      description: '이탈리아 피렌체 감성의 홈메이드 파스타와 화덕 피자를 제공합니다.',
      address: '서울시 종로구 삼청동 99-8',
      menus: {
        create: [
          { name: '베이컨 크림 까르보나라', price: 14500, description: '계란 노른자와 진한 파마산 치즈로 맛을 낸 정통 크림 파스타', image: '/images/pasta_menu1.jpg' },
          { name: '매콤 쉬림프 토마토 파스타', price: 15500, description: '통통한 새우와 매콤한 토마토 소스가 어우러진 파스타', image: '/images/pasta_menu2.jpg' },
          { name: '루꼴라 마르게리따 피자', price: 18000, description: '신선한 루꼴라와 모짜렐라 치즈, 토마토 소스가 어우러진 화덕 피자', image: '/images/pizza.jpg' }
        ]
      }
    }
  });

  console.log('Seeded restaurants and menus successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
