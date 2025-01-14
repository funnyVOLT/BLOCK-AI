import { PoolHeader } from "./PoolHeader";
import { Button } from "./Input";
import { Input } from "./Button";
import { MaxButton } from "./MaxButton";
import { useWallet } from "@solana/wallet-adapter-react";

import {
  claim_staking,
  createStakingPool,
  createStakingState,
  fundStakingReward,
  getAdminKey,
  getMyStakedAndReward,
  getTokenFromType,
  showToast,
  stake,
  unStake,
} from "../../contracts/web3_lvl_one";

// import AdminPool1Card from "./AdminPool1Card";
// import AdminPool2Card from "./AdminPool2Card";
// import AdminPool3Card from "./AdminPool3Card";

import { config } from "../../constants/config";

const AdminSubPage = () => {
  return (
    <div className="flex flex-col gap-12 px-10 pb-8">
      <div className="flex gap-8 justify-center">
        <div className="card w-[30%]">{/* <AdminPool1Card /> */}</div>

        {/* <div className="card w-[30%]">
          <AdminPool2Card />
        </div>

        <div className="card w-[30%]">
          <AdminPool3Card />
        </div> */}
      </div>
    </div>
  );
};

export default AdminSubPage;
