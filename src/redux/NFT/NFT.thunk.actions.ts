import { createAsyncThunk } from '@reduxjs/toolkit'
import { NFTTypes, WalletAddress } from './NFT.types'

export const getProvider = createAsyncThunk(
    `NFT/getProvider`,
    async (payload: NFTTypes, { getState }) => {
        try{
            return payload;
        }catch(err){
            return err;
        }
    }
)

export const setMetamaskAddress = createAsyncThunk(
    `NFT/setMetamaskAddress`,
    async (payload: WalletAddress ) => {
        return payload;
    }
)