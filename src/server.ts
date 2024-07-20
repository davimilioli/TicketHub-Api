import Express from 'express';
import sequelize from './database';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import userRouters from './routes/userRouters';
import ticketRouters from './routes/ticketRouters'
dotenv.config()

const server = Express();

const port = process.env.PORT || 3000;
server.use(cors());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.use('/api/usuarios/', userRouters);
server.use('/api/tickets/', ticketRouters);

async function initServer(){
    try {

        await sequelize.authenticate();
        await sequelize.sync();

        server.listen(port, () => {
            console.log('Servidor rodando')
        })

    } catch(error){
        console.error('Erro ao conectar ao banco de dados', error);
    }
}

initServer();
