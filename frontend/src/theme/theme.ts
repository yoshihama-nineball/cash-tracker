import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#8e8bd9", // 薄紫をメインカラーに
      light: "#b5b3e6", // より明るい紫
      dark: "#6e6bb0", // より暗い紫
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#6bc5d7", // 水色を二次カラーに
      light: "#9ad8e4", // ライトな水色
      dark: "#4a9eac", // ダークな水色
      contrastText: "#ffffff",
    },
    background: {
      default: "#f5f5fb", // 薄紫がかった背景色
      paper: "#ffffff",
    },
    neutral: {
      main: "#9e9e9e",
      light: "#cfcfcf",
      dark: "#707070",
      contrastText: "#ffffff",
    },
    text: {
      primary: "#3b3a56", // 紫に合うダークテキスト
      secondary: "#6f6e89", // 紫に合う薄めのテキスト
    },
    // グラデーション用のカスタムカラー
    customGradient: {
      start: "#e9e8fb", // 薄い紫（グラデーション開始色）
      middle: "#d1dffa", // 紫から水色への中間色
      end: "#b6e3ea", // 水色（グラデーション終了色）
    },
  },
  // グローバルなCSSの上書き
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          background: linear-gradient(135deg, #e9e8fb 0%, #d1dffa 50%, #b6e3ea 100%);
          background-attachment: fixed;
        }
        
        .gradient-card {
          background: linear-gradient(135deg, #f5f5fb 0%, #e9e8fb 100%);
          border-radius: 16px;
        }
        
        .circle-button {
          background: white;
          border-radius: 50%;
          padding: 16px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }
        
        .circle-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.12);
        }
      `,
    },
    // 黒いボタンのスタイル定義
    MuiButton: {
      styleOverrides: {
        root: {
          "&.MuiButton-black": {
            backgroundColor: "#000000",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#333333",
            },
          },
        },
      },
      variants: [
        {
          props: { variant: "black" },
          style: {
            backgroundColor: "#000000",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#333333",
            },
          },
        },
      ],
    },
  },
  shape: {
    borderRadius: 12, // 全体的に少し丸みを持たせる
  },
  typography: {
    fontFamily:
      '"Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
    },
  },
});

// TypeScriptの型定義を拡張
declare module "@mui/material/styles" {
  interface Palette {
    customGradient: {
      start: string;
      middle: string;
      end: string;
    };
  }

  interface PaletteOptions {
    customGradient?: {
      start: string;
      middle: string;
      end: string;
    };
    neutral?: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    black: true;
  }

  interface ButtonPropsColorOverrides {
    neutral: true;
  }
}

export default theme;
