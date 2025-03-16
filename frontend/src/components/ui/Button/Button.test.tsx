import theme from '@/theme/theme';
import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Button from './Button';

// テスト用のラッパー
const renderWithTheme = (ui: React.ReactNode) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('Button Component', () => {
  it('renders correctly with children', () => {
    renderWithTheme(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    renderWithTheme(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByRole('button', { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant and color props', () => {
    renderWithTheme(
      <Button variant="contained" color="primary">
        Primary Button
      </Button>
    );
    const button = screen.getByRole('button', { name: /primary button/i });
    expect(button).toHaveClass('MuiButton-containedPrimary');
  });
});