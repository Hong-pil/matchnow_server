const { MongoClient } = require('mongodb');

// 로컬 MongoDB 연결 설정
const uri = 'mongodb://admin:matchnow0618!!!@localhost:27017/matchnow_dev?authSource=admin';
const dbName = 'matchnow_dev';

async function seed() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ 로컬 MongoDB에 연결되었습니다.');
    
    const db = client.db(dbName);
    
    console.log('🔄 데이터베이스 초기화 중...');
    
    // 기존 컬렉션 삭제 (선택사항)
    try {
      await db.collection('countries').drop();
      await db.collection('sports-categories').drop();
      console.log('🗑️  기존 컬렉션이 삭제되었습니다.');
    } catch (error) {
      console.log('ℹ️  기존 컬렉션이 없거나 삭제할 수 없습니다.');
    }
    
    // 인덱스 생성
    console.log('📊 인덱스 생성 중...');
    await db.collection('countries').createIndex({ "name": 1 }, { unique: true });
    await db.collection('sports-categories').createIndex({ "name": 1 }, { unique: true });
    await db.collection('leagues').createIndex({ "name": 1, "countryId": 1 });
    await db.collection('teams').createIndex({ "name": 1, "countryId": 1 });
    await db.collection('players').createIndex({ "name": 1 });
    await db.collection('games').createIndex({ "sportsCategoryId": 1, "leagueId": 1 });
    await db.collection('league-seasons').createIndex({ "leagueId": 1, "season": 1 });
    
    console.log('✅ 인덱스가 생성되었습니다.');
    
    // 샘플 데이터 삽입
    console.log('📝 샘플 데이터 삽입 중...');
    const countries = await db.collection('countries').insertMany([
      { name: '대한민국', createdAt: new Date(), updatedAt: new Date() },
      { name: '일본', createdAt: new Date(), updatedAt: new Date() },
      { name: '영국', createdAt: new Date(), updatedAt: new Date() },
      { name: '독일', createdAt: new Date(), updatedAt: new Date() },
      { name: '스페인', createdAt: new Date(), updatedAt: new Date() },
      { name: '프랑스', createdAt: new Date(), updatedAt: new Date() },
      { name: '이탈리아', createdAt: new Date(), updatedAt: new Date() },
      { name: '브라질', createdAt: new Date(), updatedAt: new Date() },
      { name: '아르헨티나', createdAt: new Date(), updatedAt: new Date() },
      { name: '네덜란드', createdAt: new Date(), updatedAt: new Date() }
    ]);
    
    const sportsCategories = await db.collection('sports-categories').insertMany([
      { name: '축구', nameEn: 'football', createdAt: new Date(), updatedAt: new Date() },
      { name: '야구', nameEn: 'baseball', createdAt: new Date(), updatedAt: new Date() },
      { name: '농구', nameEn: 'basketball', createdAt: new Date(), updatedAt: new Date() },
      { name: '배구', nameEn: 'volleyball', createdAt: new Date(), updatedAt: new Date() },
      { name: '테니스', nameEn: 'tennis', createdAt: new Date(), updatedAt: new Date() },
      { name: '골프', nameEn: 'golf', createdAt: new Date(), updatedAt: new Date() }
    ]);
    
    console.log('✅ 샘플 데이터가 삽입되었습니다.');
    console.log(`📊 Countries: ${countries.insertedCount}개`);
    console.log(`📊 Sports Categories: ${sportsCategories.insertedCount}개`);
    
    console.log('\n=== 🔍 삽입된 데이터 확인 ===');
    const insertedCountries = await db.collection('countries').find({}).toArray();
    const insertedSportsCategories = await db.collection('sports-categories').find({}).toArray();
    
    console.log('\n🌍 국가 목록:');
    insertedCountries.forEach(country => console.log(`  - ${country.name} (ID: ${country._id})`));
    
    console.log('\n🏃 스포츠 카테고리 목록:');
    insertedSportsCategories.forEach(category => console.log(`  - ${category.name} (${category.nameEn}) (ID: ${category._id})`));
    
    // 데이터베이스 상태 확인
    const stats = await db.stats();
    console.log('\n📈 데이터베이스 통계:');
    console.log(`  - 데이터베이스명: ${stats.db}`);
    console.log(`  - 컬렉션 수: ${stats.collections}`);
    console.log(`  - 인덱스 수: ${stats.indexes}`);
    console.log(`  - 전체 크기: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    
  } catch (error) {
    console.error('❌ 에러 발생:', error);
  } finally {
    await client.close();
    console.log('\n✅ MongoDB 연결이 종료되었습니다.');
    console.log('\n🎉 시드 작업이 완료되었습니다!');
    console.log('\n다음 명령어로 연결 테스트를 할 수 있습니다:');
    console.log('npm run db:connect');
  }
}

// 스크립트 실행 체크
if (require.main === module) {
  seed();
}

module.exports = seed;