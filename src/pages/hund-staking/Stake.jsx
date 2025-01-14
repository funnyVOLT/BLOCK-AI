import { useState, useEffect } from "react";
import Stake1Card from "./Stake1Card";
import Stake2Card from "./Stake2Card";
import Stake3Card from "./Stake3Card";
import * as anchor from "@project-serum/anchor";
import * as token from "@solana/spl-token";
import axios from "axios";
import { useWallet } from "@solana/wallet-adapter-react";
import { config } from "../../constants/config";
import { getTokenFromType } from "../../contracts/web3_lvl_one";

const Stake = () => {
  const [validatorOne, setValicatorOne] = useState(0);
  const [validatorTwo, setValicatorTwo] = useState(0);
  const [validatorThree, setValicatorThree] = useState(0);
  const [stakedAmountOne, setStakedAmountOne] = useState(0);
  const [stakedAmountTwo, setStakedAmountTwo] = useState(0);
  const [stakedAmountThree, setStakedAmountThree] = useState(0);
  const [tokenPrice, setTokenPrice] = useState(0);
  const connection = new anchor.web3.Connection(config.NET_RPC);
  const wallet = useWallet();
  const tokenMint = getTokenFromType("HUND");

  useEffect(() => {
    const intervalId = setInterval(() => {
      getTokenPrice();
    }, 2000);
    getTokenPrice();
    return () => {
      clearInterval(intervalId); // Clean up the interval when the component unmounts
    };
  }, [wallet]);

  const getTokenPrice = async () => {
    try {
      const supply = await connection.getTokenSupply(tokenMint);
      const url = `https://price.jup.ag/v4/price?ids=${tokenMint.toString()}&vsToken=Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB`;
      const { data } = await axios.get(url);

      if (data && data.data && data.data[tokenMint.toString()]) {
        setTokenPrice(data.data[tokenMint.toString()].price);
      }
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

  return (
    <div className="flex flex-col gap-10 px-10 pb-8 items-center">
      <div className="flex flex-col items-center gap-4">
        <label className="text-[2.8rem] font-bold text-center header-typewriter">
          STAKING
        </label>
        <div className="flex max-w-screen-lg">
          <label className="text-[1.5rem] text-center">
            Stake your $BLOCK token and earn rewards. <br />
            Our intuitive, easy to use interface will help you safely stake and
            start earning today. Utilize the strength of different pool
            selections and claim your accrued rewards!
          </label>
        </div>
      </div>

      <div className="p-4 flex justify-between rounded-xl rotating-border stats-container">
        {/* <div className="flex-1 flex flex-col items-center border-r-[1px] border-[var(--borderColor)] gap-2 border-none">
          <div className="font-bold">Total Participants</div>
          <label className="text-[2rem] font-extrabold">
            {validatorOne + validatorTwo + validatorThree}
          </label>
        </div> */}
        <div className="flex-1 flex flex-col items-center gap-2 border-none inner-content">
          <div className="font-bold">Total Value Locked(TVL)</div>
          <label className="text-[2rem] font-extrabold">
            {roundBigUnit(
              tokenPrice *
                (stakedAmountOne + stakedAmountTwo + stakedAmountThree)
            )}{" "}
            USD
          </label>
        </div>
        <div className="flex-1 flex flex-col items-center gap-2 border-none inner-content">
          <div className="font-bold">Total Stake</div>
          <label className="text-[2rem] font-extrabold">
            {stakedAmountOne + stakedAmountTwo + stakedAmountThree}
          </label>
        </div>
        <div className="flex-1 flex flex-col items-center gap-2  inner-content">
          <div className="font-bold">Token Price</div>
          <label className="text-[2rem] font-extrabold">${tokenPrice}</label>
        </div>
      </div>

      <div className="flex gap-12 justify-around card-container">
        <div className="card ">
          <Stake1Card
            setStakedAmount={setStakedAmountOne}
            setValicator={setValicatorOne}
            tokenPrice={tokenPrice}
          />
        </div>

        <div className="card">
          <Stake2Card
            setStakedAmount={setStakedAmountTwo}
            setValicator={setValicatorTwo}
            tokenPrice={tokenPrice}
          />
        </div>

        <div className="card">
          <Stake3Card
            setStakedAmount={setStakedAmountThree}
            setValicator={setValicatorThree}
            tokenPrice={tokenPrice}
          />
        </div>
      </div>
    </div>
  );
};

export default Stake;
