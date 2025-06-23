# 🎯 Match Now - 매칭 서비스 백엔드

NestJS와 MongoDB를 사용한 매칭 서비스 백엔드 API입니다.

## 🚀 빠른 시작

### 전체 환경을 Docker로 실행하므로 로컬에 Node.js나 MongoDB 설치 불필요!

```bash
# 1. 저장소 클론
git clone git@github.com:Hong-pil/matchnow-server.git
cd matchnow-server

# 2. 환경변수 설정
.env
nginx.conf
simple.conf

# 3. Docker로 실행
# 서비스 중지
$ docker-compose down
# 완전 정리 (볼륨 포함)
$ docker-compose down -v (주의!!!)
# 서비스 시작
$ docker-compose up -d
# 컨테이너 리소스 사용량
$ docker stats
# 모든 서비스 확인
$ docker-compose ps

# 4. 로그 확인
docker-compose logs -f
docker-compose logs -f nestjs-app
docker-compose logs -f nginx
docker-compose logs -f mongodb

# 5. 개발 도구
# MongoDB 웹 관리도구 시작
docker-compose --profile dev-tools up -d
# MongoDB 직접 접속
docker-compose exec mongodb mongo -u admin -p
# NestJS 컨테이너 내부 접속
docker-compose exec nestjs-app sh
# Nginx 설정 확인
docker-compose exec nginx nginx -t

# 6. 실행 확인
curl http://localhost/          # 메인 페이지
curl http://localhost/health    # 헬스체크
curl -I http://localhost/api    # API 문서
# 국가 목록 조회
curl http://localhost/api/v1/countries
# 사용자 생성
curl -X POST http://localhost/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com"}'


# Nginx 설정 수정 후 적용 방법
VSCode에서 docker/nginx/simple.conf 파일 수정
# Nginx 재시작
$ docker-compose stop nginx
$ docker-compose rm -f nginx
$ docker-compose up -d nginx
$ docker-compose ps
# 테스트
$ curl http://localhost/health
$ curl http://localhost/


# VSCode에서 로컬에 node_modules가 없어서 TypeScript 타입을 찾지 못하면 코드에서 에러 표시가 되기 때문에, 로컬에서도 아래 명령어로 node_modules 설치하는게 좋다.
# 단! Docker에서 실행되기 때문에 VSCode에서 코드 에러 표시가 된다고해서 실행이 안 되는 것이 아니다. 단지 개발 편의성을 위해 설치하는 것!
# 버전 확인
node --version
pnpm --version
# 프로젝트 루트에서
# 로컬에 Node.js와 pnpm 임시 설치 (개발용)
$ brew install node pnpm
# 로컬에 의존성 설치 (VS Code용)
$ pnpm install
# 설치 확인
ls -la node_modules/@nestjs/config






# 맥북에서 시작하기
# 1. Docker 앱 실행
# 2. 프로젝트 실행
  # 서비스 시작
  $ docker-compose up -d
  # 컨테이너 리소스 사용량
  $ docker stats
  # 모든 서비스 확인
  $ docker-compose ps
# 3. 로그 확인
docker-compose logs -f
docker-compose logs -f nestjs-app
docker-compose logs -f nginx
docker-compose logs -f mongodb





# Ubuntu Desktop PC 에서 시작하기

# Docker 와 Docker Compose 설치
# 1단계: Docker Engine 설치 
# 업데이트 및 필수 패키지 설치:
$ sudo apt update
$ sudo apt install apt-transport-https ca-certificates curl software-properties-common
# Docker의 GPG 키 추가: 
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
# Docker 저장소 추가: 
$ echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
# apt 패키지 업데이트 및 Docker 설치: 
$ sudo apt update
$ sudo apt install docker-ce docker-ce-cli containerd.io
# Docker 실행 권한 확인 및 실행: 
$ sudo systemctl enable docker
$ sudo systemctl start docker
$ sudo systemctl status docker
# 2단계: Docker Compose 설치 
# Docker 공식 저장소를 이용한 설치:
# Docker Compose 설치: 
$ sudo apt update
$ sudo apt install docker-compose-plugin
# 설치 확인:
$ docker compose version


# Docker 실행
# 이전 컨테이너/이미지 정리 (선택사항)
docker system prune -a -f
# 🔥 Ubuntu에서는 docker-compose 대신 docker compose 사용!
docker compose down -v
# 서비스 시작
docker compose up -d
# 빌드가 필요한 경우
docker compose up -d --build
# 상태 확인
docker compose ps
docker compose logs -f
# 리소스 사용량 확인
docker stats

# 접속 테스트
# 헬스체크
curl http://localhost/health
curl http://localhost:4011/health
# API 테스트
curl http://localhost/api
curl http://localhost/api/v1/countries
# 브라우저 테스트
http://175.126.95.157/api

```

## 📋 시스템 요구사항

- **Docker Desktop** (유일한 요구사항!)
- macOS 10.14 이상 / Linux / Windows 10 이상
- 최소 4GB RAM 권장

## 🏗️ 프로젝트 구조

```
matchnow-server/
├── 📄 docker-compose.yml     # Docker 서비스 정의
├── 📄 Dockerfile            # NestJS 이미지 빌드
├── 📄 .dockerignore         # Docker 빌드 제외 파일
├── 📄 .env                  # 환경변수 (비공개)
├── 📄 .env.example          # 환경변수 템플릿
├── 📁 docker/               # Docker 데이터 저장소
│   └── 📁 mongodb/
│       ├── 📁 data/         # MongoDB 데이터 (영구 저장)
│       └── 📁 logs/         # MongoDB 로그
├── 📁 src/                  # NestJS 소스 코드
├── 📄 package.json          # 프로젝트 의존성
└── 📄 README.md
```

## 🐳 Docker 서비스 구성

| 서비스 | 포트 | 설명 | 접속 URL |
|--------|------|------|----------|
| **nestjs-app** | 4011 | NestJS 메인 애플리케이션 | http://localhost:4011 |
| **mongodb** | 27017 | MongoDB 데이터베이스 | mongodb://localhost:27017 |
| **mongo-express** | 8081 | MongoDB 웹 관리도구 (선택사항) | http://localhost:8081 |

## 🛠️ 개발 환경 설정

### 📦 1단계: 기존 환경 정리 (선택사항)

기존에 Node.js, MongoDB 등이 설치되어 있다면 충돌을 방지하기 위해 제거하는 것을 권장합니다.

**macOS 환경 정리:**
```bash
# 기존 개발 환경 완전 정리 스크립트 실행
# (위에서 제공된 cleanup_macos.sh 스크립트 사용)
chmod +x cleanup_macos.sh
./cleanup_macos.sh

# 터미널 재시작 또는
source ~/.zshrc
```

### 🐳 2단계: Docker 설치

**macOS:**
```bash
# Homebrew 설치 (없다면)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Homebrew 버전 확인
brew --version
# 출력 예시: Homebrew 4.x.x

# Docker Desktop 설치
brew install --cask docker

# Docker 실행
open /Applications/Docker.app

# Docker 설치 확인 (Docker Desktop 실행 후)
docker --version
# 출력 예시: Docker version 24.x.x

docker-compose --version
# 출력 예시: Docker Compose version v2.x.x
```

**Linux (Ubuntu):**
```bash
# 시스템 패키지 업데이트
sudo apt update

# Docker 설치
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Docker Compose 설치
sudo apt install docker-compose-plugin

# Docker 설치 확인
docker --version
# 출력 예시: Docker version 24.x.x

docker compose version
# 출력 예시: Docker Compose version v2.x.x

# 현재 사용자를 docker 그룹에 추가
sudo usermod -aG docker $USER

# 변경사항 적용을 위해 로그아웃 후 다시 로그인 또는
newgrp docker
```

**Windows:**
```bash
# Docker Desktop for Windows 다운로드 및 설치
# https://docs.docker.com/desktop/install/windows-install/

# PowerShell에서 설치 확인
docker --version
# 출력 예시: Docker version 24.x.x

docker-compose --version
# 출력 예시: Docker Compose version v2.x.x
```

### 📁 3단계: 프로젝트 준비

```bash
# 프로젝트 클론
git clone <repository-url>
cd matchnow-server

# Git 설치 확인 (필요시)
git --version
# 출력 예시: git version 2.x.x

# 데이터 디렉토리 생성
mkdir -p docker/mongodb/{data,logs}

# 디렉토리 구조 확인
ls -la docker/mongodb/
# 출력: data/, logs/ 디렉토리 확인

# 환경변수 파일 생성
cp .env.example .env

# 파일 생성 확인
ls -la | grep env
# 출력: .env, .env.example 파일 확인
```

### 🔐 4단계: 환경변수 설정

`.env` 파일을 열어서 보안을 위해 기본 비밀번호들을 변경하세요:

```env
# ===================
# 기본 애플리케이션 설정
# ===================
NODE_ENV=development
PORT=4011

# ===================
# MongoDB 설정
# ===================
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=MongoDB_Password_2024!  # 🔐 변경 필요
MONGO_DATABASE=matchnow_dev

# MongoDB 연결 URI (Docker 내부 통신용)
MONGODB_URI=mongodb://admin:MongoDB_Password_2024!@mongodb:27017/matchnow_dev?authSource=admin

# ===================
# JWT 설정
# ===================
JWT_SECRET=your_super_secret_jwt_key_change_this_later  # 🔐 변경 필요

# ===================
# MongoDB 관리도구 비밀번호
# ===================
MONGO_EXPRESS_PASSWORD=admin123  # 🔐 변경 필요
```

**보안 팁:**
- 비밀번호는 최소 16자 이상 사용
- 대소문자, 숫자, 특수문자 조합 사용
- 개발/스테이징/프로덕션 환경별로 다른 비밀번호 사용

## 🚀 실행 명령어

### 🎯 기본 실행 (NestJS + MongoDB)

```bash
# Docker 서비스 상태 확인
docker info
# Docker가 실행 중인지 확인

# 백그라운드에서 실행
docker-compose up -d

# 실행 상태 확인
docker-compose ps
# 출력 예시:
# NAME                    COMMAND                  SERVICE     STATUS      PORTS
# matchnow-mongodb        "docker-entrypoint.s…"  mongodb     Up          0.0.0.0:27017->27017/tcp
# matchnow-nestjs         "docker-entrypoint.s…"  nestjs-app  Up          0.0.0.0:4011->4011/tcp

# 서비스 상태 확인
curl http://localhost:4011/health
# 또는 브라우저에서 http://localhost:4011 접속

# 로그 확인
docker-compose logs -f
```

### 🛠️ 관리도구와 함께 실행 (개발용)

```bash
# MongoDB 웹 관리도구 포함 실행
docker-compose --profile dev-tools up -d

# 관리도구 접속 확인
curl http://localhost:8081
# 또는 브라우저에서 http://localhost:8081 접속
# 로그인: admin / admin123 (환경변수에서 설정한 값)
```

### 🔧 서비스 제어

```bash
# 서비스 정지
docker-compose down

# 서비스 정지 및 볼륨 삭제 (데이터 완전 삭제)
docker-compose down -v

# 특정 서비스만 재시작
docker-compose restart nestjs-app

# 이미지 재빌드 (코드 변경 후)
docker-compose up -d --build nestjs-app

# 실행 중인 컨테이너 확인
docker ps

# 모든 컨테이너 확인 (정지된 것 포함)
docker ps -a
```

## 🔧 개발 워크플로우

### 💻 코드 개발

```bash
# 실시간 로그 확인하며 개발
docker-compose logs -f nestjs-app

# 코드 수정 → 자동 Hot Reload ✅
# src/ 폴더의 파일 변경 시 자동으로 서버 재시작됨

# API 테스트
curl -X GET http://localhost:4011/api/users
curl -X POST http://localhost:4011/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'
```

### 📦 패키지 관리

```bash
# 새 패키지 설치
docker-compose exec nestjs-app pnpm add package-name

# 개발용 패키지 설치
docker-compose exec nestjs-app pnpm add -D package-name

# 패키지 설치 후 컨테이너 재시작
docker-compose restart nestjs-app

# 패키지 제거
docker-compose exec nestjs-app pnpm remove package-name

# 의존성 확인
docker-compose exec nestjs-app pnpm list
```

### 🗃️ 데이터베이스 관리

```bash
# MongoDB Shell 접속
docker-compose exec mongodb mongo -u admin -p

# MongoDB 상태 확인
docker-compose exec mongodb mongo -u admin -p --eval "db.adminCommand('ping')"

# 데이터베이스 목록 확인
docker-compose exec mongodb mongo -u admin -p --eval "show dbs"

# 컬렉션 목록 확인
docker-compose exec mongodb mongo -u admin -p matchnow_dev --eval "show collections"

# 웹 관리도구 사용 (더 편리함)
open http://localhost:8081
```

## 🌐 API 엔드포인트

### 📍 기본 엔드포인트

```bash
# Health Check
curl http://localhost:4011/health
# 응답: {"status":"ok","timestamp":"..."}

# API 문서 (Swagger)
open http://localhost:4011/api

# API 버전 정보
curl http://localhost:4011/api/version
```

### 🔐 인증 API

```bash
# 회원가입
curl -X POST http://localhost:4011/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com", 
    "password": "test123"
  }'

# 로그인
curl -X POST http://localhost:4011/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123"
  }'
```

### 👤 사용자 API

```bash
# 프로필 조회 (JWT 토큰 필요)
curl -X GET http://localhost:4011/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 프로필 수정
curl -X PUT http://localhost:4011/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Updated Name",
    "bio": "Updated bio"
  }'
```

### 💕 매칭 API

```bash
# 매칭 목록 조회
curl -X GET http://localhost:4011/matches \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 매칭 생성
curl -X POST http://localhost:4011/matches \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "targetUserId": "user_id_here"
  }'
```

## 🗂️ 데이터베이스 스키마

### MongoDB 컬렉션

**users 컬렉션:**
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  profile: {
    name: String,
    age: Number,
    bio: String,
    photos: [String],
    location: {
      type: "Point",
      coordinates: [longitude, latitude]
    }
  },
  createdAt: Date,
  updatedAt: Date
}
```

**matches 컬렉션:**
```javascript
{
  _id: ObjectId,
  user1: ObjectId,
  user2: ObjectId,
  status: String, // 'pending', 'accepted', 'declined'
  createdAt: Date,
  matchedAt: Date
}
```

**conversations 컬렉션:**
```javascript
{
  _id: ObjectId,
  participants: [ObjectId],
  messages: [{
    sender: ObjectId,
    content: String,
    timestamp: Date,
    readBy: [ObjectId]
  }],
  lastActivity: Date
}
```

### 📊 데이터베이스 연결 정보

```
Host: localhost
Port: 27017
Database: matchnow_dev
Username: admin
Password: (환경변수에서 설정)
Auth Database: admin
```

## 🔍 문제 해결

### 🚫 포트 충돌 해결

```bash
# 포트 사용 확인
lsof -i :4011    # NestJS 포트
lsof -i :27017   # MongoDB 포트  
lsof -i :8081    # Mongo Express 포트

# 프로세스 종료
kill -9 <PID>

# Docker 컨테이너에서 포트 사용 확인
docker-compose ps
```

### 🐳 Docker 관련 문제

```bash
# Docker 서비스 상태 확인
docker info
# Docker가 실행 중인지 확인

# Docker Desktop 재시작 (macOS)
osascript -e 'quit app "Docker"'
open /Applications/Docker.app

# Docker 데몬 재시작 (Linux)
sudo systemctl restart docker

# 컨테이너 로그 확인
docker-compose logs nestjs-app
docker-compose logs mongodb

# 컨테이너 내부 접속하여 디버깅
docker-compose exec nestjs-app sh
docker-compose exec mongodb mongo -u admin -p
```

### 📁 권한 문제 해결

```bash
# Docker 데이터 디렉토리 권한 설정 (Linux/macOS)
sudo chown -R $USER:$USER docker/

# Docker 그룹에 사용자 추가 (Linux)
sudo usermod -aG docker $USER
newgrp docker

# 권한 확인
ls -la docker/mongodb/
```

### 🔄 완전 초기화

```bash
# 모든 컨테이너 정지 및 삭제 (데이터 포함)
docker-compose down -v

# Docker 이미지 삭제
docker rmi $(docker images -q matchnow*)

# 캐시 정리
docker system prune -a

# 완전히 새로 시작
docker-compose up -d --build
```

### 🌐 네트워크 문제

```bash
# Docker 네트워크 확인
docker network ls

# 특정 네트워크 상세 정보
docker network inspect matchnow-server_matchnow-network

# 네트워크 재생성
docker-compose down
docker network prune
docker-compose up -d
```

## 📝 로그 확인 및 디버깅

### 🔍 로그 명령어

```bash
# 모든 서비스 로그 (실시간)
docker-compose logs -f

# 특정 서비스 로그
docker-compose logs -f nestjs-app
docker-compose logs -f mongodb

# 최근 N줄만 확인
docker-compose logs --tail=100 nestjs-app

# 특정 시간 이후 로그
docker-compose logs --since="2024-01-01T12:00:00" nestjs-app

# 로그 파일로 저장
docker-compose logs nestjs-app > app.log
```

### 🐛 디버깅 팁

```bash
# 컨테이너 내부 파일 시스템 확인
docker-compose exec nestjs-app ls -la
docker-compose exec nestjs-app cat package.json

# 환경변수 확인
docker-compose exec nestjs-app env | grep MONGO

# 네트워크 연결 테스트
docker-compose exec nestjs-app ping mongodb
docker-compose exec nestjs-app curl http://mongodb:27017

# 프로세스 확인
docker-compose exec nestjs-app ps aux
```

## 🚀 배포 가이드

### 🏠 로컬 개발 환경

```bash
# 개발 모드로 실행
docker-compose up -d

# 관리도구 포함
docker-compose --profile dev-tools up -d
```

### 🧪 스테이징 환경

```bash
# 스테이징용 환경변수 파일 준비
cp .env .env.staging

# 스테이징 환경으로 실행
NODE_ENV=staging docker-compose up -d
```

### 🌐 프로덕션 환경

```bash
# 프로덕션용 환경변수 설정
cp .env .env.production
# 보안 강화: 복잡한 비밀번호, JWT 시크릿 변경

# 프로덕션 모드로 빌드 및 실행
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# SSL 인증서 설정 (Nginx 사용 시)
# Nginx 설정은 나중에 추가 예정
```

## 📊 성능 모니터링

### 📈 리소스 사용량 확인

```bash
# Docker 컨테이너 리소스 사용량
docker stats

# 특정 컨테이너 상세 정보
docker inspect matchnow-nestjs
docker inspect matchnow-mongodb

# 디스크 사용량
docker system df
du -sh docker/mongodb/data
```

### 🔍 성능 측정

```bash
# API 응답 시간 측정
time curl http://localhost:4011/health

# 동시 요청 테스트 (Apache Bench 사용 시)
ab -n 1000 -c 10 http://localhost:4011/api/users

# MongoDB 성능 확인
docker-compose exec mongodb mongo -u admin -p --eval "db.runCommand({serverStatus: 1})"
```

## 🤝 개발 팀 협업

### 📥 새 팀원 온보딩

```bash
# 1. 저장소 클론
git clone <repository-url>
cd matchnow-server

# 2. 환경변수 설정
cp .env.example .env
# .env 파일 비밀번호 수정

# 3. 한 번에 실행
docker-compose up -d

# 4. 접속 확인
curl http://localhost:4011/health
```

### 🔄 코드 동기화

```bash
# 최신 코드 받기
git pull origin main

# 의존성 업데이트가 있다면 재빌드
docker-compose up -d --build

# 데이터베이스 마이그레이션 (필요시)
docker-compose exec nestjs-app pnpm run migration:run
```

### 📋 개발 규칙

1. **브랜치 전략**: `main` → `develop` → `feature/기능명`
2. **코드 리뷰**: PR 필수, 최소 1명 승인
3. **환경변수**: `.env` 파일은 커밋하지 않음
4. **Docker**: 모든 개발은 Docker 환경에서 진행

## 🧪 테스트

### 🔧 유닛 테스트

```bash
# 테스트 실행
docker-compose exec nestjs-app pnpm test

# 테스트 커버리지
docker-compose exec nestjs-app pnpm test:cov

# 테스트 파일 감시 모드
docker-compose exec nestjs-app pnpm test:watch
```

### 🌐 통합 테스트

```bash
# E2E 테스트 실행
docker-compose exec nestjs-app pnpm test:e2e

# API 테스트 (Postman 컬렉션)
# postman/ 폴더의 컬렉션 파일 import
```

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🆘 지원 및 문의

### 🐛 버그 리포트
문제가 있으시면 [GitHub Issues](https://github.com/your-repo/issues)에 등록해주세요.

### 💬 커뮤니티
- **Discord**: [개발자 커뮤니티 링크]
- **Slack**: [팀 워크스페이스 링크]

### 📚 추가 자료
- **API 문서**: http://localhost:4011/api (Swagger)
- **NestJS 공식 문서**: https://nestjs.com
- **MongoDB 공식 문서**: https://docs.mongodb.com
- **Docker 공식 문서**: https://docs.docker.com

---

**🎯 Happy Coding! 즐거운 개발 되세요!**

> 💡 **팁**: 이 README는 살아있는 문서입니다. 프로젝트가 발전함에 따라 지속적으로 업데이트됩니다.