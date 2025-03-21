import { render, screen } from '@testing-library/react';
import HomePage from './page';

// MUIのテーマプロバイダーをモック
jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');
  return {
    ...actual,
    useTheme: () => ({
      palette: {
        primary: {
          main: '#1976d2',
          light: '#42a5f5'
        },
        secondary: {
          main: '#dc004e'
        }
      }
    })
  };
});

describe('HomePage', () => {
  it('ホームページが正しくレンダリングされること', () => {
    render(<HomePage />);
    
    // タイトルと説明文が表示されることを確認
    expect(screen.getByText('家計簿をもっとシンプルに')).toBeInTheDocument();
    expect(screen.getByText(/家計簿アプリで支出を管理し、賢く節約しましょう/)).toBeInTheDocument();
    expect(screen.getByText(/シンプルで使いやすいインターフェースと、詳細な分析機能であなたの家計をサポートします。/)).toBeInTheDocument();
    
    // ボタンが表示されることを確認
    expect(screen.getByText('今すぐ始める')).toBeInTheDocument();
    expect(screen.getByText('詳細を見る')).toBeInTheDocument();
    
    // フッターが表示されることを確認
    expect(screen.getByText('家計簿アプリ')).toBeInTheDocument();
    expect(screen.getByText('あなたの家計をシンプルに管理')).toBeInTheDocument();
    
    // 現在の年が著作権表示に含まれることを確認
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(`© ${currentYear} 家計簿アプリ`))).toBeInTheDocument();
  });

  // it('ログイン状態によってボタンの表示が切り替わること', () => {
  //   // useState のモックを作成して、isLoggedInの状態を操作できるようにする
  //   const useState = jest.spyOn(require('react'), 'useState');
    
  //   // 初期状態（ログインしていない）
  //   useState.mockImplementationOnce(() => [false, jest.fn()]);
  //   const { rerender } = render(<HomePage />);
  //   expect(screen.getByText('今すぐ始める')).toBeInTheDocument();
  //   expect(screen.getByText('詳細を見る')).toBeInTheDocument();
    
  //   // ログイン状態に変更
  //   useState.mockImplementationOnce(() => [true, jest.fn()]);
  //   rerender(<HomePage />);
    
  //   // ボタンが表示されなくなることを確認
  //   expect(screen.queryByText('今すぐ始める')).not.toBeInTheDocument();
  //   expect(screen.queryByText('詳細を見る')).not.toBeInTheDocument();
    
  //   // モックを元に戻す
  //   useState.mockRestore();
  // });

  // ダミーの予算データがレンダリングされるかのテストは、
  // 実際のコンポーネントで予算データを表示するコードが省略されているため、
  // ここでは実装していません。実装されたら追加する
});