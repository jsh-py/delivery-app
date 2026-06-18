# 배달앱 서비스 배포 가이드 (Vercel & Neon DB)

이 가이드는 로컬에서 완료된 배달앱 서비스를 **GitHub ➡️ Vercel**로 배포하고, **Neon DB (Serverless PostgreSQL)**와 연동하는 과정을 안내합니다.

---

## 1. Neon PostgreSQL 데이터베이스 설정

Neon은 서버리스 PostgreSQL로, 무료 등급에서도 간편하게 DB를 생성하고 연동할 수 있습니다.

1. [Neon 공식 홈페이지](https://neon.tech/)에 접속하여 로그인합니다.
2. **Create a New Project**를 클릭하고 데이터베이스를 생성합니다.
   * Project Name: 임의 설정 (예: `vibe-delivery`)
   * Postgres Version: 15 또는 16
   * Region: 가까운 지역 선택 (예: `Asia Pacific (Singapore)`)
3. 프로젝트가 생성되면 화면 중앙에 **Connection String (접속 주소)**이 나타납니다.
   * 주소 형식: `postgresql://[USER]:[PASSWORD]@[HOST]/neondb?sslmode=require`
   * 이 접속 주소를 복사해 둡니다.

---

## 2. GitHub 저장소 업로드

Vercel은 GitHub 저장소와 연동하여 자동으로 코드를 빌드하고 배포합니다.

1. GitHub에 로그인한 후, 새로운 **Private 또는 Public 저장소**를 생성합니다.
2. 로컬 컴퓨터의 프로젝트 폴더에서 터미널을 열고 코드를 커밋하여 GitHub에 푸시합니다:
   ```bash
   git init
   git add .
   git commit -m "feat: 배달앱 필수 기능 구현 및 도커 설정 완료"
   git branch -M main
   git remote add origin https://github.com/사용자이름/저장소이름.git
   git push -u origin main
   ```
   *(이 프로젝트는 마지막에 커밋이 몰려 있으면 감점 요인이 되므로, 수시로 커밋을 쌓는 것을 권장합니다.)*

---

## 3. Vercel 배포 및 환경 변수 설정

1. [Vercel 공식 홈페이지](https://vercel.com/)에 로그인합니다.
2. **Add New...** ➡️ **Project**를 클릭하고, 연동된 GitHub 계정에서 방금 생성한 배달앱 저장소를 찾아 **Import** 합니다.
3. **Configure Project** 화면에서 아래의 **Environment Variables (환경 변수)**를 설정합니다:

   | Key | Value | 설명 |
   | :--- | :--- | :--- |
   | `DATABASE_URL` | `postgresql://...` | 1단계에서 복사한 **Neon DB 접속 주소** |
   | `JWT_SECRET` | `임의의_긴_비밀키_문자열` | 세션 암호화용 비밀키 (아무 문자나 입력해도 무방) |

4. 환경 변수 입력 후 **Deploy**를 클릭하면 빌드 및 배포가 진행됩니다.
5. 배포가 완료되면 발급받은 공개 URL(`https://저장소이름.vercel.app`)을 통해 정상 작동을 확인합니다.

---

## 4. 실서버(Neon) 데이터베이스 초기화 및 시딩

실제 배포된 사이트에서 데이터가 조회되고 주문이 동작하려면, Neon DB에 테이블을 생성하고 데이터를 채워 넣어야 합니다.

로컬 환경(호스트 PC 또는 개발 터미널)의 루트 폴더에 `.env` 파일을 만들고 아래 코드를 임시로 작성한 뒤 터미널 명령을 실행합니다:

1. 프로젝트 루트에 `.env` 파일 생성:
   ```env
   DATABASE_URL="복사한 Neon DB 접속 주소"
   ```
2. 다음 명령어를 실행하여 Neon DB에 스키마를 동기화하고 데이터를 채웁니다:
   ```bash
   # 테이블 구조(스키마) 동기화
   npx prisma db push

   # 초기 식당 및 메뉴 정보 등록 (시딩)
   npx prisma db seed
   ```
3. 동기화가 성공하면 배포된 실서버 사이트에서 정상적으로 음식점 목록이 로드되고 회원가입/로그인/주문하기가 작동합니다.
   * 작업이 끝난 후 `.env` 파일은 보안을 위해 제거하거나 `.gitignore`에 등록하여 GitHub에 업로드되지 않도록 주의해 주세요.
