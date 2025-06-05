import { useEffect, useState } from "react";
import ResetPasswordForm from "./ResetPasswordForm";
import ValidateTokenForm from "./ValidateTokenForm";

const PasswordResetHandler = () => {
  const [token, setToken] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);

  // デバッグ用: 状態変更をコンソールに表示
  useEffect(() => {
    console.log("PasswordResetHandler 状態:", { token, isValid });
  }, [token, isValid]);

  return (
    <>
      {isValid ? (
        <ResetPasswordForm token={token} />
      ) : (
        <ValidateTokenForm
          token={token}
          setToken={setToken}
          setIsValid={setIsValid}
        />
      )}
    </>
  );
};

export default PasswordResetHandler;
