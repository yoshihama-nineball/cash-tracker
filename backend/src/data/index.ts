import { exit } from 'node:process'
import { db } from '../config/db'

const clearData = async () => {
  try {
    //MEMO: DB内のすべてのテーブルを再作成する
    await db.sync()
    console.log('DBをクリアしました')
    //MEMO: 正常終了
    exit(0)
  } catch (error) {
    console.log(error, 'DBのクリアに失敗しました')
    //MEMO: 異常終了
    exit(1)
  }
}

if (process.argv[2] === '--clear') {
  clearData()
}

//MEMO: package.json
// "pretest": "ts-node ./src/data --clear"
