import { useEffect, useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import Datepicker from "react-tailwindcss-datepicker";
import { Button } from "../hund-staking/Input";
import { Input } from "../hund-staking/Button";
import { MaxButton } from "../hund-staking/MaxButton";

import * as anchor from "@project-serum/anchor";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";

import {
  lock,
  unLock,
  showToast,
  createLockingState,
  getAdminKey,
  getLockTokens,
} from "../../contracts/web3_locker";

import { config } from "../../constants/config";

const Locker = () => {
  const list = Array.from({ length: 96 }, (_, index) => index + 1);
  const connection = new anchor.web3.Connection(config.NET_RPC);
  const wallet = useWallet();

  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11),
  });
  const [walletBalance, setWalletBalance] = useState(0);
  const [lockAmount, setLockAmount] = useState(0);
  const [tokenAddr, setTokenAddr] = useState("");
  const [lockPeriod, setLockPeriod] = useState(1);
  const [lockEndDate, setLockEndDate] = useState("");
  const [decimal, setDecimal] = useState(0);
  const [lockList, setLockList] = useState([]);
  const [lockAllow, setLockAllow] = useState(true);

  const handleTime = () => {
    let currentDate = new Date();
    let endDate = new Date();

    endDate.setMonth(currentDate.getMonth() + lockPeriod);
    setLockEndDate(endDate.toDateString());
  };

  const fetchBalance = useCallback(async () => {
    try {
      const mint = new PublicKey(tokenAddr); //C4xeo9gpLRe1Dq91C5fEhQJffwFYyUbzTxKGcjDB4B1w
      const supply = await connection.getTokenSupply(mint);
      // console.log("supply : ", supply.value.decimals);

      const userAta = await getOrCreateAssociatedTokenAccount(
        connection,
        wallet,
        mint,
        wallet.publicKey,
        false
      );

      const userAta_balance =
        parseInt(userAta.amount) / 10 ** supply.value.decimals;

      setDecimal(supply.value.decimals);
      setWalletBalance(userAta_balance);
    } catch (error) {
      setWalletBalance(0);
      console.error("Error fetching balance:", error);
    }
  }, [connection, wallet]);

  const onLock = async () => {
    if (tokenAddr.length == 0) {
      showToast("Enter Token Address To Lock", 3000, 1);
      return;
    }

    if (lockAmount > walletBalance) {
      showToast("Change Stake Value! this is too large than Max", 3000, 1);
      return;
    }

    const mint = new PublicKey(tokenAddr);

    try {
      let txHash = await lock(wallet, lockAmount, mint, decimal, lockPeriod);
    } catch (e) {
      console.error(e);
    }
  };

  const onUnlock = async (e) => {
    console.log(lockList[e.target.value].amount);
    const index = e.target.value;

    let currentDate = new Date();
    let endDate = new Date(lockList[index].lockedTime);

    if (currentDate < endDate) {
      showToast(
        `Invalid Unlock Time! Please Wait Until ${lockList[index].lockedTime}.`,
        5000,
        1
      );
      return;
    }

    if (lockAmount > walletBalance) {
      showToast("Change UnLock Value! this is too large than Max", 3000, 1);
      return;
    }

    const mint = new PublicKey(lockList[index].tokenAddr);
    const supply = await connection.getTokenSupply(mint);

    try {
      await unLock(wallet, lockList[index].amount, mint, supply.value.decimals);
    } catch (e) {
      showToast("Transaction failed", 2000, 1);
      console.error(e);
    }
  };

  const onCreateLockingState = async () => {
    try {
      let txHash = await createLockingState(wallet);
      console.log(txHash);
    } catch (e) {
      console.error(e);
    }
  };

  const isAdminConnected = () => {
    if (wallet && wallet.publicKey) {
      return wallet.publicKey.toString() == getAdminKey();
    }
    return false;
  };

  const isAlreadyLockedToken = () => {
    lockList.map((item, index) => {
      if (tokenAddr == item.tokenAddr.toString()) {
        setLockAllow(false);
        return;
      }
    });

    setLockAllow(true);
    return;
  };

  const getLockTokenList = async () => {
    try {
      let list = await getLockTokens(wallet);

      setLockList(list);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (tokenAddr !== "") {
        fetchBalance();
      } else {
        setWalletBalance(0);
      }

      getLockTokenList(wallet);
    }, 3000);

    return () => {
      clearInterval(intervalId); // Clean up the interval when the component unmounts
    }; // Change the interval time as needed (in milliseconds)
  }, [tokenAddr, wallet]);

  useEffect(() => {
    handleTime();
  }, [lockPeriod]);

  return (
    <div className="flex justify-center">
      <div className="h-full flex justify-center items-center flex-col gap-14 py-5 md:w-2xl xl:w-4xl">
        <div className="flex flex-col">
          <h1 className="text-[2.8rem] font-bold text-center header-typewriter">
            BLOCK AI Token Locker
          </h1>
          <label className="text-[1.5rem] text-center">
            Lock and secure your SPL tokens with BLOCK AI Locker,
            <br />
            the trusted platform for token locking and management on the Solana
            blockchain
          </label>
        </div>

        <div className="w-full flex flex-col p-4 items-center gap-8">
          <div className="w-full flex flex-col space-y-16 rounded-xl border-[1px] border-[var(--borderColor)] lg:max-w-xl p-8">
            <div className="flex flex-col space-y-2 items-center">
              <div className="flex w-full lg:max-w-lg">
                <label className="font-medium">Token Address</label>
              </div>
              <div className="flex w-full justify-between lg:max-w-lg">
                <input
                  type="text"
                  placeholder="Ex. Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
                  className="input input-bordered w-full lg:max-w-lg bg-white text-black text-[1.2rem]"
                  onChange={(event) => {
                    setTokenAddr(event.target.value);
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col space-y-2 justify-center items-center">
              <div className="flex w-full justify-between items-center lg:max-w-lg">
                <label className="flex">Lock Amount</label>
                <label className="flex text-[0.9rem]">
                  Balance: {walletBalance}
                </label>
              </div>
              <div className="flex w-full justify-between lg:max-w-lg input input-bordered px-0 bg-white">
                <Input
                  type="number"
                  className="px-4 text-[1.2rem] text-black"
                  min={0}
                  max={+walletBalance}
                  value={lockAmount}
                  onChange={(event) => {
                    setLockAmount(event.target.value);
                  }}
                ></Input>
                <MaxButton onClick={() => setLockAmount(walletBalance)}>
                  max
                </MaxButton>
              </div>
            </div>
            <div className="flex flex-col space-y-2 justify-center items-center ">
              <div className="flex w-full justify-between items-center lg:max-w-lg">
                <label className="font-medium">Lock time</label>
                <label className="font-light text-[0.9rem]">
                  Until {lockEndDate}
                </label>
              </div>
              <div className="flex w-full lg:max-w-lg">
                {/* <Datepicker
                  startFrom={new Date("2024-05-01")}
                  minDate={new Date("2024-05-01")}
                  showFooter={true}
                  value={value}
                  onChange={handleValueChange}
                /> */}
                <select
                  className="select select-bordered bg-white text-black w-full max-w-lg"
                  onChange={(e) => setLockPeriod(+e.target.value)}
                >
                  {list.map((item) => {
                    return (
                      <option key={item} value={item}>
                        {item} months
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            {isAdminConnected() ? (
              <div className="flex flex-col gap-2 justify-center bg-gray-400 p-2 rounded-md">
                <h1 className="flex justify-center text-2xl">ADMIN Panel</h1>
                <Button onClick={onCreateLockingState}>Create Stake</Button>
              </div>
            ) : (
              <></>
            )}
            <div className="flex justify-center gap-2">
              {lockAllow && (
                <Button className="w-full px-4" onClick={onLock}>
                  Lock
                </Button>
              )}
            </div>
          </div>
          <div className="w-full flex justify-center gap-2">
            {lockList &&
              lockList.length !== 0 &&
              lockList.map((item, index) => {
                if (item.amount == 0) {
                  return <></>;
                } else {
                  return (
                    <div className="lg:w-72 flex flex-col rounded-xl border-[1px] border-[var(--borderColor)] p-4 gap-3">
                      <div className="flex flex-col">
                        <label className="font-medium">
                          Token: {item.formattedAddr}
                        </label>
                        <label className="font-medium">
                          Lock Period: {item.lockPeriod} Month(s)
                        </label>
                        <label className="font-light text-[0.9rem]">
                          Until: {item.lockedTime}
                        </label>
                        <label className="font-medium">
                          Amounts: {item.amount}
                        </label>
                      </div>
                      <Button
                        className="w-full px-4"
                        value={index}
                        onClick={onUnlock}
                      >
                        Unlock
                      </Button>
                    </div>
                  );
                }
              })}
          </div>
        </div>

        <div className="flex flex-col justify-center items-center px-7 py-7 border-[1px] border-[var(--borderColor)] rounded-lg text-[var(--helperColor)]">
          <h1 className="text-[2rem] font-bold text-center">
            Utilization Guide
          </h1>
          <div className="flex flex-col gap-2 p-4">
            <ol className="flex flex-col text-[1.2rem] gap-4">
              <li className="border-b-[1px] border-[var(--borderColor)]">
                1. You need to connect your wallet to proceed.
              </li>
              <li className="border-b-[1px] border-[var(--borderColor)]">
                2. Input the contract address associated with the SPL tokens you
                wish to lock.
              </li>
              <li className="border-b-[1px] border-[var(--borderColor)]">
                3. Select the duration for which you want to lock your tokens.
              </li>
              <li className="border-b-[1px] border-[var(--borderColor)]">
                4. Once you are satisfied, proceed to confirm the lock to
                initiate the process.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Locker;
