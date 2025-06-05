import dotenv from 'dotenv'
import mongoose from 'mongoose'
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI

interface IMongoDBConnection {
  authenticate(): Promise<void>
  sync(): void
}

class MongoDB implements IMongoDBConnection {
  private connection: mongoose.Connection | null = null
  private isConnected: boolean = false

  async authenticate(): Promise<void> {
    if (this.isConnected) {
      return Promise.resolve()
    }

    try {
      await mongoose.connect(MONGODB_URI, {
        connectTimeoutMS: 30000,
        socketTimeoutMS: 30000,
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 30000,
      })
      this.connection = mongoose.connection
      this.isConnected = true
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
