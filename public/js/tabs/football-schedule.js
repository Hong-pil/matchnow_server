// 경기 데이터 로드
const FootballSchedule = {
    // 축구 경기 일정 HTML 템플릿
    template: `
        <div class="content-panel">
            <h2>⚽ 축구 경기 일정</h2>
            
            <div class="match-tabs">
                <button class="match-tab active" id="upcoming-tab">예정된 경기</button>
                <button class="match-tab" id="inplay-tab">진행 중인 경기</button>
                <button class="match-tab" id="ended-tab">종료된 경기</button>
            </div>

            <div class="controls">
                <button class="btn btn-primary" id="refreshMatchesBtn">🔄 새로고침</button>
                <button class="btn btn-info" id="loadLeaguesBtn">🏆 리그 목록 보기</button>
            </div>

            <div id="matchesData" class="data-list"></div>
            
            <div id="matchesPagination" class="pagination" style="display: none;"></div>
        </div>
    `,

    // 렌더링
    async render() {
        console.log('⚽ 축구 경기 일정 로드');
        
        // 템플릿 렌더링
        Utils.renderContent(this.template);
        
        // 이벤트 리스너 등록
        this.attachEventListeners();
        
        // 초기 데이터 로드
        await this.loadMatches();
    },

    // 이벤트 리스너 등록
    attachEventListeners() {
        document.getElementById('upcoming-tab').addEventListener('click', () => this.switchMatchType('upcoming'));
        document.getElementById('inplay-tab').addEventListener('click', () => this.switchMatchType('inplay'));
        document.getElementById('ended-tab').addEventListener('click', () => this.switchMatchType('ended'));
        document.getElementById('refreshMatchesBtn').addEventListener('click', () => this.loadMatches());
        document.getElementById('loadLeaguesBtn').addEventListener('click', () => this.loadLeagues());
    },

    // 경기 타입 전환
    switchMatchType(type) {
        CONFIG.state.currentMatchType = type;
        CONFIG.state.currentPage = 1;
        
        // 탭 스타일 업데이트
        document.querySelectorAll('.match-tab').forEach(tab => tab.classList.remove('active'));
        document.getElementById(type + '-tab').classList.add('active');
        
        this.loadMatches();
    },

    // 경기 데이터 로드
    async loadMatches() {
        console.log(`⚽ ${CONFIG.state.currentMatchType} 경기 로드 (페이지 ${CONFIG.state.currentPage})`);
        const container = document.getElementById('matchesData');
        container.innerHTML = Utils.createLoadingHTML('축구 경기 데이터를 불러오는 중...');

        try {
            let endpoint = '';
            switch (CONFIG.state.currentMatchType) {
                case 'upcoming':
                    endpoint = `/football/matches/upcoming?page=${CONFIG.state.currentPage}`;
                    break;
                case 'inplay':
                    endpoint = '/football/matches/inplay';
                    break;
                case 'ended':
                    endpoint = `/football/matches/ended?page=${CONFIG.state.currentPage}`;
                    break;
            }

            const response = await CONFIG.api.get(endpoint);
            const data = response.data.data;
            
            if (!data.results || data.results.length === 0) {
                container.innerHTML = Utils.createEmptyStateHTML(`현재 ${this.getMatchTypeText(CONFIG.state.currentMatchType)} 경기가 없습니다.`);
                document.getElementById('matchesPagination').style.display = 'none';
                return;
            }

            // 경기 카드들 렌더링
            container.innerHTML = data.results.map(match => this.createMatchCard(match)).join('');
            
            // 페이지네이션 업데이트 (upcoming, ended만)
            if (CONFIG.state.currentMatchType !== 'inplay' && data.pager) {
                this.updatePagination(data.pager);
            } else {
                document.getElementById('matchesPagination').style.display = 'none';
            }

        } catch (error) {
            console.error('축구 경기 로드 실패:', error);
            container.innerHTML = '<div class="error">축구 경기 데이터 로드에 실패했습니다.</div>';
        }
    },

    // 경기 카드 생성
    createMatchCard(match) {
        const matchTime = Utils.formatMatchTime(match.time);

        let statusClass = 'status-upcoming';
        let statusText = '예정';
        
        if (match.time_status === '1') {
            statusClass = 'status-inplay';
            statusText = '진행중';
        } else if (match.time_status === '3') {
            statusClass = 'status-ended';
            statusText = '종료';
        }

        const score = match.ss ? match.ss.split('-') : ['', ''];
        const homeScore = score[0] || '';
        const awayScore = score[1] || '';

        return `
            <div class="match-card">
                <div class="match-header">
                    <div class="match-league">${match.league?.name || '알 수 없는 리그'}</div>
                    <div class="match-time">${matchTime}</div>
                </div>
                
                <div class="match-teams">
                    <div class="team">
                        <div class="team-name">${match.home?.name || '홈팀'}</div>
                    </div>
                    
                    <div class="vs">
                        ${match.ss ? 
                            `<div class="score">${homeScore} - ${awayScore}</div>` : 
                            'VS'
                        }
                    </div>
                    
                    <div class="team">
                        <div class="team-name">${match.away?.name || '원정팀'}</div>
                    </div>
                </div>
                
                <div class="match-status">
                    <span class="match-status ${statusClass}">${statusText}</span>
                    ${match.timer?.tm ? `<span style="margin-left: 10px;">⏱️ ${match.timer.tm}'</span>` : ''}
                </div>
                
                <div style="margin-top: 15px;">
                    <button class="btn btn-info" onclick="FootballSchedule.viewMatchDetails('${match.id}')">상세 보기</button>
                </div>
            </div>
        `;
    },

    // 경기 타입 텍스트 반환
    getMatchTypeText(type) {
        switch (type) {
            case 'upcoming': return '예정된';
            case 'inplay': return '진행 중인';
            case 'ended': return '종료된';
            default: return '';
        }
    },

    // 페이지네이션 업데이트
    updatePagination(pager) {
        const container = document.getElementById('matchesPagination');
        const totalPages = Math.ceil(pager.total / pager.per_page);
        
        if (totalPages <= 1) {
            container.style.display = 'none';
            return;
        }
        
        container.style.display = 'flex';
        
        let paginationHTML = '';
        
        // 이전 페이지
        if (CONFIG.state.currentPage > 1) {
            paginationHTML += `<button onclick="FootballSchedule.changePage(${CONFIG.state.currentPage - 1})">이전</button>`;
        }
        
        // 페이지 번호들
        const startPage = Math.max(1, CONFIG.state.currentPage - 2);
        const endPage = Math.min(totalPages, CONFIG.state.currentPage + 2);
        
        for (let i = startPage; i <= endPage; i++) {
            const activeClass = i === CONFIG.state.currentPage ? 'active' : '';
            paginationHTML += `<button class="${activeClass}" onclick="FootballSchedule.changePage(${i})">${i}</button>`;
        }
        
        // 다음 페이지
        if (CONFIG.state.currentPage < totalPages) {
            paginationHTML += `<button onclick="FootballSchedule.changePage(${CONFIG.state.currentPage + 1})">다음</button>`;
        }
        
        container.innerHTML = paginationHTML;
    },

    // 페이지 변경
    changePage(page) {
        CONFIG.state.currentPage = page;
        this.loadMatches();
    },

    async loadMatches() {
        console.log(`⚽ ${CONFIG.state.currentMatchType} 경기 로드 (페이지 ${CONFIG.state.currentPage})`);
        const container = document.getElementById('matchesData');
        container.innerHTML = Utils.createLoadingHTML('축구 경기 데이터를 불러오는 중...');

        try {
            let endpoint = '';
            switch (CONFIG.state.currentMatchType) {
                case 'upcoming':
                    endpoint = `/football/matches/upcoming?page=${CONFIG.state.currentPage}`;
                    break;
                case 'inplay':
                    endpoint = '/football/matches/inplay';
                    break;
                case 'ended':
                    endpoint = `/football/matches/ended?page=${CONFIG.state.currentPage}`;
                    break;
            }

            console.log('🌐 API 요청:', CONFIG.API_BASE + endpoint);
            const response = await CONFIG.api.get(endpoint);
            console.log('📦 API 응답:', response.data);
            
            const data = response.data.data;
            
            if (!data) {
                console.error('❌ API 응답에 data 필드가 없음:', response.data);
                container.innerHTML = '<div class="error">API 응답 형식이 올바르지 않습니다.</div>';
                return;
            }
            
            if (!data.results || data.results.length === 0) {
                container.innerHTML = Utils.createEmptyStateHTML(`현재 ${this.getMatchTypeText(CONFIG.state.currentMatchType)} 경기가 없습니다.`);
                document.getElementById('matchesPagination').style.display = 'none';
                return;
            }

            console.log(`✅ ${data.results.length}개의 경기를 찾았습니다.`);

            // 경기 카드들 렌더링
            container.innerHTML = data.results.map(match => this.createMatchCard(match)).join('');
            
            // 페이지네이션 업데이트 (upcoming, ended만)
            if (CONFIG.state.currentMatchType !== 'inplay' && data.pager) {
                this.updatePagination(data.pager);
            } else {
                document.getElementById('matchesPagination').style.display = 'none';
            }

        } catch (error) {
            console.error('❌ 축구 경기 로드 실패:', error);
            console.error('에러 상세:', error.response?.data || error.message);
            
            let errorMessage = '축구 경기 데이터 로드에 실패했습니다.';
            if (error.response?.status === 404) {
                errorMessage = 'BetsAPI 서비스를 찾을 수 없습니다. 백엔드 서버를 확인해주세요.';
            } else if (error.response?.status === 500) {
                errorMessage = 'BetsAPI 토큰 또는 서버 오류입니다.';
            }
            
            container.innerHTML = `<div class="error">${errorMessage}<br><small>콘솔을 확인하여 자세한 오류를 확인하세요.</small></div>`;
        }
    },

    // 경기 상세 정보 보기
    async viewMatchDetails(eventId) {
        try {
            const response = await CONFIG.api.get(`/football/match/${eventId}`);
            const match = response.data.data;
            
            // 상세 정보를 모달이나 알림으로 표시
            alert(`경기 상세 정보:\n\n${JSON.stringify(match, null, 2)}`);
        } catch (error) {
            Utils.showError('경기 상세 정보를 불러올 수 없습니다.');
        }
    },

    // 리그 목록 로드
    async loadLeagues() {
        try {
            const response = await CONFIG.api.get('/football/leagues');
            const leagues = response.data.data.results || [];
            
            const container = document.getElementById('matchesData');
            container.innerHTML = leagues.map(league => `
                <div class="data-card">
                    <h3>🏆 ${league.name}</h3>
                    <p><strong>ID:</strong> ${league.id}</p>
                    <p><strong>국가:</strong> ${league.cc || 'N/A'}</p>
                </div>
            `).join('');
            
            Utils.showSuccess(`${leagues.length}개의 리그를 불러왔습니다.`);
        } catch (error) {
            Utils.showError('리그 목록을 불러올 수 없습니다.');
        }
    }
};

