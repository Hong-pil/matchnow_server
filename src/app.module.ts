import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { ClsModule } from 'nestjs-cls';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { ClsStoreKey } from '@/common/constants/cls.constant';

import { AppController } from './app.controller';
import { AppHealthIndicator } from './app.health';
import { UsersModule } from './modules/users/users.module';
import { SportsCategoriesModule } from './modules/sports-categories/sports-categories.module';
import { LeagueSeasonsModule } from './modules/league-seasons/league-seasons.module';
import { CountriesModule } from './modules/countries/countries.module';
import { LeaguesModule } from './modules/leagues/leagues.module';
import { PlayersModule } from './modules/players/players.module';
import { TeamsModule } from './modules/teams/teams.module';
import { GamesModule } from './modules/games/games.module';
import { BetsApiModule } from './modules/betsapi/betsapi.module';

@Module({
  imports: [
    TerminusModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // 정적 파일 서빙 모듈 추가
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/admin',
    }),
    
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        setup: (cls, req, res) => {
          cls.set(ClsStoreKey.DATA_LOADERS, {});
          cls.set(ClsStoreKey.REQUEST, req);
          cls.set(ClsStoreKey.RESPONSE, res);
        },
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('db.service.connection.uri') || 
                    configService.get<string>('MONGODB_URI') ||
                    process.env.MONGODB_URI || 
                    'mongodb://localhost:27017/match-now-dev';
        
        console.log('🔍 Final MongoDB URI:', uri);
        
        return {
          uri,
          autoCreate: true,
          autoIndex: false,
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    SportsCategoriesModule,
    LeagueSeasonsModule,
    CountriesModule,
    LeaguesModule,
    PlayersModule,
    TeamsModule,
    GamesModule,
    BetsApiModule,
  ],
  controllers: [AppController],
  providers: [AppHealthIndicator],
})
export class AppModule {}