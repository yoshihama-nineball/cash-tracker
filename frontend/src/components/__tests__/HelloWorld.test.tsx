import React from 'react'; // Reactのインポート
import { render, screen } from '@testing-library/react';
import HelloWorld from '../HelloWorld';

test('renders the correct text', () => {
  render(<HelloWorld name="World" />);
  const linkElement = screen.getByText(/Hello, World!/i);
  expect(linkElement).toBeInTheDocument(); // jest-domのマッチャー
});

describe('テスト', () => {
  it('should correctly add two positive numbers', () => {
    console.log('結果テスト')
    expect(2 + 3).toBe(5);
  });
})