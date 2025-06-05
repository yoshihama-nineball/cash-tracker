import dotenv from 'dotenv'
import mongoose from 'mongoose'
dotenv.config()

// MongoDB接続URI
const MONGODB_URI = process.env.MONGODB_URI

// MongoDBインターフェースを定義
interface IMongoDBConnection {
  authenticate(): Promise<void>
  sync(): void
}

// MongoDBクラスを定義
class MongoDB implements IMongoDBConnection {
  private connection: mongoose.Connection | null = null

  async authenticate(): Promise<void> {
    try {
      // 接続オプションを修正（存在するオプションのみ使用）
      await mongoose.connect(MONGODB_URI, {
        connectTimeoutMS: 30000,
        socketTimeoutMS: 30000,
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 30000,
        bufferCommands: false, // これだけ残す
      })
      this.connection = mongoose.connection
      console.log('✅ MongoDB接続成功')
      return Promise.resolve()
    } catch (error) {
      console.error('❌ MongoDB接続エラー:', error)
      return Promise.reject(error)
    }
  }

  sync(): void {
    return
  }

  getConnection(): mongoose.Connection | null {
    return this.connection
  }
}

export const db = new MongoDB()
