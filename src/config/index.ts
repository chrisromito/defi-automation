import dotenv from 'dotenv'


dotenv.config()

export default {
    bscChain: process.env.BSC_CHAIN,
    dripContractAddress: process.env.DRIP_CONTRACT_ADDRESS,
    port: process.env.PORT || 8080
}
