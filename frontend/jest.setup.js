const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// jest.setup.js
// グローバルモックの設定
global.Request = class Request {};
global.Response = class Response {};
global.Headers = class Headers {};

// next/cache モジュールのモック
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
  unstable_cache: jest.fn(),
}));

// next/navigation モジュールのモック（必要に応じて）
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
    getAll: jest.fn(),
    has: jest.fn(),
    forEach: jest.fn(),
    entries: jest.fn(),
    keys: jest.fn(),
    values: jest.fn(),
  })),
  usePathname: jest.fn(() => "/"),
}));

require("@testing-library/jest-dom");
