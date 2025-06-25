// src/modules/betsapi/services/betsapi.service.ts
import { Injectable, Logger } from '@nestjs/common';

export interface BetsApiFixture {
  id: string;
  sport_id: string;
  time: string;
  time_status: string;
  league: {
    id: string;
    name: string;
  };
  home: {
    id: string;
    name: string;
    image_id?: string;
  };
  away: {
    id: string;
    name: string;
    image_id?: string;
  };
  ss?: string; // score
  timer?: {
    tm: string; // time minute
    ts: string; // time second
  };
  stats?: any;
}

export interface BetsApiResponse {
  success: number;
  pager?: {
    page: number;
    per_page: number;
    total: number;
  };
  results: BetsApiFixture[];
}

export interface BetsApiLeague {
  id: string;
  name: string;
  cc?: string; // country code
  has_leaguetable?: string;
  has_toplist?: string;
}

export interface BetsApiLeagueResponse {
  success: number;
  pager?: {
    page: number;
    per_page: number;
    total: number;
  };
  results: BetsApiLeague[];
}

@Injectable()
export class BetsApiService {
  private readonly logger = new Logger(BetsApiService.name);
  private readonly baseUrl = 'https://api.b365api.com';
  private readonly token = '224394-KF2Q7zYNxcNdiH';

  /**
   * 예정된 축구 경기 목록 조회 (v3 API)
   */
  async getUpcomingMatches(page: number = 1): Promise<BetsApiResponse> {
    try {
      const url = `${this.baseUrl}/v3/events/upcoming?sport_id=1&token=${this.token}&page=${page}`;
      
      this.logger.log(`Fetching upcoming matches from: ${url}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: BetsApiResponse = await response.json();
      
      this.logger.log(`Fetched ${data.results?.length || 0} upcoming matches`);
      
      return data;
    } catch (error) {
      this.logger.error('Error fetching upcoming matches:', error);
      throw new Error(`Failed to fetch upcoming matches: ${error.message}`);
    }
  }

  /**
   * 진행 중인 축구 경기 목록 조회 (v3 API)
   */
  async getInplayMatches(): Promise<BetsApiResponse> {
    try {
      const url = `${this.baseUrl}/v3/events/inplay?sport_id=1&token=${this.token}`;
      
      this.logger.log(`Fetching inplay matches from: ${url}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: BetsApiResponse = await response.json();
      
      this.logger.log(`Fetched ${data.results?.length || 0} inplay matches`);
      
      return data;
    } catch (error) {
      this.logger.error('Error fetching inplay matches:', error);
      throw new Error(`Failed to fetch inplay matches: ${error.message}`);
    }
  }

  /**
   * 종료된 축구 경기 목록 조회 (v3 API)
   */
  async getEndedMatches(page: number = 1, day?: string): Promise<BetsApiResponse> {
    try {
      let url = `${this.baseUrl}/v3/events/ended?sport_id=1&token=${this.token}&page=${page}`;
      
      // day 파라미터가 있으면 추가 (YYYYMMDD 형식)
      if (day) {
        url += `&day=${day}`;
      }
      
      this.logger.log(`Fetching ended matches from: ${url}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: BetsApiResponse = await response.json();
      
      this.logger.log(`Fetched ${data.results?.length || 0} ended matches`);
      
      return data;
    } catch (error) {
      this.logger.error('Error fetching ended matches:', error);
      throw new Error(`Failed to fetch ended matches: ${error.message}`);
    }
  }

  /**
   * 특정 경기 상세 정보 조회
   */
  async getMatchDetails(eventId: string): Promise<any> {
    try {
      const url = `${this.baseUrl}/v1/event/view?token=${this.token}&event_id=${eventId}`;
      
      this.logger.log(`Fetching match details for event: ${eventId}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      this.logger.log(`Fetched match details for event: ${eventId}`);
      
      return data;
    } catch (error) {
      this.logger.error(`Error fetching match details for event ${eventId}:`, error);
      throw new Error(`Failed to fetch match details: ${error.message}`);
    }
  }

  /**
   * 리그 목록 조회 (v1 API)
   */
  async getLeagues(page: number = 1): Promise<BetsApiLeagueResponse> {
    try {
      const url = `${this.baseUrl}/v1/league?sport_id=1&token=${this.token}&page=${page}`;
      
      this.logger.log(`Fetching leagues from: ${url}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: BetsApiLeagueResponse = await response.json();
      
      this.logger.log(`Fetched ${data.results?.length || 0} leagues`);
      
      return data;
    } catch (error) {
      this.logger.error('Error fetching leagues:', error);
      throw new Error(`Failed to fetch leagues: ${error.message}`);
    }
  }

  /**
   * 리그 테이블 조회 (v3 API)
   */
  async getLeagueTable(leagueId: string): Promise<any> {
    try {
      const url = `${this.baseUrl}/v3/league/table?token=${this.token}&league_id=${leagueId}`;
      
      this.logger.log(`Fetching league table for league: ${leagueId}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      this.logger.log(`Fetched league table for league: ${leagueId}`);
      
      return data;
    } catch (error) {
      this.logger.error(`Error fetching league table for league ${leagueId}:`, error);
      throw new Error(`Failed to fetch league table: ${error.message}`);
    }
  }

  /**
   * 특정 리그의 경기만 조회
   */
  async getLeagueMatches(leagueId: string, type: 'upcoming' | 'inplay' | 'ended' = 'upcoming', page: number = 1): Promise<BetsApiResponse> {
    try {
      let url = '';
      
      switch (type) {
        case 'upcoming':
          url = `${this.baseUrl}/v3/events/upcoming?sport_id=1&league_id=${leagueId}&token=${this.token}&page=${page}`;
          break;
        case 'inplay':
          url = `${this.baseUrl}/v3/events/inplay?sport_id=1&league_id=${leagueId}&token=${this.token}`;
          break;
        case 'ended':
          url = `${this.baseUrl}/v3/events/ended?sport_id=1&league_id=${leagueId}&token=${this.token}&page=${page}`;
          break;
      }
      
      this.logger.log(`Fetching ${type} matches for league ${leagueId} from: ${url}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: BetsApiResponse = await response.json();
      
      this.logger.log(`Fetched ${data.results?.length || 0} ${type} matches for league ${leagueId}`);
      
      return data;
    } catch (error) {
      this.logger.error(`Error fetching ${type} matches for league ${leagueId}:`, error);
      throw new Error(`Failed to fetch ${type} matches for league: ${error.message}`);
    }
  }
}