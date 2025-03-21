import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ConfirmAccountPage from './page';

// Mock the ConfirmAccountForm component
jest.mock('../../../components/auth/ConfirmAccount', () => {
  return function MockConfirmAccountForm() {
    return <div data-testid="confirm-account">アカウント確認フォーム</div>;
  };
});

describe('ConfirmAccountPage', () => {
  beforeEach(() => {
    render(<ConfirmAccountPage />);
  });

  test('レンダリングされたページにはタイトルが表示されている', () => {
    const heading = screen.getByRole('heading', { level: 4, name: 'アカウント認証' });
    expect(heading).toBeInTheDocument();
  });

  test('サブタイトルが正しく表示されている', () => {
    const subheading = screen.getByRole('heading', { level: 5 });
    expect(subheading).toHaveTextContent('メールで受け取った 認証コードを入力してください');
  });

  test('認証コードの部分が強調表示されている', () => {
    const highlightedText = screen.getByText('認証コード');
    expect(highlightedText).toHaveStyle('color: rgb(156, 39, 176)');
  });

  test('ConfirmAccountFormコンポーネントがレンダリングされている', () => {
    const formComponent = screen.getByTestId('confirm-account');
    expect(formComponent).toBeInTheDocument();
  });

  test('コンテナが最大幅mdでレンダリングされている', () => {
    // Container propsのテスト
    const container = document.querySelector('.MuiContainer-root');
    expect(container).toHaveClass('MuiContainer-maxWidthMd');
  });
});