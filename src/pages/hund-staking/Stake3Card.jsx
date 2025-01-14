import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { PoolHeader } from "./PoolHeader";
import { Button } from "./Input";
import { Input } from "./Button";
import { MaxButton } from "./MaxButton";
import * as anchor from "@project-serum/anchor";
import * as token from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  claim_staking,
  getMyStakedAndReward,
  createStakingState,
  createStakingPool,
  fundStakingReward,
  getPoolUser,
  getAdminKey,
  getTokenFromType,
  getTotalStaked,
  showToast,
  stake,
  unStake,
  getPoolStatus,
  getPoolAmount,
  updatePool,
} from "../../contracts/web3_lvl_one";
import { config } from "../../constants/config";
import { STAKING_IDS, STAKING } from "../../contracts/constants_lvl_one";

const Stake3Card = ({ setStakedAmount, setValicator, tokenPrice }) => {
  const [TVL, setTVL] = useState(0);
  const [tvlPrice, setTVLPrice] = useState(0);
  const [stakeAmount, setStakeAmount] = useState(0);
  const [rewardDepositAmount, setRewardDepositAmount] = useState(0);
  const [myStakedAmount, setMyStakedAmount] = useState(0);
  const [unStakeAmount, setUnStakeAmount] = useState(0);
  const [rewards, setRewards] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [dataUpdate, setDataUpdate] = useState(false);
  const [poolStatus, setPoolStatus] = useState(1);
  const [staking, setStaking] = useState(false);
  const [unStaking, setUnStaking] = useState(false);
  const [claimReward, setClaimReward] = useState(false);

  const connection = new anchor.web3.Connection(config.NET_RPC);

  const wallet = useWallet();

  const tokenMint = getTokenFromType("HUND");

  const isAdminConnected = () => {
    if (wallet && wallet.publicKey) {
      return wallet.publicKey.toString() == getAdminKey();
    }
    return false;
  };

  const onAddStakingPool = async () => {
    try {
      let txHash = await createStakingPool(
        wallet,
        tokenMint,
        STAKING[2].APY,
        STAKING[2].LOCK_TIME,
        STAKING_IDS[2]
      );
    } catch (e) {
      console.error(e);
    }
  };

  const onCreateStakingState = async () => {
    try {
      let txHash = await createStakingState(wallet, tokenMint, STAKING_IDS[2]);
    } catch (e) {
      console.error(e);
    }
  };

  const onDepositStakingReward = async () => {
    try {
      let txHash = await fundStakingReward(
        wallet,
        rewardDepositAmount,
        tokenMint,
        STAKING_IDS[2]
      );
    } catch (e) {
      console.error(e);
    }
  };

  const getReward = async () => {
    try {
      const [amount, reward_amount] = await getMyStakedAndReward(
        wallet,
        tokenMint,
        STAKING_IDS[2]
      );

      setMyStakedAmount(amount);
      setRewards(reward_amount);
    } catch (error) {
      console.log(error);
    }
  };

  const roundBigUnit = (number, digits = 2) => {
    let unitNum = 0;
    const unitName = ["", "K", "M", "B"];
    while (number >= 1000) {
      unitNum++;
      number /= 1000;

      if (unitNum > 2) {
        break;
      }
    }

    return `${roundDecimal(number, digits)} ${unitName[unitNum]}`;
  };

  const roundDecimal = (number, digits = 5) => {
    return number.toLocaleString("en-US", {
      maximumFractionDigits: digits,
    });
  };

  const getStaked = async () => {
    try {
      const totalStaked = await getPoolAmount(
        wallet,
        tokenMint,
        STAKING_IDS[2]
      );
      setStakedAmount(totalStaked);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Your function logic here
      getStaked();
      getReward();
      fetchBalance();
    }, 5000); // Change the interval time as needed (in milliseconds)

    getTotalStaked();
    getReward();
    fetchBalance();

    return () => {
      clearInterval(intervalId); // Clean up the interval when the component unmounts
    };
  }, [wallet]); // Dependencies array to ensure the effect only runs once

  const fetchBalance = useCallback(async () => {
    try {
      const mint = tokenMint;

      const userAta = await token.getOrCreateAssociatedTokenAccount(
        connection,
        wallet,
        mint,
        wallet.publicKey,
        false
      );
      const userAta_balance =
        parseInt(userAta.amount) / 10 ** config.REWARD_TOKEN_DECIMAL;
      setWalletBalance(userAta_balance);
    } catch (error) {
      setWalletBalance(0);
      console.error("Error fetching balance:", error);
    }
  }, [connection, wallet]);

  useEffect(() => {
    const updateTVLAndScheduleUpdate = async () => {
      try {
        // Update Pool Status
        const flag = await getPoolStatus(wallet, tokenMint, STAKING_IDS[2]);
        setPoolStatus(+flag);

        // Update TVL
        const tvl = await getPoolAmount(wallet, tokenMint, STAKING_IDS[2]);
        setTVL(tvl);

        // Update TVL price
        const tvlPrice = tvl * tokenPrice;
        setTVLPrice(tvlPrice.toFixed(3));
      } catch (error) {
        console.error("Error updating TVL:", error);
      } finally {
        // Schedule the next data update after 10 seconds
        setTimeout(() => {
          toggleDataUpdate();
        }, 3000);
      }
    };

    updateTVLAndScheduleUpdate();
  }, [dataUpdate]);

  const toggleDataUpdate = () => {
    setDataUpdate(!dataUpdate);
  };

  const getRef = () => {
    const ref = searchParams.get("ref");
    return ref;
  };

  const onUpdatePool = async (e) => {
    const flag = e.target.value;

    try {
      let txHash = await updatePool(wallet, flag, tokenMint, STAKING_IDS[2]);
    } catch (e) {
      console.error(e);
    }
  };

  const onStake = async () => {
    if (stakeAmount > walletBalance) {
      showToast("Change Stake Value! this is too large than Max", 3000, 1);
      return;
    }

    const totalStake = parseFloat(stakeAmount) + parseFloat(TVL);
    if (totalStake >= parseFloat(STAKING[2].LIMIT)) {
      showToast("Stake Amount Overflow", 3000, 1);
      return;
    }

    try {
      setStaking(true);
      let txHash = await stake(wallet, stakeAmount, tokenMint, STAKING_IDS[2]);
    } catch (e) {
      console.error(e);
    } finally {
      setStaking(false);
    }
  };

  const onUnStake = async () => {
    if (myStakedAmount == 0) {
      showToast("Try Stake At First", 3000, 1);
      return;
    }

    try {
      setUnStaking(true);
      await unStake(wallet, unStakeAmount, tokenMint, STAKING_IDS[2]);
    } catch (e) {
      showToast("Transaction failed", 2000, 1);
      console.error(e);
    } finally {
      setUnStaking(false);
    }
  };

  const onClaim = async () => {
    if (rewards <= 0) {
      showToast("Try Stake At First", 3000, 1);
      return;
    }

    try {
      setClaimReward(true);
      await claim_staking(wallet, tokenMint, STAKING_IDS[2]);
    } catch (e) {
      showToast("Transaction failed", 2000, 1);
      console.error(e);
    } finally {
      setClaimReward(false);
    }
  };

  return (
    <div className="flex flex-col border-[1px] border-[var(--borderColor)] p-4 gap-1 bg-[var(--cardColor)] rounded-2xl">
      <div className="flex justify-between">
        <PoolHeader>84 Days</PoolHeader>
        {!poolStatus && (
          <label className="font-extrabold text-[0.8rem] text-red-600">
            Deactivated
          </label>
        )}
      </div>
      <div className="flex justify-between items-center">
        <label className="font-bold">TVL</label>
        <label>{tvlPrice}</label>
      </div>
      <div className="flex justify-between items-center">
        <label className="font-bold">APY</label>
        <label className="font-bold text-[1.2rem] text-green-500">14%</label>
      </div>
      <div className="flex justify-between items-center">
        <label className="font-bold">Pool Size</label>
        <label className="text-[0.9rem]">
          <span className="text-[1rem]">15000000</span> BLOCK
        </label>
      </div>

      <div className="flex justify-between items-center">
        <label className="font-bold">Wallet</label>
        <label className="text-[0.9rem]">
          <span className="text-[1rem]">{walletBalance}</span>{" "}
          {config.REWARD_TOKEN_SYMBOL}
        </label>
      </div>

      <div className="flex flex-col gap-2">
        {/** admin zone begin */}
        {isAdminConnected() ? (
          <div className="flex flex-col gap-2 justify-center bg-gray-400 p-2 rounded-md">
            <h1 className="flex justify-center text-2xl">ADMIN Panel</h1>
            <Button onClick={onAddStakingPool}>Create Pool</Button>
            <div className="w-full flex gap-2">
              <Button className="w-full" value={1} onClick={onUpdatePool}>
                Activate
              </Button>
              <Button className="w-full" value={0} onClick={onUpdatePool}>
                Deactivate
              </Button>
            </div>
            <div className="flex justify-end">
              <label className="">max:{walletBalance}</label>
            </div>
            <div className="flex justify-between">
              <Input
                type="number"
                min={0}
                max={+walletBalance}
                value={rewardDepositAmount}
                onChange={(event) => {
                  setRewardDepositAmount(event.target.value);
                }}
              ></Input>
              <MaxButton onClick={() => setRewardDepositAmount(walletBalance)}>
                max
              </MaxButton>
            </div>
            <Button onClick={onDepositStakingReward}>Deposit</Button>
          </div>
        ) : (
          <></>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-end">
          <label className="">max:{walletBalance}</label>
        </div>
        <div className="flex justify-between">
          <Input
            type="number"
            min={0}
            max={+walletBalance}
            value={stakeAmount}
            onChange={(event) => {
              setStakeAmount(event.target.value);
            }}
          ></Input>
          <MaxButton onClick={() => setStakeAmount(walletBalance)}>
            max
          </MaxButton>
        </div>
        <Button onClick={onStake}>Stake</Button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-end">
          <label className="">max:{myStakedAmount}</label>
        </div>
        <div className="flex justify-between">
          <Input
            type="number"
            min={0}
            max={myStakedAmount}
            value={unStakeAmount}
            onChange={(event) => {
              setUnStakeAmount(event.target.value);
            }}
          ></Input>
          <MaxButton onClick={() => setUnStakeAmount(myStakedAmount)}>
            max
          </MaxButton>
        </div>
        <Button onClick={onUnStake}>Unstake</Button>
      </div>
      <div className="flex flex-col">
        <label>rewards: {rewards}</label>
        <Button onClick={onClaim}>Claim</Button>
      </div>
    </div>
  );
};

export default Stake3Card;
