import * as React from "react";
import { useRef } from "react";
import "./App.css";
import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import abi from "./abi.json";
import { _setMetamaskAddress } from "./redux/NFT/NFT.slice";
import { useAppDispatch } from "./redux/store";
import { Stack } from "@mui/system";
import {
  ListItem,
  TextField,
  Button,
  Box,
  List,
  Typography,
} from "@mui/material";
import BasicModal from "./Components/Modal";
import { Loader } from './Components/Loader';

type WindowWithEthereum = Window & typeof globalThis & { ethereum: any };
type MintingTypes = {
  value: string;
  error: string | {};
  openErrModal: boolean;
};

function App() {
  const provider = useRef<Web3Provider | null>(null);
  const contract = useRef<ethers.Contract | null>();
  const currentAccount = provider.current?.getSigner();
  const [address, setAddress] = React.useState<string>();
  const [costing, setCosting] = React.useState<number>();
  const [balance, setBalance] = React.useState<number>();
  const [gasPrice, setGasPrice] = React.useState<number>();
  const [mintableAssets, setMintableAssets] =
    React.useState<Array<React.ReactNode>>();
  const [isLoadingforMintableAssets, setIsLoadingforMintableAssets] = React.useState<boolean>(false);
  const [mintableAssetLimit, setMintableAssetLimit] = React.useState<number>(0);
  const [maxSupply, setMaxSupply] = React.useState<number>();
  const [mintingVal, setMintingVal] = React.useState<MintingTypes>({
    value: "",
    error: "",
    openErrModal: false,
  });
  const dispatch = useAppDispatch();

  //Connect to Metamask

  const connectToWeb3 = async () => {
    const _window = window as WindowWithEthereum;
    if (typeof window !== "undefined" && _window.ethereum) {
      provider.current = new ethers.providers.Web3Provider(_window.ethereum);
      // dispatch(getProvider(new ethers.providers.Web3Provider(_window.ethereum)));

      await provider.current.send("eth_requestAccounts", []);

      const signer = provider.current.getSigner();
      dispatch(_setMetamaskAddress(await signer.getAddress()));

      let gasPrice = await signer.getGasPrice();
      console.log(gasPrice)
      setGasPrice(parseInt(gasPrice.toString()));
      setAddress(await signer.getAddress());
    }
  };

  // Connect to smart contract address
  const connectToContract = async () => {
    const address = "0x193b8eb78cC22323fF383B27Fdd053c2edF954bf";
    const _abi = `${abi.result}`;
    const _contract = new ethers.Contract(
      address,
      JSON.parse(_abi),
      provider.current as ethers.providers.Provider
    );

    //Here are the built in methods;
    contract.current = _contract;
    // console.log(contract.current.address)
  };

  const getBalance = async () => {
    if (!contract.current) return;
    if (!currentAccount) return;

    const balance = await contract.current
      .connect(currentAccount!)
      .balanceOf(address);
    setBalance(balance.toString());
  };

  const showMintableAssets = async () => {
    if (!contract.current) return;
    if (!currentAccount) return;
    setIsLoadingforMintableAssets(true);

    const _max_supply = await contract.current
      .connect(currentAccount!)
      .maxSupply();
    const max_supply = _max_supply.toString();
    let owners: any[] = [];
    let count = 0;

    for (let x = 1; x <= max_supply; x++) {
      try {
        owners.push(await contract.current.connect(currentAccount!).ownerOf(x));
      } catch (err) {
        owners.push(`${x} is unminted`);
      }
    }
    setMaxSupply(max_supply);
    let filteredArr = owners.filter(() => {
      if (count < mintableAssetLimit) {
        count++;
        return true;
      } else {
        return false;
      }
    });
    setIsLoadingforMintableAssets(false);
    setMintableAssets(filteredArr);
  };

  const mintAsset = async (amount: number) => {
    if (!contract.current) return;
    if (!currentAccount) return;

    let minting;

    try {
      // mint(1, {}) 1 is one of the unminted asset. 
      minting = await contract.current.connect(currentAccount!).mint(2, {
        value: ethers.utils.parseEther(`${amount}`),
      });
      setMintingVal({ error: "", value: minting, openErrModal: false });
    } catch (err) {
      console.log('error')
      setMintingVal({ value: "", error: "Insufficient funds for intrinsic transaction cost", openErrModal: true });
    }
  };

  const getCosting = async () => {
    if (!contract.current) return;
    if (!currentAccount) return;

    const costing = await contract.current.connect(currentAccount!).cost();
    let calc = parseInt(costing.toString()) / 10 ** 18;
    setCosting(calc);
  };

  const isTransactionMined = async (txHash: string) => {
    console.log(txHash);
    const txReceipt = await provider.current?.getTransactionReceipt(txHash);
    console.log(txReceipt);
    if (txReceipt && txReceipt.blockNumber) {
      return txReceipt ? true : false;
    }
  };

  const assetsLimitCount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInputVal = parseInt(e.target.value);
    if (userInputVal > maxSupply!) return;
    return setMintableAssetLimit(parseInt(e.target.value));
  };

  React.useEffect(() => {
    connectToWeb3();
    connectToContract();
    console.log(localStorage.getItem("pending"))
    if (localStorage.getItem("pending")) {
      isTransactionMined(localStorage.getItem("pending")!);

      localStorage.removeItem("pending");
    }
  }, [mintableAssetLimit, mintingVal, mintableAssets]);

  return (
    <div className="App">
      <header className="App-header">

        {address ? 
          <>
            <Typography variant="h3">Hello</Typography>
            <Typography variant="h4">{address}</Typography>

            <Stack direction="row" spacing={2}>
              <ListItem>
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 1, width: "20vw" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    color="primary"
                    id="outlined-basic"
                    label="Enter Limit Count of Mintable Asset:"
                    variant="outlined"
                    onChange={assetsLimitCount}
                    value={mintableAssetLimit}
                  />
                </Box>
              </ListItem>
              <ListItem style={{ display: "block" }}>
                <Button onClick={showMintableAssets} variant="contained">
                  List Mintable Assets
                </Button>
                <>
                {isLoadingforMintableAssets && <Loader/> }
                </>
                <List>
                  {mintableAssets?.map((asset) => {
                    return (
                      <ListItem>
                        <Typography variant="h6">{asset}</Typography>
                      </ListItem>
                    );
                  })}
                </List>
              </ListItem>
            </Stack>

            <div
              style={{
                display: "flex",
                position: "absolute",
                right: "0.5em",
                top: "0.5em",
              }}
            >
              <Typography>Gas Fees/Price: {gasPrice}</Typography>
            </div>

            <Stack direction="row" spacing={5} style={{ width: "50%" }}>
              <ListItem style={{ justifyContent: "center" }}>
                <Button variant="contained" onClick={getBalance}>
                  Get Balance
                </Button>
                <Typography>{balance}</Typography>
              </ListItem>
              <ListItem style={{ justifyContent: "center" }}>
                <Button variant="contained" onClick={getCosting}>
                  Get Costing
                </Button>
                <Typography>{costing}</Typography>
              </ListItem>
            </Stack>

            <Button variant="contained" onClick={() => mintAsset(costing!)}>
              Mint Asset
            </Button>

            <BasicModal
              text={{
                modalTextHeader: "Error",
                modalTexBody: mintingVal.error,
                isOpen: mintingVal.openErrModal,
                handleClose: () =>
                  setMintingVal({ value: "", error: "", openErrModal: false }),
              }}
            />
          </>
          :
          <>
            <Typography>Hello!</Typography>
            <Typography>You need to sign up first to Metamask. Install Metamask extension first and it will prompt shortly after.</Typography>
          </>
        }
      </header>
    </div>
  );
}

export default App;