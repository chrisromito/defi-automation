import { Router } from 'express'

import config from '../../config/index'
import drip from 'modules/drip'
import { Eth } from 'modules/eth'


const router = Router()


router.get('/drip', (req, res) => {
    res.status(200).send('Drip service is running on /v1/webhooks/drip')
})

// Process drip claim/hydrate
router.post('/drip', async (req, res) => {
    const {action, key, wallet} = req.body

    try {
        if (!['hydrate', 'claim'].includes(action)) {
            return res.send('Supported actions are \'hydrate\' and \'claim\'')
        }

        const eth = await Eth({wallet, key, chain: config.bscChain})
        const result = await drip.run(eth, {action})
        return res.send(result)
    } catch (error) {
        console.error('error', error)
        return res.send({error})
    }
})

export default router