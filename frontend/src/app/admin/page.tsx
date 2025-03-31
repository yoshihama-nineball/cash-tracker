import Link from "next/link";
import { verifySession } from "../../../libs/auth/dal";

const page = async () => {
  await verifySession();
  return (
    <>
      <div className="flex flex-col-reverse md:flex-row md:justify-between items-center">
        <div className="w-full md:w-auto">
          <h1 className="font-black text-4xl text-purple-950 my-5">予算</h1>
          <p className="text-xl font-bold">
            予算の管理ページ {""}
            <span className="text-amber-500">予算</span>
          </p>
        </div>
        <Link
          href={"/admin/budgets/new"}
          className="bg-amber-500 p-2 rounded-lg text-white font-bold w-full md:w-auto text-center"
        >
          予算を作成する
        </Link>
      </div>
    </>
  );
};

export default page;
