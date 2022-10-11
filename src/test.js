// import React, {useRef} from 'react';
// import { Web3Provider } from '@ethersproject/providers';
// import { ethers } from 'ethers';

const metamask_account = '0xc7d08AbB3c555a3743ECcd9Af71F06e8e5157Ff9';
const { useRef } = require('react');
const { Web3Provider } = require('@ethersproject/providers');
const { ethers } = require("ethers");

test('check for right metamask account', async () => {
  const provider = useRef<null>(Web3Provider);
  const _window = global.window?.ethereum;
  if(typeof window !== "undefined" && _window.ethereum){
    provider.current = new ethers.providers.Web3Provider(_window.ethereum);
    await provider.current.send("eth_requestAccounts", []);

    const signer = provider.current.getSigner();
    const address = await signer.getAddress();
    expect(address).toBe(metamask_account);
  }
});