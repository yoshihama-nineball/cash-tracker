import dotenv from 'dotenv'
import mongoose from 'mongoose'
dotenv.config()

// MongoDB接続URI
const MONGODB_URI = process.env.MONGO_URI

// MongoDBインターフェースを定義
interface IMongoDBConnection {
  authenticate(): Promise<void>
  sync(): void
}

// MongoDBクラスを定義（Sequelizeと同様のインターフェースを提供）
class MongoDB implements IMongoDBConnection {
  private connection: mongoose.Connection | null = null

  // Sequelizeのauthenticateメソッドと同様のメソッドを実装
  async authenticate(): Promise<void> {
    try {
      await mongoose.connect(MONGODB_URI)
      this.connection = mongoose.connection
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // Sequelizeのsyncメソッドと同様のメソッド（MongoDB用に空実装）
  sync(): void {
    // MongoDBではテーブル同期が不要なので何もしない
    return
  }

  // 現在の接続を返す
  getConnection(): mongoose.Connection | null {
    return this.connection
  }
}

// DBインスタンスを作成してエクスポート
export const db = new MongoDB()
