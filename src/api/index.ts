import { Router } from 'express'
import dripApi from './routes/drip'


export default () => {
    const apiRouter = Router()
    apiRouter.use('v1/webhooks', dripApi)
    return apiRouter
}
