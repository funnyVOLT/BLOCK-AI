import { useEffect, useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import Datepicker from "react-tailwindcss-datepicker";
import { Button } from "../hund-staking/Input";
import { Input } from "../hund-staking/Button";
import { MaxButton } from "../hund-staking/MaxButton";

const HomePage = () => {
  return (
    <div className="flex justify-center">
      <div className="h-full flex justify-center items-center flex-col gap-14 py-5 md:w-2xl xl:w-4xl">
        <div className="flex flex-col">
          <h1 className="text-[2.8rem] font-bold text-center header-typewriter">
            About US
          </h1>
          <label className="text-[1.5rem] text-left">
            $block revolutionise crypto management with 🤖 AItoken bots. Create,
            Own, Monetize Apps, Agents and Staking using the AI tech powered by
            $block.
          </label>
          <label className="text-[1.5rem] text-left">
            BLOCK AI provids creation and minting using advanced AI-powered
            algorithms designed to optimize tokenomics and ensure a balanced,
            sustainable growth trajectory. <br />
            By leveraging cutting-edge AI technology, the creation and minting
            process is dynamic, adapting to market trends and providing
            real-time adjustments to token supply and lock to maintain stability
            and liquidity. <br />
            In addition to the innovative minting process, $BLOCK integrates
            AI-driven volume and holder bots, which work in tandem to
            consistently monitor and influence market trends, promoting the
            token's visibility and long-term performance. <br />
            This intelligent ecosystem helps secure the token's position in the
            market while providing holders with benefits such as reduced tax
            rates and high Annual Percentage Yields (APY) through staking,
            encouraging active participation and long-term investment.
          </label>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
