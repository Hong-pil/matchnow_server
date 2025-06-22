const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'match-now-dev';

async function seed() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('MongoDB에 연결되었습니다.');
    
    const db = client.db(dbName);
    
    console.log('데이터베이스 초기화 중...');
    
    // 기존 컬렉션 삭제 (선택사항)
    try {
      await db.collection('countries').drop();
      await db.collection('sports-categories').drop();
      console.log('기존 컬렉션이 삭제되었습니다.');
    } catch (error) {
      console.log('기존 컬렉션이 없거나 삭제할 수 없습니다.');
    }
    
    // 인덱스 생성
    await db.collection('countries').createIndex({ "name": 1 }, { unique: true });
    await db.collection('sports-categories').createIndex({ "name": 1 }, { unique: true });
    await db.collection('leagues').createIndex({ "name": 1, "countryId": 1 });
    await db.collection('teams').createIndex({ "name": 1, "countryId": 1 });
    await db.collection('players').createIndex({ "name": 1 });
    await db.collection('games').createIndex({ "sportsCategoryId": 1, "leagueId": 1 });
    await db.collection('league-seasons').createIndex({ "leagueId": 1, "season": 1 });
    
    console.log('인덱스가 생성되었습니다.');
    
    // 샘플 데이터 삽입
    const countries = await db.collection('countries').insertMany([
      { name: '대한민국', createdAt: new Date(), updatedAt: new Date() },
      { name: '일본', createdAt: new Date(), updatedAt: new Date() },
      { name: '영국', createdAt: new Date(), updatedAt: new Date() },
      { name: '독일', createdAt: new Date(), updatedAt: new Date() },
      { name: '스페인', createdAt: new Date(), updatedAt: new Date() },
      { name: '프랑스', createdAt: new Date(), updatedAt: new Date() },
      { name: '이탈리아', createdAt: new Date(), updatedAt: new Date() }
    ]);
    
    const sportsCategories = await db.collection('sports-categories').insertMany([
      { name: '축구', nameEn: 'football', createdAt: new Date(), updatedAt: new Date() },
      { name: '야구', nameEn: 'baseball', createdAt: new Date(), updatedAt: new Date() },
      { name: '농구', nameEn: 'basketball', createdAt: new Date(), updatedAt: new Date() },
      { name: '배구', nameEn: 'volleyball', createdAt: new Date(), updatedAt: new Date() }
    ]);
    
    console.log('샘플 데이터가 삽입되었습니다.');
    console.log(`Countries: ${countries.insertedCount}개`);
    console.log(`Sports Categories: ${sportsCategories.insertedCount}개`);
    
    console.log('\n=== 삽입된 데이터 확인 ===');
    const insertedCountries = await db.collection('countries').find({}).toArray();
    const insertedSportsCategories = await db.collection('sports-categories').find({}).toArray();
    
    console.log('\n국가 목록:');
    insertedCountries.forEach(country => console.log(`- ${country.name} (ID: ${country._id})`));
    
    console.log('\n스포츠 카테고리 목록:');
    insertedSportsCategories.forEach(category => console.log(`- ${category.name} (${category.nameEn}) (ID: ${category._id})`));
    
  } catch (error) {
    console.error('에러 발생:', error);
  } finally {
    await client.close();
    console.log('\nMongoDB 연결이 종료되었습니다.');
  }
}

seed();