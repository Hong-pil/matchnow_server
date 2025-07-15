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

# 3. 빠른 실행 (부팅 후 실행)

# 맥북에서 실행
# 기존 컨테이너 정리
docker-compose -f docker-compose.mac.yml down -v
# 재실행
docker-compose -f docker-compose.mac.yml up -d --build
# 상태 확인
docker-compose -f docker-compose.mac.yml ps
# 로그 확인
docker-compose -f docker-compose.mac.yml logs -f

# 우분투에서 실행
## MongoDB 실행
$ sudo systemctl status mongod
$ sudo systemctl start mongod
## 프로젝트 경로로 이동
$ cd /var/www/html/matchnow_server
## 기존 컨테이너 정리
$ sudo docker compose down --remove-orphans
## 실행
$ sudo docker compose up -d --build
## 상태 확인
$ sudo docker compose ps
## 로그 확인
$ sudo docker compose logs -f



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
# 2. MongoDB 실행
  $ brew services start mongodb/brew/mongodb-community@4.4
    # 설치 안 되어 있다면? 설치하기
      # 1. MongoDB Community Edition 설치
        # 1. Homebrew 최신 업데이트
          $ brew update
        # 2. MongoDB Community Edition 4.4 설치 (AVX 미지원 CPU용)
          # (Ubuntu Desktop PC의 CPU가 AVX 미지원 모델이기 때문에 맥북에서도 동일하게 설치)
          # 처음엔 MongoDB 7.0 버전으로 시도했으나 현재 Ubuntu Desktop PC에서 사용 중인 CPU가 AVX 지원하지 않아서 4. 버전으로 설치함. (5. 버전부터 CPU가 AVX 지원해야 함)
            $ brew install mongodb-community@4.4
        # 3. MongoDB 4.4 버전 설치 확인
          $ mongod --version
          $ mongo --version  # 4.4에서는 mongo 명령어 사용
        # 4. MongoDB 서비스 시작 및 관리
          # MongoDB 4.4 서비스 시작 (백그라운드 실행)
          $ brew services start mongodb/brew/mongodb-community@4.4
          # 서비스 상태 확인
          $ brew services list | grep mongodb
          # 서비스 중지
          $ brew services stop mongodb/brew/mongodb-community@4.4
          # 서비스 재시작
          $ brew services restart mongodb/brew/mongodb-community@4.4
          # 수동으로 MongoDB 실행 (개발용)
          $ mongod --config /usr/local/etc/mongod.conf
        # 5. MongoDB 설정 파일 수정
          # 설정 파일 위치 (Apple Silicon Mac의 경우)
            $ ls -la /opt/homebrew/etc/mongod.conf
          # 설정 파일 편집
            $ sudo nano /opt/homebrew/etc/mongod.conf
              # mongod.conf 설정 내용
                systemLog:
                  destination: file
                  path: /opt/homebrew/var/log/mongodb/mongo.log  # Apple Silicon
                  logAppend: true
                storage:
                  dbPath: /opt/homebrew/var/mongodb  # Apple Silicon
                net:
                  port: 27017
                  bindIp: 127.0.0.1,localhost
                security:
                  authorization: enabled
        # 6. MongoDB 사용자 및 데이터베이스 설정
          # MongoDB Shell 접속 (4.4에서는 mongo 명령어 사용)
            $ mongo
          # 특정 데이터베이스로 직접 접속
            $ mongo mongodb://localhost:27017/matchnow_dev
          # 관리자 사용자 생성 (admin 데이터베이스로 전환)
            > use admin
              // 관리자 사용자 생성
              db.createUser({
                user: "admin",
                pwd: "matchnow0618!!!",
                roles: [
                  { role: "userAdminAnyDatabase", db: "admin" },
                  { role: "readWriteAnyDatabase", db: "admin" },
                  { role: "dbAdminAnyDatabase", db: "admin" }
                ]
              })
          # 생성 확인
            > db.getUsers()
          # 프로젝트용 데이터베이스 및 사용자 생성
            # matchnow_dev 데이터베이스로 전환
              > use matchnow_dev
          # 프로젝트용 사용자 생성
            db.createUser({
              user: "matchnow_user",
              pwd: "matchnow0618!!!",
              roles: [
                { role: "readWrite", db: "matchnow_dev" },
                { role: "dbAdmin", db: "matchnow_dev" }
              ]
            })
          # 생성 확인
            > db.getUsers()
          # 데이터베이스 확인
            > show dbs
          # 7. 연결 테스트 (4.4 버전)
              $ mongo
            # 특정 호스트/포트로 연결
              $ mongo --host localhost --port 27017
            # 연결 상태 확인
              $ mongo --eval "db.runCommand({connectionStatus: 1})"
            # 인증을 통한 연결 테스트
              # 관리자 계정으로 연결 (readWriteAnyDatabase 권한으로 모든 데이터베이스에 접근 가능)
                $ mongo 'mongodb://admin:matchnow0618!!!@localhost:27017/admin'
              # 프로젝트 데이터베이스 연결 (해당 데이터베이스에서만 readWrite 권한을 가짐)
                $ mongo 'mongodb://matchnow_user:matchnow0618!!!@localhost:27017/matchnow_dev'
          # 8. 유용한 명령어 모음
            # MongoDB 4.4 상태 확인
              $ brew services info mongodb/brew/mongodb-community@4.4
            # MongoDB 4.4 재시작
              $ brew services restart mongodb/brew/mongodb-community@4.4
            # MongoDB 로그 실시간 확인
              $ tail -f /usr/local/var/log/mongodb/mongo.log
            # MongoDB 데이터 디렉토리 크기 확인
              $ du -sh /usr/local/var/mongodb
            # MongoDB 프로세스 확인
              $ pgrep mongod
          # 9. MongoDB 데이터 완전 초기화
            # 1. Docker 서비스 중지
              $ docker-compose down
            # 2. 로컬 MongoDB 연결하여 데이터베이스 삭제
              $ $ mongo 'mongodb://admin:matchnow0618!!!@localhost:27017/admin'
              > show dbs;
              > use matchnow_dev;
              > db.dropDatabase();
              > show dbs;
            # 3. Docker 서비스 재시작
              $ docker-compose up -d
            # 4. 로그 확인
              $ docker-compose logs -f nestjs-app
# 3. 프로젝트 실행
  # 서비스 시작
  $ docker-compose up -d
  # 컨테이너 리소스 사용량
  $ docker stats
  # 모든 서비스 확인
  $ docker-compose ps
# 4. 로그 확인
  $ docker-compose logs -f
  $ docker-compose logs -f nestjs-app
  $ docker-compose logs -f nginx







# Ubuntu Desktop PC 빠른 시작 (재부팅 후 시작하기)
# MongoDB 시작
  $ sudo systemctl status mongod
  $ sudo systemctl start mongod
# Docker Compose로 프로젝트 시작
  # 이전 컨테이너/이미지 정리 (주의!)
    $ docker compose down -v
  # 서비스 시작
    $ docker compose up -d --build
  # 상태 확인
    $ docker compose ps
    $ docker compose logs -f
  # 리소스 사용량 확인
    $ docker stats

# Ubuntu Desktop PC 에서 시작하기
  # Docker 와 Docker Compose 설치
    # Ubuntu에서는 docker-compose 대신 docker compose 사용
    # 1. Docker 설치 
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
        $ sudo apt update
        $ sudo apt install docker-compose-plugin
      # 설치 확인:
        $ docker compose version
    # 2. Docker 명령어 모음
      # Docker 실행
        # 이전 컨테이너/이미지 정리 (주의!)
        $ docker system prune -a -f
        $ docker compose down -v
      # 서비스 시작
        $ docker compose up -d
      # 빌드가 필요한 경우
        $ docker compose up -d --build
      # 상태 확인
        $ docker compose ps
        $ docker compose logs -f
      # 리소스 사용량 확인
        $ docker stats
  # MongoDB 4.4 설치 (CPU AVX 미지원 필수)
    # Ubuntu 22.04는 기본적으로 libssl3을 사용하는데, MongoDB 4.4는 구버전인 libssl1.1을 요구한다. 그래서 libssl1.1 설치를 해야 한다.
      # 1. 기존 MongoDB 저장소 제거 (이미 추가한 경우)
        $ sudo rm -f /etc/apt/sources.list.d/mongodb-org-*.list
      # 2. MongoDB 4.4 GPG 키 추가 (경고 무시해도 됨)
        $ wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add
      # 3. Ubuntu 20.04 저장소 사용 (jammy 대신 focal)
        $ echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
        $ sudo apt update
      # 4. 사용 가능한 패키지 확인
        $ apt-cache search mongodb-org
      # 5. libssl1.1 설치
        $ sudo wget http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2_amd64.deb
        $ sudo dpkg -i libssl1.1_1.1.1f-1ubuntu2_amd64.deb
      # 6. MongoDB 4.4 설치
        $ sudo apt install -y mongodb-org
      # 7. 설치 확인
        $ mongod --version
      # 8. 명령어
          $ sudo systemctl start mongod
          $ sudo systemctl restart mongod
          $ sudo systemctl status mongod
          $ sudo systemctl stop mongod
      # !!! 외부접속 허용
        # 1. sudo nano /etc/mongod.conf
          # 아래와 같이 설정
          net:
            port: 27017
            #bindIp: 127.0.0.1
            bindIp: 0.0.0.0  # 모든 IP에서 접속 허용
        # 2. 외부 포트(27017) 열기 및 내부 방화벽 포트(27017) 허용 (Notion 참고)
        # 3. MongoDB 재시작
          $ sudo systemctl restart mongod
          $ sudo systemctl status mongod
          # 포트 바인딩 상태 확인
            $ sudo netstat -tlnp | grep 27017
        # 4. 맥북 터미널에서 접속 테스트 (맥북에도 MongoDB 4.4 버전 설치되어 있어야 됨)
          $ mongo 'mongodb://admin:matchnow0618!!!@175.126.95.157:27017/admin'

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







```bash

1. MySQL 설치 가이드


📱 macOS에서 MySQL 설치
# 1. Homebrew로 MySQL 설치
$ arch -arm64 brew install mysql

# 2. MySQL 서비스 시작
$ brew services start mysql

# 3. MySQL 보안 설정 (루트 비밀번호 설정)
$ mysql_secure_installation

# 설정 과정에서:
# - 비밀번호 강도 0 = LOW, 1 = MEDIUM and 2 = STRONG: 중에서 '2(STRONG)' 선택
# - 루트 비밀번호 설정: matchNow0618!!!
# - 익명 사용자 제거: Y
# - 원격 루트 로그인 비활성화: N (개발환경이므로)
# - 테스트 데이터베이스 제거: Y
# - 권한 테이블 재로드: Y

# 4. MySQL 접속 확인
$ mysql -u root -p
# 비밀번호: matchNow0618!!!

# 5. 데이터베이스 생성
> CREATE DATABASE matchnow_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 6. 전용 사용자 생성
> CREATE USER 'matchnow_user'@'%' IDENTIFIED BY 'matchNow0618!!!';
> GRANT ALL PRIVILEGES ON matchnow_dev.* TO 'matchnow_user'@'%';
> FLUSH PRIVILEGES;

# 7. 연결 테스트
$ mysql -u matchnow_user -p matchnow_dev









🐧 Ubuntu Desktop PC에서 MySQL 설치
# 1. 패키지 목록 업데이트
sudo apt update

# 2. MySQL 서버 설치
sudo apt install mysql-server

# 3. 비밀번호 설정
$ sudo mysql -u root -p
초기 비밀번호 없음. 엔터
> alter user 'root'@'localhost' identified with mysql_native_password by 'matchNow0618!!!';
> FLUSH PRIVILEGES;
> exit

# 3. MySQL 보안 설정
sudo mysql_secure_installation

# 설정 과정에서:
# - 루트 비밀번호 설정: 위에서 설정함
# - 익명 사용자 제거: Y
# - 원격 루트 로그인 비활성화: N
# - 테스트 데이터베이스 제거: Y
# - 권한 테이블 재로드: Y

# 4. MySQL 서비스 확인
$ sudo systemctl status mysql
$ sudo systemctl enable mysql  # 부팅 시 자동 시작

# 5. MySQL 접속
$ sudo mysql -u root -p

# 6. MySQL 재시작
sudo systemctl restart mysql

# 7. 데이터베이스 및 사용자 생성
$ sudo mysql -u root -p
> CREATE DATABASE matchnow_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
> CREATE USER 'matchnow_user'@'%' IDENTIFIED BY 'matchNow0618!!!';
> GRANT ALL PRIVILEGES ON matchnow_dev.* TO 'matchnow_user'@'%';
> FLUSH PRIVILEGES;

# !!! 외부접속 허용
  # 1. 외부 접속 허용 설정
      $ sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
      # bind-address = 127.0.0.1 을 다음으로 변경:
      bind-address = 0.0.0.0   # 모든 IP에서 접속 허용
  # 2. 내부 방화벽 포트 열기
      $ sudo ufw allow 3306
  # 3. 외부 포트(27017) 열기 및 내부 방화벽 포트(27017) 허용 (Notion 참고)
  # 4. MySQL 재시작
    $ sudo systemctl restart mysql
    # 포트 바인딩 상태 확인
      $ sudo netstat -tlnp | grep 3306
  # 4. 맥북 터미널에서 접속 테스트 (맥북에도 MySQL 설치되어 있어야 됨)
    $ mysql -h 175.126.95.157 -P 3306 -u matchnow_user -p
      # 비밀번호: matchNow0618!!!

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