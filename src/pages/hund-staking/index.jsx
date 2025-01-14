import { useState, useCallback, useEffect, useRef } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import Creator from "../hund-creator/Creator";
import Stake from "./Stake";
// import Locker from "./Locker";
import Locker from "../hund-locker/Locker";
import Documentation from "../hund-documentation/documentation";
import HomePage from "../hund-home/Home";
import logoIcon from "/images/logo.png";
import Admin from "./AdminSubPage";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import "./index.css";
import WalletContextProvider from "../../components/WalletContextProvider";
import { useAppContext } from "../../contexts/AppContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { getAdminKey } from "../../contracts/web3_lvl_one";
import Agent from "../agent";

const tabs = [
  "Home",
  "Staking",
  "Token Creator",
  "Token Locker",
  "Character Creator",
  "VolumeBot",
  "HolderBot",
  "Documentation",
];
function Home() {
  const [init, setInit] = useState(false);
  const { tab, setTab } = useAppContext();
  const [showNavbar, setShowNavbar] = useState(window.innerWidth > 1150);
  const navbarRef = useRef(null);
  const wallet = useWallet();
  const isAdminConnected = () => {
    if (wallet && wallet.publicKey) {
      return wallet.publicKey.toString() == getAdminKey();
    }
    return false;
  };

  useEffect(() => {
    console.log("Tab changed: ", tab);
  }, [tab]);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });

    const handleResize = () => {
      setShowNavbar(window.innerWidth > 1150);
    };

    const handleClickOutside = (event) => {
      if (
        window.innerWidth <= 1150 &&
        navbarRef.current &&
        !navbarRef.current.contains(event.target) &&
        !event.target.classList.contains("navbar-button")
      ) {
        setShowNavbar(false);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const particlesLoaded = (container) => {
    console.log(container);
  };

  return (
    <WalletContextProvider>
      {init && (
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={{
            fpsLimit: 120,
            interactivity: {
              events: {
                onClick: {
                  enable: true,
                  mode: "repulse",
                },
                onHover: {
                  enable: true,
                  mode: "grab",
                },
                resize: true,
              },
              modes: {
                push: {
                  quantity: 1,
                },
                repulse: {
                  distance: 150,
                  duration: 3,
                },
                grab: {
                  distance: 180,
                  duration: 2,
                },
              },
            },
            particles: {
              color: {
                value: "#ffffff",
              },
              links: {
                color: "#ffffff",
                distance: 200,
                enable: true,
                opacity: 0.5,
                width: 1,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: false,
                speed: 1.5,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 120,
              },
              opacity: {
                value: 0.6,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 5 },
              },
            },
            detectRetina: true,
          }}
        />
      )}
      <button
        className={`fixed top-4 z-20 bg-[var(--buttonColor)] text-[var(--textColor)] p-2 rounded-md navbar-button transition-transform duration-300 ${
          showNavbar ? "translate-x-[220px]" : "translate-x-0"
        }`}
        onClick={() => setShowNavbar(!showNavbar)}
      >
        {showNavbar ? "◀" : "▶"}
      </button>
      <div className="min-h-screen flex overflow-y-auto">
        <div
          ref={navbarRef}
          className={`fixed z-10 min-h-screen min-w-[120px] w-[15%] flex flex-col border-r-[1px] border-[var(--borderColor)] bg-[var(--navBarColor)] navbar-container transition-transform duration-300 ${
            showNavbar ? "navbar-visible" : "navbar-hidden"
          }`}
        >
          <img className="mr-2" src={logoIcon} style={{ width: "100%" }} />
          <div className="flex flex-col text-[var(--navBarTextSize)]">
            <div
              className={`${
                tab == 0 ? "bg-[var(--tabSelectColor)]" : ""
              } flex pl-2 py-2 text-[var(--navBarTextSize)] cursor-pointer items-center`}
              onClick={() => {
                setTab(0);
              }}
            >
              <div className="w-3 h-3 border-2 border-white rounded-full m-2"></div>
              {tabs[0]}
            </div>
            <div
              className={`${
                tab == 1 ? "bg-[var(--tabSelectColor)]" : ""
              } flex pl-2 py-2 text-[var(--navBarTextSize)] cursor-pointer items-center`}
              onClick={() => {
                setTab(1);
              }}
            >
              <div className="w-3 h-3 border-2 border-white rounded-full m-2"></div>
              {tabs[1]}
            </div>
            <div
              className={`${
                tab == 2 ? "bg-[var(--tabSelectColor)]" : ""
              } flex pl-2 py-2 text-[var(--navBarTextSize)] cursor-pointer items-center`}
              onClick={() => {
                setTab(2);
              }}
            >
              <div className="w-3 h-3 border-2 border-white rounded-full m-2"></div>
              {tabs[2]}
            </div>
            <div
              className={`${
                tab == 3 ? "bg-[var(--tabSelectColor)]" : ""
              } flex pl-2 py-2 text-[var(--navBarTextSize)] cursor-pointer items-center`}
              onClick={() => {
                setTab(3);
              }}
            >
              <div className="w-3 h-3 border-2 border-white rounded-full m-2"></div>
              {tabs[3]}
            </div>
            <div
              className={`${
                tab == 4 ? "bg-[var(--tabSelectColor)]" : ""
              } flex pl-2 py-2 text-[var(--navBarTextSize)] cursor-pointer items-center`}
              onClick={() => {
                setTab(4);
              }}
            >
              <div className="w-3 h-3 border-2 border-white rounded-full m-2"></div>
              {tabs[4]}
            </div>
            <a
              className={`${
                tab == 5 ? "bg-[var(--tabSelectColor)]" : ""
              } flex pl-2 py-2 text-[var(--navBarTextSize)] cursor-pointer items-center`}
              href={"https://t.me/BlockAIVolumeBot"}
              target={"_blank"}
            >
              <div className="w-3 h-3 border-2 border-white rounded-full m-2"></div>
              {tabs[5]}
            </a>
            <a
              className={`${
                tab == 6 ? "bg-[var(--tabSelectColor)]" : ""
              } flex pl-2 py-2 text-[var(--navBarTextSize)] cursor-pointer items-center`}
              href={"https://t.me/BlockAIHolderBot"}
              target={"_blank"}
            >
              <div className="w-3 h-3 border-2 border-white rounded-full m-2"></div>
              {tabs[6]}
            </a>
            <div
              className={`${
                tab == 7 ? "bg-[var(--tabSelectColor)]" : ""
              } flex pl-2 py-2 text-[var(--navBarTextSize)] cursor-pointer items-center`}
              onClick={() => {
                setTab(7);
              }}
            >
              <div className="w-3 h-3 border-2 border-white rounded-full m-2"></div>
              {tabs[7]}
            </div>

            {/* {isAdminConnected() && (
              <div
                className={`${
                  tab == 3 ? "bg-[var(--tabSelectColor)]" : ""
                } flex pl-2 py-2 text-[var(--navBarTextSize)] cursor-pointer items-center`}
                onClick={() => {
                  setTab(3);
                }}
              >
                <div className="w-3 h-3 border-2 border-white rounded-full m-2"></div>
                {tabs[3]}
              </div>
            )} */}

            {/* <div className="flex flex-col max-w-2xl pb-16 px-4 sm:px-6 lg:max-w-7xl lg:px-8"> */}
            <div className="flex flex-col w-full mx-0 social_links">
              <div className="flex gap-6">
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
              {/* </div> */}
            </div>
          </div>
        </div>
        <div className="fixed w-full pl-[18%] flex justify-between items-center px-16 border-b-[1px] border-[var(--borderColor)] bg-[var(--navBarColor)] z-[1]">
          <label className="text-[1.5rem] font-bold leading-normal p-4">
            {tabs[tab]}
          </label>
          <WalletMultiButton
            style={{
              lineHeight: "1.0rem",
              fontWeight: 900,
              background: "var(--buttonColor)",
              borderRadius: "6px",
              color: "var(--textColor)",
            }}
          />
        </div>
        <div className="h-full gap-2 pt-[6rem] z-0 main-container">
          <div className="w-full flex flex-col px-10 gap-8 items-center">
            {tab == 7 && <HomePage></HomePage>}
            {tab == 1 && <Stake></Stake>}
            {tab == 2 && <Creator></Creator>}
            {tab == 3 && <Locker></Locker>}
            {tab == 4 && <Agent></Agent>}
            {tab == 0 && <Documentation></Documentation>}
            {/* {tab == 3 && isAdminConnected() && <Admin></Admin>} */}
          </div>
        </div>
      </div>
    </WalletContextProvider>
  );
}

export default Home;
