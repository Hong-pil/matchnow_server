// 경기 데이터 로드
const FootballSchedule = {
    // 현재 선택된 날짜 상태
    currentDate: new Date(),

    // 축구 경기 일정 HTML 템플릿
    template: `
        <div class="content-panel">
            <h2>⚽ 축구 경기 일정</h2>
            
            <!-- 날짜 선택 섹션 -->
            <div class="date-selector-section">
                <h3>📅 날짜 선택</h3>
                <div class="date-controls">
                    <button class="btn btn-info" id="prevDayBtn">◀ 어제</button>
                    <input type="date" id="datePicker" class="form-control date-picker">
                    <button class="btn btn-info" id="nextDayBtn">내일 ▶</button>
                    <button class="btn btn-primary" id="todayBtn">오늘</button>
                </div>
                <div class="selected-date-display">
                    <span id="selectedDateText">오늘 날짜</span>
                </div>
            </div>

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
        
        // 현재 날짜로 초기화
        this.currentDate = new Date();
        this.updateDateDisplay();
        
        // 이벤트 리스너 등록
        this.attachEventListeners();
        
        // 초기 데이터 로드
        await this.loadMatches();
    },

    // 이벤트 리스너 등록
    attachEventListeners() {
        // 기존 탭 이벤트
        document.getElementById('upcoming-tab').addEventListener('click', () => this.switchMatchType('upcoming'));
        document.getElementById('inplay-tab').addEventListener('click', () => this.switchMatchType('inplay'));
        document.getElementById('ended-tab').addEventListener('click', () => this.switchMatchType('ended'));
        document.getElementById('refreshMatchesBtn').addEventListener('click', () => this.loadMatches());
        document.getElementById('loadLeaguesBtn').addEventListener('click', () => this.loadLeagues());
        
        // 새로운 날짜 선택 이벤트
        document.getElementById('prevDayBtn').addEventListener('click', () => this.changeDate(-1));
        document.getElementById('nextDayBtn').addEventListener('click', () => this.changeDate(1));
        document.getElementById('todayBtn').addEventListener('click', () => this.setToday());
        document.getElementById('datePicker').addEventListener('change', (e) => this.setDateFromPicker(e.target.value));
    },

    // 날짜 변경 (+1일 또는 -1일)
    changeDate(days) {
        this.currentDate.setDate(this.currentDate.getDate() + days);
        this.updateDateDisplay();
        this.loadMatches();
    },

    // 오늘 날짜로 설정
    setToday() {
        this.currentDate = new Date();
        this.updateDateDisplay();
        this.loadMatches();
    },

    // 날짜 선택기에서 날짜 설정
    setDateFromPicker(dateString) {
        if (dateString) {
            this.currentDate = new Date(dateString + 'T00:00:00');
            this.updateDateDisplay();
            this.loadMatches();
        }
    },

    // 날짜 표시 업데이트
    updateDateDisplay() {
        const datePicker = document.getElementById('datePicker');
        const selectedDateText = document.getElementById('selectedDateText');
        
        if (datePicker && selectedDateText) {
            // 날짜 선택기에 현재 날짜 설정
            const dateString = this.currentDate.toISOString().split('T')[0];
            datePicker.value = dateString;
            
            // 선택된 날짜 텍스트 업데이트
            const today = new Date();
            const isToday = this.isSameDate(this.currentDate, today);
            
            if (isToday) {
                selectedDateText.textContent = `오늘 (${this.formatDateKorean(this.currentDate)})`;
            } else {
                const dayDiff = Math.floor((this.currentDate - today) / (1000 * 60 * 60 * 24));
                if (dayDiff === -1) {
                    selectedDateText.textContent = `어제 (${this.formatDateKorean(this.currentDate)})`;
                } else if (dayDiff === 1) {
                    selectedDateText.textContent = `내일 (${this.formatDateKorean(this.currentDate)})`;
                } else {
                    selectedDateText.textContent = this.formatDateKorean(this.currentDate);
                }
            }
        }
    },

    // 두 날짜가 같은 날인지 확인
    isSameDate(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    },

    // 한국어 날짜 포맷
    formatDateKorean(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        const dayName = dayNames[date.getDay()];
        
        return `${year}년 ${month}월 ${day}일 (${dayName})`;
    },

    // YYYYMMDD 형식으로 날짜 변환
    formatDateForAPI(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
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
        console.log(`📅 선택된 날짜: ${this.formatDateForAPI(this.currentDate)}`);
        
        const container = document.getElementById('matchesData');
        container.innerHTML = Utils.createLoadingHTML('축구 경기 데이터를 불러오는 중...');

        try {
            let endpoint = '';
            const dateParam = this.formatDateForAPI(this.currentDate);
            
            switch (CONFIG.state.currentMatchType) {
                case 'upcoming':
                    // 예정된 경기: 선택된 날짜의 경기만
                    endpoint = `/football/matches/upcoming?page=${CONFIG.state.currentPage}&day=${dateParam}`;
                    break;
                case 'inplay':
                    // 진행 중인 경기: 실시간이므로 날짜 필터링 없음 (현재 진행 중인 경기만)
                    endpoint = '/football/matches/inplay';
                    break;
                case 'ended':
                    // 종료된 경기: 선택된 날짜의 경기만
                    endpoint = `/football/matches/ended?page=${CONFIG.state.currentPage}&day=${dateParam}`;
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
                const dateText = this.isSameDate(this.currentDate, new Date()) ? '오늘' : this.formatDateKorean(this.currentDate);
                container.innerHTML = Utils.createEmptyStateHTML(`${dateText}에 ${this.getMatchTypeText(CONFIG.state.currentMatchType)} 경기가 없습니다.`);
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