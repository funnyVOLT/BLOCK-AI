import { useState, useRef, useEffect } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { Input } from "../hund-staking/Button";
import { Button } from "../hund-staking/Input";
import ToggleButton from "../../components/ToggleButton";
import { useWallet } from "@solana/wallet-adapter-react";
// import { generateMemeTokenName } from "./AIgenerator";
import { generateTokenWithRelatedWord } from "./AIgeneration";
import { send, sendCreator, showToast } from "../../contracts/web3_lvl_one";
import { endpoint, PRIVATE_KEY } from "./config";
import Loader from "./Loader";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import bs58 from "bs58";
import {
  revoke,
  AuthorityType,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  getMinimumBalanceForRentExemptMint,
  getAssociatedTokenAddress,
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  createSetAuthorityInstruction,
} from "@solana/spl-token";

import {
  createCreateMetadataAccountV3Instruction,
  PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";

import { ADMINWALLET } from "./config";

const VITE_GATEWAY_URL = "https://sapphire-absent-partridge-46.mypinata.cloud";
const VITE_GATEWAY_KEY =
  "?pinataGatewayToken=BoMEBF_qO3jmpWrnTkHGgCJBWbK7qpYIh6Ry9RC-rmCkLzW5-pgHktO1jdF11SFf";
const VITE_PINATA_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiNzU3NWI4MC03NmRlLTQwMWItOTI1OS05ODgwNzg4NDA5NWUiLCJlbWFpbCI6ImRldmRvY3Rvcjk1MDRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6Ijk1Zjk1ZmFlOWQzNGU1YzVhMDQzIiwic2NvcGVkS2V5U2VjcmV0IjoiYzE1MWJjY2E0MmViN2RhOTMyODA3NjI4ODNhNDg2NmU2MWZkOWQzYjU2Nzg2NDI5NTJkMjVkZDViNWU1NWZlMiIsImlhdCI6MTcxMzg4ODM2NH0.EOiztmVLARRfXVKKSGKacFZPORu7_U6t7uz0AEhHOyA";
const BASIC_URL = VITE_GATEWAY_URL + "/ipfs/";

const Creator = () => {
  const wallet = useWallet();
  const hiddenFileInput = useRef(null);
  const [prompt, setPrompt] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState(0);
  const [decimal, setDecimal] = useState(0);
  const [freeze, setFreeze] = useState(false);
  const [mint, setMint] = useState(false);
  const [userAvatarUrl, setUserAvatarUrl] = useState("");
  const [buf, setBuf] = useState();
  const [uploadFile, setUploadFile] = useState("");
  const [metadataUrl, setMetadataUrl] = useState("");
  const [loader, setLoader] = useState(false);
  const [showLinks, setShowLinks] = useState(false);

  useEffect(() => {
    if (userAvatarUrl) setShowLinks(true);
    else setShowLinks(false);
  }, [userAvatarUrl]);

  const handleFile = async (uploadfile, name, symbol, supply, decimal) => {
    try {
      setLoader(true);
      const formData = new FormData();
      formData.append("file", uploadfile);
      const metadata = JSON.stringify({
        name: uploadfile.name,
      });

      formData.append("pinataMetadata", metadata);
      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);
      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${VITE_PINATA_JWT}`,
          },
          body: formData,
        }
      );
      const resData = await res.json();
      const imageUrl = BASIC_URL + resData.IpfsHash + VITE_GATEWAY_KEY;

      // After uploading the image, create and upload the metadata JSON
      const metadataJson = {
        supply,
        decimal,
        image: imageUrl, // URL of the uploaded image
        symbol,
        tokenName: name,
      };

      const metadataFormData = new FormData();
      const blob = new Blob([JSON.stringify(metadataJson)], {
        type: "application/json",
      });
      metadataFormData.append("file", blob, "metadata.json");
      const metadataRes = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${VITE_PINATA_JWT}`,
          },
          body: metadataFormData,
        }
      );
      const metadataResData = await metadataRes.json();
      const metadataUrl =
        BASIC_URL + metadataResData.IpfsHash + VITE_GATEWAY_KEY;

      setUploadFile(uploadfile.name);
      setUserAvatarUrl(imageUrl); // Keep the image URL
      setMetadataUrl(metadataUrl); // Set the metadata URL to be used as token URI
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const captureFile = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];

    handleFile(file);

    let reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => convertToBuffer(reader);
  };

  const convertToBuffer = async (reader) => {
    //file is converted to a buffer to prepare for uploading to IPFS
    const buffer = await Buffer.from(reader.result);
    setBuf(buffer);
  };

  const onUpload = (event) => {
    event.preventDefault();
    hiddenFileInput.current.click();
  };

  // if (loader) {
  //   return <Loader />;
  // }

  const onGenerate = () => {
    generateTokenWithRelatedWord(prompt).then((res) => {
      setName(res.name);
      setSymbol(res.symbol);
      setSupply(res.supply);
      setDecimal(res.decimal);
    });
  };

  const onCreateToken = () => {
    // console.log(
    //   "name =" +
    //     name +
    //     ", symbol =" +
    //     symbol +
    //     "supply =" +
    //     supply +
    //     "decimal =" +
    //     decimal +
    //     "ipfs =" +
    //     metadataUrl +
    //     "freeze =" +
    //     freeze +
    //     ", mint = " +
    //     mint
    // );
    if (wallet.publicKey === null || wallet.publicKey === undefined) {
      showToast("Connect Wallet!", 5000, 1);
      return null;
    }
    const tokenInfo = {
      amount: supply,
      decimals: decimal,
      metadata: metadataUrl,
      symbol: symbol,
      tokenName: name,
    };
    createToken(tokenInfo, mint, revoke);
  };

  const createToken = async (tokenInfo, revokeMintBool, revokeFreezeBool) => {
    const connection = new Connection(endpoint);
    const lamports = await getMinimumBalanceForRentExemptMint(connection);
    const mintKeypair = Keypair.generate();
    // const myKeyPair = Keypair.fromSecretKey(
    //   new Uint8Array(bs58.decode(PRIVATE_KEY))
    // );
    const myPublicKey = wallet.publicKey;
    const createMetadataInstruction = createCreateMetadataAccountV3Instruction(
      {
        metadata: PublicKey.findProgramAddressSync(
          [
            Buffer.from("metadata"),
            PROGRAM_ID.toBuffer(),
            mintKeypair.publicKey.toBuffer(),
          ],
          PROGRAM_ID
        )[0],
        mint: mintKeypair.publicKey,
        mintAuthority: myPublicKey,
        payer: myPublicKey,
        updateAuthority: myPublicKey,
      },
      {
        createMetadataAccountArgsV3: {
          data: {
            name: tokenInfo.tokenName,
            symbol: tokenInfo.symbol,
            uri: metadataUrl,
            creators: null,
            sellerFeeBasisPoints: 0,
            uses: null,
            collection: null,
          },
          isMutable: true,
          collectionDetails: null,
        },
      }
    );

    const tokenATA = await getAssociatedTokenAddress(
      mintKeypair.publicKey,
      myPublicKey
    );

    const createNewTokenTransaction = new Transaction();
    createNewTokenTransaction.add(
      SystemProgram.createAccount({
        fromPubkey: myPublicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: MINT_SIZE,
        lamports: lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMintInstruction(
        mintKeypair.publicKey,
        tokenInfo.decimals,
        myPublicKey,
        myPublicKey,
        TOKEN_PROGRAM_ID
      ),
      createAssociatedTokenAccountInstruction(
        myPublicKey,
        tokenATA,
        myPublicKey,
        mintKeypair.publicKey
      ),
      createMintToInstruction(
        mintKeypair.publicKey,
        tokenATA,
        myPublicKey,
        tokenInfo.amount * Math.pow(10, tokenInfo.decimals)
      ),
      createMetadataInstruction
    );
    // createNewTokenTransaction.feePayer = myKeyPair.publicKey;
    createNewTokenTransaction.feePayer = wallet.publicKey;

    if (revokeMintBool) {
      let revokeMint = createSetAuthorityInstruction(
        mintKeypair.publicKey, // mint acocunt || token account
        myPublicKey, // current auth
        AuthorityType.MintTokens, // authority type
        null
      );
      createNewTokenTransaction.add(revokeMint);
    }

    if (revokeFreezeBool) {
      let revokeFreeze = createSetAuthorityInstruction(
        mintKeypair.publicKey, // mint acocunt || token account
        myPublicKey, // current auth
        AuthorityType.FreezeAccount, // authority type
        null
      );

      createNewTokenTransaction.add(revokeFreeze);
    }

    // send sol to admin
    const sendSolInstruction = SystemProgram.transfer({
      // fromPubkey: myKeyPair.publicKey,
      fromPubkey: myPublicKey,
      toPubkey: ADMINWALLET,
      lamports: 0.5 * LAMPORTS_PER_SOL,
    });

    createNewTokenTransaction.add(sendSolInstruction);
    //

    let blockhash = (await connection.getLatestBlockhash("finalized"))
      .blockhash;
    createNewTokenTransaction.recentBlockhash = blockhash;
    // createNewTokenTransaction.sign(mintKeypair);

    // const signature = await sendAndConfirmTransaction(
    //   connection,
    //   createNewTokenTransaction,
    //   [mintKeypair]
    // );
    // console.log("signature = ", signature);

    // const signed = await wallet.signTransaction(createNewTokenTransaction);
    // signed.partialSign(mintKeypair)
    // console.log("Singed:: ", signed);
    // if (signed instanceof Transaction) {
    //   const serialized = signed.serialize();
    //   console.log("serialized")
    // }

    const txHash = await sendCreator(
      connection,
      wallet,
      createNewTokenTransaction,
      mintKeypair
    );
    // console.log("Token mint transaction sent. Signature:", signature);
    // console.log("Token Created : ", tokenInfo);
    // console.log("Token Mint Address :", mintKeypair.publicKey.toString());

    return mintKeypair.publicKey;
  };
  return (
    <div className="h-full w-full flex justify-center items-center flex-col gap-8 py-5 token-creater-container">
      <div className="flex flex-col">
        <h1 className="text-[2.8rem] font-bold text-center header-typewriter">
          BLOCKAI Token Creator
        </h1>
        <label className="text-[1rem] text-center">
          Empower your token creation process with the revolutionary
          <br />
          capabilities of artificial intelligence
        </label>
      </div>

      <div className="flex flex-col justify-center gap-4 w-full p-5 rounded-xl border-[1px] border-[var(--borderColor)]">
        <h2 className="text-[1.4rem] text-center">
          Generate. Customize. Deploy.
          <br />
          Create your own token effortlessly with the power of artificial
          intelligence{" "}
        </h2>
        <input
          className="w-full outline-none text-black text-[1rem] rounded-md bg-slate-200 p-1"
          placeholder="Please specify what you'd like your token to be associated with. (e.g: dog, cat, swap etc.)"
          value={prompt}
          onChange={(event) => {
            setPrompt(event.target.value);
          }}
        ></input>
        <Button className="self-center px-4" onClick={onGenerate}>
          Generate
        </Button>
      </div>

      <div className="flex gap-8">
        <div className="flex flex-col">
          <label>NAME</label>
          <Input
            className="rounded-md text-[0.9rem] max-w-36 py-2"
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          ></Input>
        </div>

        <div className="flex flex-col">
          <label>SYMBOL</label>
          <Input
            className="rounded-md text-[0.9rem] max-w-36 py-2"
            type="text"
            value={symbol}
            onChange={(event) => {
              setSymbol(event.target.value);
            }}
          ></Input>
        </div>

        <div className="flex flex-col">
          <label>SUPPLY</label>
          <Input
            className="rounded-md text-[0.9rem] max-w-36 py-2"
            type="number"
            value={supply}
            onChange={(event) => {
              setSupply(event.target.value);
            }}
          ></Input>
        </div>

        <div className="flex flex-col">
          <label>DECIMAL</label>
          <Input
            className="rounded-md text-[0.9rem] max-w-36 py-2"
            type="number"
            value={decimal}
            onChange={(event) => {
              setDecimal(event.target.value);
            }}
          ></Input>
        </div>
      </div>

      <div className="flex flex-col justify-center w-full gap-6">
        {/* <label className="text-center">PUT IMAGE IPFS URI</label> */}
        <div className="flex justify-center items-center gap-3">
          {loader ? (
            <Loader />
          ) : (
            <>
              <h5 className="text-[1.3rem]">Upload Image: </h5>
              <Button
                className="flex justify-center px-6 py-6"
                onClick={onUpload}
              >
                <ArrowUpTrayIcon className="h-9 w-9" />
              </Button>
              <input
                type="file"
                className="file-input file-input-bordered w-full max-w-xs hidden"
                onChange={captureFile}
                ref={hiddenFileInput}
              />
            </>
          )}
          {showLinks ? (
            loader ? (
              <div className="flex justify-center items-center">
                <span class="loading loading-ring loading-lg"></span>
              </div>
            ) : (
              <div className="flex flex-col items-center border-dashed rounded-md border-[1px] border-gray-400 pt-2 px-8">
                <img
                  src={userAvatarUrl}
                  alt="preview"
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <h6 className="text-[0.9rem]">{uploadFile}</h6>
              </div>
            )
          ) : (
            <p></p>
          )}
        </div>
        {showLinks ? (
          loader ? (
            <div className="flex justify-center items-center">
              <span class="loading loading-ring loading-lg"></span>
            </div>
          ) : (
            <label className="text-center">{userAvatarUrl}</label>
          )
        ) : (
          <></>
        )}
      </div>

      <div className="flex justify-around w-full">
        <div className="flex items-center gap-2">
          <ToggleButton checked={freeze} onChange={setFreeze} />
          <label>Revoke Freeze</label>
        </div>
        <div className="flex items-center gap-2">
          <ToggleButton checked={mint} onChange={setMint} />
          <label>Revoke Mint</label>
        </div>
      </div>

      <Button className="px-4" onClick={onCreateToken}>
        CREATE TOKEN
      </Button>

      <div className="flex flex-col justify-center items-center px-7 py-7 border-[1px] border-[var(--borderColor)] rounded-lg text-[var(--helperColor)]">
        <h1 className="text-[2rem] font-bold text-center">Utilization Guide</h1>
        <div className="flex flex-col gap-2 p-4">
          <ol className="flex flex-col text-[1.2rem] gap-4">
            <li className="border-b-[1px] border-[var(--borderColor)]">
              1. Specify the theme you want your token to revolve around.
            </li>
            <li className="border-b-[1px] border-[var(--borderColor)]">
              2. BLOCKAI will provide suggestions for its name, supply, symbol,
              and decimal.
            </li>
            <li className="border-b-[1px] border-[var(--borderColor)]">
              3. If you want to change the suggestions, simply generate new ones
              or fill in the fields yourself.
            </li>
            <li className="border-b-[1px] border-[var(--borderColor)]">
              4. Decide whether you want the ability to revoke freeze and revoke
              mint your token.
            </li>
            <li className="border-b-[1px] border-[var(--borderColor)]">
              5. Finally, create your token by clicking the 'Create' button.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Creator;
