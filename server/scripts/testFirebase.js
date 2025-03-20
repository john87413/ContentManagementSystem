const admin = require('../config/firebase');

async function testBucket() {
  try {
    const bucket = admin.storage().bucket();
    console.log('Bucket name:', bucket.name);
    
    // 檢查桶是否存在
    const [exists] = await bucket.exists();
    console.log('Bucket exists:', exists);
    
    if (exists) {
      console.log('Successfully connected to the bucket!');
    } else {
      console.log('The bucket does not exist. Please check your Firebase Storage setup.');
    }
  } catch (error) {
    console.error('Error testing bucket:', error);
  }
}

testBucket();