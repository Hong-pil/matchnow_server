// src/modules/betsapi/controllers/betsapi.controller.ts
import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

import { generateResponse } from '@/common/utils/response.util';

import { BetsApiService } from '../services/betsapi.service';

class MatchesResponse extends generateResponse(null) {}

@ApiTags('BetsAPI - Football Fixtures')
@Controller('/api/v1/football')
export class BetsApiController {
  constructor(private readonly betsApiService: BetsApiService) {}

  @Get('matches/upcoming')
  @ApiOperation({
    summary: '예정된 축구 경기 목록 조회',
    description: 'BetsAPI v3를 통해 예정된 축구 경기 목록을 조회합니다.',
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved upcoming matches.' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    default: 1,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'league_id',
    required: false,
    type: String,
    description: 'Filter by specific league ID',
  })
  async getUpcomingMatches(
    @Query('page', { transform: (value) => Number(value || 1) }) page: number = 1,
    @Query('league_id') leagueId?: string,
  ) {
    let matches;
    
    if (leagueId) {
      matches = await this.betsApiService.getLeagueMatches(leagueId, 'upcoming', page);
    } else {
      matches = await this.betsApiService.getUpcomingMatches(page);
    }
    
    return MatchesResponse.ok(matches);
  }

  @Get('matches/inplay')
  @ApiOperation({
    summary: '진행 중인 축구 경기 목록 조회',
    description: 'BetsAPI v3를 통해 현재 진행 중인 축구 경기 목록을 조회합니다.',
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved inplay matches.' })
  @ApiQuery({
    name: 'league_id',
    required: false,
    type: String,
    description: 'Filter by specific league ID',
  })
  async getInplayMatches(@Query('league_id') leagueId?: string) {
    let matches;
    
    if (leagueId) {
      matches = await this.betsApiService.getLeagueMatches(leagueId, 'inplay');
    } else {
      matches = await this.betsApiService.getInplayMatches();
    }
    
    return MatchesResponse.ok(matches);
  }

  @Get('matches/ended')
  @ApiOperation({
    summary: '종료된 축구 경기 목록 조회',
    description: 'BetsAPI v3를 통해 종료된 축구 경기 목록을 조회합니다.',
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved ended matches.' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    default: 1,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'league_id',
    required: false,
    type: String,
    description: 'Filter by specific league ID',
  })
  @ApiQuery({
    name: 'day',
    required: false,
    type: String,
    description: 'Filter by specific day (YYYYMMDD format)',
  })
  async getEndedMatches(
    @Query('page', { transform: (value) => Number(value || 1) }) page: number = 1,
    @Query('league_id') leagueId?: string,
    @Query('day') day?: string,
  ) {
    let matches;
    
    if (leagueId) {
      matches = await this.betsApiService.getLeagueMatches(leagueId, 'ended', page);
    } else {
      matches = await this.betsApiService.getEndedMatches(page, day);
    }
    
    return MatchesResponse.ok(matches);
  }

  @Get('match/:eventId')
  @ApiOperation({
    summary: '축구 경기 상세 정보 조회',
    description: 'BetsAPI를 통해 특정 축구 경기의 상세 정보를 조회합니다.',
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved match details.' })
  async getMatchDetails(@Param('eventId') eventId: string) {
    const matchDetails = await this.betsApiService.getMatchDetails(eventId);
    return MatchesResponse.ok(matchDetails);
  }

  @Get('leagues')
  @ApiOperation({
    summary: '축구 리그 목록 조회',
    description: 'BetsAPI v1을 통해 축구 리그 목록을 조회합니다.',
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved leagues.' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    default: 1,
    description: 'Page number for pagination',
  })
  async getLeagues(
    @Query('page', { transform: (value) => Number(value || 1) }) page: number = 1,
  ) {
    const leagues = await this.betsApiService.getLeagues(page);
    return MatchesResponse.ok(leagues);
  }

  @Get('league/:leagueId/table')
  @ApiOperation({
    summary: '리그 순위표 조회',
    description: 'BetsAPI v3를 통해 특정 리그의 순위표를 조회합니다.',
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved league table.' })
  async getLeagueTable(@Param('leagueId') leagueId: string) {
    const leagueTable = await this.betsApiService.getLeagueTable(leagueId);
    return MatchesResponse.ok(leagueTable);
  }

  @Get('league/:leagueId/matches/:type')
  @ApiOperation({
    summary: '특정 리그의 경기 목록 조회',
    description: '특정 리그의 예정/진행중/종료된 경기 목록을 조회합니다.',
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved league matches.' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    default: 1,
    description: 'Page number for pagination',
  })
  async getLeagueMatches(
    @Param('leagueId') leagueId: string,
    @Param('type') type: 'upcoming' | 'inplay' | 'ended',
    @Query('page', { transform: (value) => Number(value || 1) }) page: number = 1,
  ) {
    const matches = await this.betsApiService.getLeagueMatches(leagueId, type, page);
    return MatchesResponse.ok(matches);
  }

  @Get('test')
  @ApiOperation({
    summary: 'BetsAPI 연결 테스트',
    description: 'BetsAPI 서비스가 정상적으로 작동하는지 테스트합니다.',
  })
  @ApiResponse({ status: 200, description: 'BetsAPI connection test successful.' })
  async testConnection() {
    try {
      const leagues = await this.betsApiService.getLeagues(1);
      return MatchesResponse.ok({
        status: 'success',
        message: 'BetsAPI connection successful',
        leagues_count: leagues.results?.length || 0
      });
    } catch (error) {
      return MatchesResponse.ok({
        status: 'error',
        message: 'BetsAPI connection failed',
        error: error.message
      });
    }
  }
}