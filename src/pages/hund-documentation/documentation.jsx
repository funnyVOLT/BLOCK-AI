import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import copy from "copy-to-clipboard";
import Datepicker from "react-tailwindcss-datepicker";
import { Button } from "../hund-staking/Input";
import { Input } from "../hund-staking/Button";
import { MaxButton } from "../hund-staking/MaxButton";
import { useAppContext } from "../../contexts/AppContext";
import { showToast } from "../../contracts/web3_lvl_one";

const Locker = () => {
  const navigate = useNavigate();
  const { setTab } = useAppContext();
  return (
    <div className="flex justify-center">
      <div className="h-full flex justify-center items-center flex-col gap-14 py-5 md:w-2xl xl:w-4xl">
        <div className="flex flex-col">
          <h1 className="text-[2.8rem] font-bold text-center header-typewriter">
            BLOCK AI Token
          </h1>
          <label className="text-[1.5rem] text-center">
            $BLOCK revolutionise crypto management with 🤖 AI-Powered bots.
            Create, Own, Monetize Apps, Agents and Staking using the AI tech
            powered by $BLOCK.
          </label>
        </div>

        <div className="flex flex-col justify-center items-center gap-2">
          {/* <span
            className="cursor-pointer bg-gray-400/10 px-2 rounded-sm"
            onClick={() => {
              copy("absdfasdfsdc");
              showToast("Token address copied");
            }}
          >
            absdfasdfsdc
          </span> */}
          <div className="flex flex-row gap-4 justify-center">
            <a
              className="group relative"
              aria-label="Twitter"
              target="_blank"
              href="https://x.com/bl0ckai"
            >
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF] opacity-0 blur-sm transition-opacity group-hover:opacity-100"></div>
              <svg
                aria-hidden="true"
                className="h-6 w-6 fill-[#FFFFFF]/80 transition-colors group-hover:fill-[#E6B7A1]"
                viewBox="0 0 24 24"
              >
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0 0 22 5.92a8.19 8.19 0 0 1-2.357.646 4.118 4.118 0 0 0 1.804-2.27 8.224 8.224 0 0 1-2.605.996 4.107 4.107 0 0 0-6.993 3.743 11.65 11.65 0 0 1-8.457-4.287 4.106 4.106 0 0 0 1.27 5.477A4.073 4.073 0 0 1 2.8 9.713v.052a4.105 4.105 0 0 0 3.292 4.022 4.093 4.093 0 0 1-1.853.07 4.108 4.108 0 0 0 3.834 2.85A8.233 8.233 0 0 1 2 18.407a11.615 11.615 0 0 0 6.29 1.84"></path>
              </svg>
            </a>
            <a
              className="group relative"
              aria-label="Telegram"
              target="_blank"
              href="https://t.me/blockaisol"
            >
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#7BB4D5]/20 to-[#E6B7A1]/20 opacity-0 blur-sm transition-opacity group-hover:opacity-100"></div>
              <svg
                aria-hidden="true"
                className="h-6 w-6 fill-[#7BB4D5]/80 transition-colors group-hover:fill-[#E6B7A1]"
                viewBox="0 0 24 24"
              >
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"></path>
              </svg>
            </a>
            <a
              className="group relative hidden"
              aria-label="Analytics"
              target="_blank"
              href="https://dexscreener.com/solana/dhaeaydznb76kxf5t5fgh7n3txbusphwdhrqyqmygywy"
            >
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#7BB4D5]/20 to-[#E6B7A1]/20 opacity-0 blur-sm transition-opacity group-hover:opacity-100"></div>
              <svg
                aria-hidden="true"
                className="h-6 w-6 fill-[#7BB4D5]/80 transition-colors group-hover:fill-[#E6B7A1]"
                viewBox="0 0 24 24"
              >
                <path d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h16V5H4zm3 8h2v4H7v-4zm4-6h2v10h-2V7zm4 3h2v7h-2v-7z"></path>
              </svg>
            </a>
          </div>
        </div>
        <div className="flex flex-col md:grid md:grid-cols-3 gap-4">
          <div className="flex flex-col justify-between items-center  p-1 md:p-7 border-[1px] border-[var(--borderColor)] rounded-lg text-[var(--documentColor)]">
            <div className="flex flex-col gap-2">
              <h1 className="md:text-[2rem] font-bold text-center text-sm">
                Staking
              </h1>
              <div className="flex flex-col gap-2 p-4">
                <ol className="flex flex-col gap-4">
                  <li className=" md:text-[1rem] text-sm">
                    Token holders who stake $BLOCK gain access to exclusive
                    discounts on AI bot services, creating added value while
                    contributing to the ecosystem's growth.
                  </li>
                </ol>
              </div>
            </div>
            <Button onClick={() => setTab(1)}>Go to Staking</Button>
          </div>
          <div className="flex flex-col justify-between items-center  p-1 md:p-7 border-[1px] border-[var(--borderColor)] rounded-lg text-[var(--documentColor)]">
            <div className="flex flex-col gap-2">
              <h1 className="md:text-[2rem] font-bold text-center text-sm leading-7">
                Creator
              </h1>
              <div className="flex flex-col gap-2 p-4">
                <ol className="flex flex-col gap-4">
                  <li className=" md:text-[1rem] text-sm">
                    Empower your token creation process with the revolutionary
                    capabilities of artificial intelligence
                  </li>
                </ol>
              </div>
            </div>
            <Button onClick={() => setTab(2)}>Go to Creator</Button>
          </div>
          <div className="flex flex-col justify-between items-center  p-1 md:p-7 border-[1px] border-[var(--borderColor)] rounded-lg text-[var(--documentColor)]">
            <div className="flex flex-col gap-2">
              <h1 className="md:text-[2rem] font-bold text-center text-sm leading-7">
                Locker
              </h1>
              <div className="flex flex-col gap-2 p-4">
                <ol className="flex flex-col gap-4">
                  <li className=" md:text-[1rem] text-sm">
                    Lock and secure your SPL tokens with BLOCKAI Locker, the
                    trusted platform for token locking and management on the
                    Solana blockchain
                  </li>
                </ol>
              </div>
            </div>
            <Button onClick={() => setTab(3)}>Go to Locker</Button>
          </div>
          <div className="flex flex-col justify-between items-center  p-1 md:p-7 border-[1px] border-[var(--borderColor)] rounded-lg text-[var(--documentColor)]">
            <div className="flex flex-col gap-2">
              <h1 className="md:text-[2rem] font-bold text-center text-sm leading-7">
                Character
              </h1>
              <div className="flex flex-col gap-2 p-4">
                <ol className="flex flex-col gap-4">
                  <li className=" md:text-[1rem] text-sm">
                    Anyone can use advanced AI to create token logos, banners,
                    and descriptions.
                  </li>
                </ol>
              </div>
            </div>
            <Button onClick={() => setTab(4)}>Go to Character</Button>
          </div>
          <div className="flex flex-col justify-between items-center  p-1 md:p-7 border-[1px] border-[var(--borderColor)] rounded-lg text-[var(--documentColor)]">
            <div className="flex flex-col gap-2">
              <h1 className="md:text-[2rem] font-bold text-center text-sm">
                Volume Bot
              </h1>
              <div className="flex flex-col gap-2 p-4">
                <ol className="flex flex-col gap-4">
                  <li className=" md:text-[1rem] text-sm">
                    An AI-powered bot optimizes trading volume engagement,
                    keeping the token consistently at the forefront of the
                    market.
                  </li>
                </ol>
              </div>
            </div>
            <Button>
              <Link to="https://t.me/BlockAIVolumeBot" target="_blank">
                Go to Volume Bot
              </Link>
            </Button>
          </div>
          <div className="flex flex-col justify-between items-center  p-1 md:p-7 border-[1px] border-[var(--borderColor)] rounded-lg text-[var(--documentColor)]">
            <div className="flex flex-col gap-2">
              <h1 className="md:text-[2rem] font-bold text-center text-sm">
                Holder Bot
              </h1>
              <div className="flex flex-col gap-2 p-4">
                <ol className="flex flex-col gap-4">
                  <li className=" md:text-[1rem] text-sm">
                    An AI-powered bot increases trader engagement, keeping
                    insight of the token on the market.
                  </li>
                </ol>
              </div>
            </div>
            <Button>
              <Link to="https://t.me/BlockAIHolderBot" target="_blank">
                Go to Holder Bot
              </Link>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-6 md:pt-12">
          <div className="flex flex-col justify-between items-center h-full p-2 md:p-7 border-[1px] border-[var(--borderColor)] rounded-lg text-[var(--documentColor)]">
            <div className="flex flex-col flex-1 items-center gap-2">
              <img
                src="/images/ceo.jpg"
                className="w-24 h-24 md:w-48 md:h-48 object-cover rounded-full"
              />
              <h1 className="md:text-[2rem] font-bold text-center text-sm">
                CEO
              </h1>
              <div className="flex flex-col gap-2 p-4">
                <ol className="flex flex-col gap-4">
                  <li className=" md:text-[1rem] text-sm text-center">
                    Carl Staff
                  </li>
                </ol>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between items-center h-full p-2 md:p-7 border-[1px] border-[var(--borderColor)] rounded-lg text-[var(--documentColor)]">
            <div className="flex flex-col flex-1 items-center gap-2">
              <img
                src="/images/cto.jpg"
                className="w-24 h-24 md:w-48 md:h-48 object-cover rounded-full"
              />
              <h1 className="md:text-[2rem] font-bold text-center text-sm">
                CTO
              </h1>
              <div className="flex flex-col gap-2 p-4">
                <ol className="flex flex-col gap-4">
                  <li className=" md:text-[1rem] text-sm text-center">
                    Uncle DEV
                  </li>
                </ol>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between items-center h-full p-2 md:p-7 border-[1px] border-[var(--borderColor)] rounded-lg text-[var(--documentColor)]">
            <div className="flex flex-col flex-1 items-center gap-2">
              <img
                src="/images/cmo.jpg"
                className="w-24 h-24 md:w-48 md:h-48 object-cover rounded-full"
              />
              <h1 className="md:text-[2rem] font-bold text-center text-sm">
                CMO
              </h1>
              <div className="flex flex-col gap-2 p-4">
                <ol className="flex flex-col justify-end gap-4">
                  <li className=" md:text-[1rem] text-sm text-center">
                    Maurykius
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Locker;
