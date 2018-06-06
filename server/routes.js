import Controllers from './controllers'

const routes = {
    "player/:player": {
        method: 'GET',
        action: Controllers.PlayerController.get
    }
}

export default routes