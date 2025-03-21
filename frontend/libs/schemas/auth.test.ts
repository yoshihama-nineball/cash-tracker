//memo: バリデーションのテストコード
// import { loginSchema } from "../../../libs/schemas/auth";

// describe('ログイン用Zodスキーマのバリデーションテスト', () => {
//   it('有効なメールアドレスとパスワードを受け入れること', () => {
//     const validData = {
//       email: 'test@example.com',
//       password: 'Password123'
//     };

//     const result = loginSchema.safeParse(validData);
//     expect(result.success).toBe(true);
//   });

//   it('無効なメールアドレスでエラーを返すこと', () => {
//     const invalidData = {
//       email: 'invalid-email',
//       password: 'Password123'
//     };

//     const result = loginSchema.safeParse(invalidData);
//     expect(result.success).toBe(false);

//     if (!result.success) {
//       const errorMap = result.error.flatten().fieldErrors;
//       expect(errorMap.email).toBeDefined();
//       expect(errorMap.email?.[0]).toContain('有効なメールアドレス');
//     }
//   });

//   it('短すぎるパスワードでエラーを返すこと', () => {
//     const invalidData = {
//       email: 'test@example.com',
//       password: 'short'
//     };

//     const result = loginSchema.safeParse(invalidData);
//     expect(result.success).toBe(false);

//     if (!result.success) {
//       const errorMap = result.error.flatten().fieldErrors;
//       expect(errorMap.password).toBeDefined();
//       expect(errorMap.password?.[0]).toContain('文字以上');
//     }
//   });

//   it('必須フィールドが欠けている場合にエラーを返すこと', () => {
//     const missingData = {
//       email: ''
//     };

//     const result = loginSchema.safeParse(missingData);
//     expect(result.success).toBe(false);

//     if (!result.success) {
//       const errorMap = result.error.flatten().fieldErrors;
//       expect(errorMap.email).toBeDefined();
//       expect(errorMap.password).toBeDefined();
//     }
//   });
// });

import {
  confirmAccountSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
} from "./auth";

describe("registerSchema", () => {
  it("有効なデータが正しく検証されること", () => {
    const validData = {
      email: "test@example.com",
      name: "テストユーザー",
      password: "Password123",
      password_confirmation: "Password123",
    };

    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("無効なメールアドレスがエラーになること", () => {
    const invalidData = {
      email: "invalid-email",
      name: "テストユーザー",
      password: "Password123",
      password_confirmation: "Password123",
    };

    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("email");
      expect(result.error.issues[0].message).toBe(
        "有効なメールアドレスを入力してください",
      );
    }
  });

  it("空のメールアドレスがエラーになること", () => {
    const invalidData = {
      email: "",
      name: "テストユーザー",
      password: "Password123",
      password_confirmation: "Password123",
    };

    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("email");
      expect(result.error.issues[0].message).toBe("メールアドレスは必須です");
    }
  });

  it("空のユーザー名がエラーになること", () => {
    const invalidData = {
      email: "test@example.com",
      name: "",
      password: "Password123",
      password_confirmation: "Password123",
    };

    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("name");
      expect(result.error.issues[0].message).toBe("ユーザー名は必須です");
    }
  });

  it("長すぎるユーザー名がエラーになること", () => {
    const invalidData = {
      email: "test@example.com",
      name: "a".repeat(51),
      password: "Password123",
      password_confirmation: "Password123",
    };

    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("name");
      expect(result.error.issues[0].message).toBe(
        "ユーザー名は50文字以内で入力してください",
      );
    }
  });

  it("短すぎるパスワードがエラーになること", () => {
    const invalidData = {
      email: "test@example.com",
      name: "テストユーザー",
      password: "Pass1",
      password_confirmation: "Pass1",
    };

    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("password");
      expect(result.error.issues[0].message).toBe(
        "パスワードは8文字以上で入力してください",
      );
    }
  });

  it("大文字を含まないパスワードがエラーになること", () => {
    const invalidData = {
      email: "test@example.com",
      name: "テストユーザー",
      password: "password123",
      password_confirmation: "password123",
    };

    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("password");
      expect(result.error.issues[0].message).toBe(
        "パスワードは少なくとも1つの大文字、小文字、数字を含む必要があります",
      );
    }
  });

  it("小文字を含まないパスワードがエラーになること", () => {
    const invalidData = {
      email: "test@example.com",
      name: "テストユーザー",
      password: "PASSWORD123",
      password_confirmation: "PASSWORD123",
    };

    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("password");
      expect(result.error.issues[0].message).toBe(
        "パスワードは少なくとも1つの大文字、小文字、数字を含む必要があります",
      );
    }
  });

  it("数字を含まないパスワードがエラーになること", () => {
    const invalidData = {
      email: "test@example.com",
      name: "テストユーザー",
      password: "PasswordTest",
      password_confirmation: "PasswordTest",
    };

    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("password");
      expect(result.error.issues[0].message).toBe(
        "パスワードは少なくとも1つの大文字、小文字、数字を含む必要があります",
      );
    }
  });

  it("パスワードが一致しない場合にエラーになること", () => {
    const invalidData = {
      email: "test@example.com",
      name: "テストユーザー",
      password: "Password123",
      password_confirmation: "DifferentPassword123",
    };

    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("password_confirmation");
      expect(result.error.issues[0].message).toBe("パスワードが一致しません");
    }
  });

  it("パスワード確認が空の場合にエラーになること", () => {
    const invalidData = {
      email: "test@example.com",
      name: "テストユーザー",
      password: "Password123",
      password_confirmation: "",
    };

    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("password_confirmation");
      expect(result.error.issues[0].message).toBe("パスワード(確認)は必須です");
    }
  });
});

describe("confirmAccount", () => {
  it("有効なtokenが正しく検証されること", () => {
    const validData = {
      token: "123456",
    };

    const result = confirmAccountSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("短すぎるtokenがエラーになること", () => {
    const invalidData = {
      token: "12345",
    };

    const result = confirmAccountSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("token");
      expect(result.error.issues[0].message).toBe("トークンが無効です");
    }
  });

  it("長すぎるtokenがエラーになること", () => {
    const invalidData = {
      token: "1234567",
    };

    const result = confirmAccountSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("token");
      expect(result.error.issues[0].message).toBe("トークンが無効です");
    }
  });

  it("空のtokenがエラーになること", () => {
    const invalidData = {
      token: "",
    };
    const result = confirmAccountSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("token");
      expect(result.error.issues[0].message).toBe("認証コードは必須です");
    }
  });
});

describe("loginSchema", () => {
  it("有効なデータが正しく検証されること", () => {
    const validData = {
      email: "test@example.com",
      password: "Password123",
    };

    const result = loginSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("無効なメールアドレスがエラーになること", () => {
    const invalidData = {
      email: "invalid-email",
      password: "Password123",
    };

    const result = loginSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("email");
      expect(result.error.issues[0].message).toBe(
        "有効なメールアドレスを入力してください",
      );
    }
  });

  it("空のメールアドレスがエラーになること", () => {
    const invalidData = {
      email: "",
      password: "Password123",
    };

    const result = loginSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("email");
      expect(result.error.issues[0].message).toBe("メールアドレスは必須です");
    }
  });

  it("空のパスワードがエラーになること", () => {
    const invalidData = {
      email: "test@example.com",
      password: "",
    };

    const result = loginSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("password");
      expect(result.error.issues[0].message).toBe("パスワードは必須です");
    }
  });
});

describe("forgotPasswordSchema", () => {
  it("有効なデータが正しく検証されること", () => {
    const validData = {
      email: "test@example.com",
    };

    const result = forgotPasswordSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("無効なメールアドレスがエラーになること", () => {
    const invalidData = {
      email: "invalid-email",
    };

    const result = forgotPasswordSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("email");
      expect(result.error.issues[0].message).toBe(
        "有効なメールアドレスを入力してください",
      );
    }
  });

  it("空のメールアドレスがエラーになること", () => {
    const invalidData = {
      email: "",
    };

    const result = forgotPasswordSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("email");
      expect(result.error.issues[0].message).toBe("メールアドレスは必須です");
    }
  });
});
