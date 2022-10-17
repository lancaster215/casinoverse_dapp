import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { getProvider, setMetamaskAddress } from './NFT.thunk.actions';
import { NFTTypes, WalletAddress } from './NFT.types';

const initialState = {
    provider: {},
    metamaskAddress: '',
}

export const NFTslice = createSlice({
    name: 'NFT',
    initialState,
    reducers: {
        _getProvider: (
            state: NFTTypes,
            action: PayloadAction<Object>
        ) => {
            state.provider = action.payload
        },
        _setMetamaskAddress: (
            state: WalletAddress ,
            action: PayloadAction<string>
        ) => {
            state.metamaskAddress = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getProvider.fulfilled, (state: any, action) => {
            state.provider = action.payload;
            return
        })
        builder.addCase(setMetamaskAddress.fulfilled, (state: any, action) => {
            state.metamaskAddress = action.payload;
            return
        })
        return
    },
})

export const {
    _getProvider,
    _setMetamaskAddress,
} = NFTslice.actions

export default NFTslice
