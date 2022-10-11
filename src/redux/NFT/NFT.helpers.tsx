type payload = {
    provider: Object,
    metamaskWallet: string,
}

export const initNFT = (state: payload) => {
    state.provider = {},
    state.metamaskWallet = ''
}
