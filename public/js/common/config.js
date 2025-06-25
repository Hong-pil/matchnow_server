// public/js/common/config.js

const CONFIG = {
    API_BASE: 'http://localhost/api/v1',
    TIMEOUT: 10000,
    
    // 전역 상태
    state: {
        countriesData: [],
        sportsData: [],
        currentMatchType: 'upcoming',
        currentPage: 1
    },
    
    // API 인스턴스
    api: null
};

// Axios 인스턴스 생성
CONFIG.api = axios.create({
    baseURL: CONFIG.API_BASE,
    timeout: CONFIG.TIMEOUT,
    headers: { 'Content-Type': 'application/json' }
});