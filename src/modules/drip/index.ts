import { TransactionReceipt } from 'web3-core'
import { EthT } from 'modules/eth'
import abi from 'modules/drip/abi.json'
import config from 'config'


const MIN_BNB_BALANCE = 0.02


export type DripOptions = {
    action: 'hydrate' | 'claim'
}


export interface IDrip {
    claim(): Promise<TransactionReceipt>
    hydrate(): Promise<TransactionReceipt>
    userInfo(): Promise<any>
}


export const Drip = async (eth: EthT): Promise<IDrip> => {
    const contract = await eth.loadContract(abi, config.dripContractAddress)
    const wallet = await eth.getWallet()

    const {address} = wallet

    const hydrateAbi = await contract.methods.roll().encodeABI()
    const claimAbi = await contract.methods.claim().encodeABI()

    async function execute(abi: string) {
        const signedTxn = await eth.signTransaction(config.dripContractAddress, abi)
        return await eth.sendSignedTransaction(signedTxn.rawTransaction)
    }

    return {
        claim: async (): Promise<TransactionReceipt> => await execute(claimAbi),
        hydrate: async (): Promise<TransactionReceipt> => await execute(hydrateAbi),
        userInfo: async () => await contract.methods.userInfo(address).call()
    }
}

async function run(eth: EthT, options: DripOptions): Promise<TransactionReceipt> {
    const {action} = options
    const bnbBalanceRaw = await eth.getBalance()
    const bnbBalance = Number(bnbBalanceRaw) / 10 ** 18 // There are 10^18 wei in an ether

    if (bnbBalance < MIN_BNB_BALANCE) {
        throw 'BNB balance too low'
    }


    const drip = await Drip(eth)
    let res: TransactionReceipt

    if (action === 'hydrate') {
        res = await drip.hydrate()
    } else if (action === 'claim') {
        res = await drip.claim()
    }

    return res
}

export default {
    run
}