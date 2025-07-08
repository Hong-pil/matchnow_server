// src/main.ts 수정
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import helmet from 'helmet';
import * as hpp from 'hpp';
import { join } from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CORS 설정 (웹사이트에서 API 접근 허용)
  app.enableCors({
    origin: ['http://localhost', 'http://localhost:3000', 'http://localhost:80', 'http://175.126.95.157'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // 정적 파일 서빙 설정
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/admin/', // /admin 경로로 웹사이트 접근
  });

  // 개발 환경에서만 Swagger 활성화
  if (process.env.NODE_ENV !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(process.env.APP_NAME || 'Match Now API')
      .setDescription('Match Now API 문서')
      .setVersion('1.0')
      .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, swaggerDocument, {
      jsonDocumentUrl: 'api-json',
    });
  }

  // 기본 루트 경로 수정 (API 정보 + 관리자 페이지 링크)
  app.use('/', (req, res, next) => {
    if (req.path === '/') {
      res.json({ 
        message: 'Match Now API Server', 
        status: 'running',
        timestamp: new Date().toISOString(),
        endpoints: {
          health: '/health',
          api: '/api',
          docs: '/api',
          admin: '/admin/',  // 관리자 웹사이트 메인
          adminLogin: '/admin/login.html',  // 관리자 로그인
          adminRegister: '/admin/register.html',  // 관리자 회원가입
        }
      });
    } else {
      next();
    }
  });

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.use(compression());

  // 개발 환경이 아닐 때만 보안 미들웨어 적용
  if (process.env.NODE_ENV !== 'development') {
    app.use(hpp());
    app.use(helmet({
      contentSecurityPolicy: false, // 웹사이트가 동작하도록 CSP 비활성화
    }));
  }

  const port = process.env.PORT || 4011;
  await app.listen(port, '0.0.0.0');

  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Admin panel available at: ${await app.getUrl()}/admin/`);
  console.log(`Admin login at: ${await app.getUrl()}/admin/login.html`);
}
void bootstrap();