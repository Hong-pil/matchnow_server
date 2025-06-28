const CONFIG = {
    // 현재 브라우저 주소를 기반으로 API URL 생성
    API_BASE: (() => {
        const protocol = window.location.protocol; // http: 또는 https:
        const hostname = window.location.hostname; // 175.126.95.157 또는 localhost
        const port = window.location.port; // 80 또는 빈 값
        
        console.log('🌐 현재 위치:', { protocol, hostname, port });
        
        // localhost 환경 (직접 NestJS 접속)
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return `${protocol}//${hostname}:4011/api/v1`;
        }
        
        // 외부 IP 환경 (Nginx 경유)
        return `${protocol}//${hostname}${port && port !== '80' && port !== '443' ? ':' + port : ''}/api/v1`;
    })(),
    
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

// 디버그용 로깅
console.log('🌐 최종 API Base URL:', CONFIG.API_BASE);
console.log('🔧 Axios 설정:', CONFIG.api.defaults);
