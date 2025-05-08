// src/test-db.ts
import { db } from './db';

async function testConnection() {
  try {
    const [rows] = await db.query('SELECT 1');
    console.log(' Success conncet to database..', rows);
  } catch (error) {
    console.error(' Error conncet to database..', error);
  }
}

testConnection();