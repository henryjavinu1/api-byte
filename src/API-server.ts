import {Server} from './index'
import dotenv from 'dotenv'

dotenv.config()

const server = new Server()

server.start()