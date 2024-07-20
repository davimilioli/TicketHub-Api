import { Request, Response } from "express";
import User from "../models/User";

class UserController {
    static async create(req: Request, res: Response): Promise<void>{
        const { nome, cpf, email, senha, celular, cargo, ativo } = req.body;

        try {

            const newUser = await User.create({
                nome,
                cpf,
                email,
                senha,
                celular,
                cargo: cargo ? cargo : null,
                ativo: ativo ? ativo: 1,
                criado_em: new Date().toString()
            });

            res.status(201).json({
                mensagem: 'Usuário criado com sucesso!',
                usuario: newUser
            });  

        } catch(error){
            res.status(500).json({
                message: 'Erro ao criar usuário',
                error: error
            })
        }
    }

    static async update(req: Request, res: Response): Promise<void> {
        const id: number = parseInt(req.params.id);
        const { email, senha, celular, telefone, cargo, ativo } = req.body;
        const updateDate = new Date().toString();

        try {

            const updateUser: { [key: string]: any } = { updateDate };

            if(email !== undefined){
                updateUser.email = email;
            };

            if(senha !== undefined){
                updateUser.senha = senha;
            };

            if(celular !== undefined){
                updateUser.celular = celular;
            };

            if(telefone !== undefined){
                updateUser.telefone = telefone;
            };

            if(cargo !== undefined){
                updateUser.cargo = cargo;
            };

            if(ativo !== undefined){
                updateUser.ativo = ativo;
            };

            const [ result ] = await User.update(updateUser, {
                where: { id },
            });

            if(result === 0){
                res.status(404).json({ mensagem: `Usuário ${id} não encontrado` });
                return;
            }

        } catch(error){

            res.status(500).json({
                messagem: 'Ocorreu algum erro ao atualizar usuário',
            });
        }
    }

    static async delete(req: Request, res: Response): Promise<void>{
        const id: number = parseInt(req.params.id);
        
        try {

            const user = await User.destroy({ where: {id} });

            if(user === 0){
                res.status(404).json({ mensage: `Usuário ${id} não encontrado` });
                return;
            }

            res.status(200).json({ mensage: `Usuário ${id} excluido` });

        } catch(error){
            res.status(500).json({
                message: 'Ocorreu algum erro ao deletar usuário',
            });
        }
    }

    static async get(req: Request, res: Response): Promise<void>{
        const id: number = parseInt(req.params.id);

        try {
            const user = await User.findByPk(id);

            if(!user){
                res.status(404).json({ mensagem: `Usuário ${id} não encontrado` });
                return;
            }

            res.status(200).json(user);
        } catch(error){
            res.status(500).json({
                message: 'Ocorreu algum erro ao consultar o usuário'
            });
        }
    }

    static async getAll(req: Request, res: Response): Promise<void>{ 
        const page: number = parseInt(req.query.page as string) || 1;
        const pageSize: number = parseInt(req.query.pageSize as string) || 12;

        try {

            const offset = (page - 1) * pageSize;

            const { rows: users, count: total } = await User.findAndCountAll({
                offset: offset,
                limit: pageSize,
                order: [['id', 'ASC']]
            });

            const result = {
                total,
                page,
                pageSize,
                usuarios: users,
            }

            res.status(200).json(result);

        } catch(error){
            res.status(500).json({
                mensage: 'Ocorreu algum erro ao consultar a lista de usuários'
            });
        }

    }

    static async auth(req: Request, res: Response): Promise<void>{
        const { email, senha } = req.body;
        const validEmail = await UserController.searchOne('email', email);
        const validSenha = await UserController.searchOne('senha', senha);

        try {

            if(validEmail && validSenha){

                res.json({ 
                    mensagem: 'Usuário válidado',
                });

            } else {
                res.json({ 
                    mensagem: 'Credenciais inválidas'
                });
            }


        } catch(error){
            res.status(500).json({
                mensagem: 'Erro ao autenticar usuário'
            })
        }
    }

    static async searchOne(column: string, data: string): Promise<boolean>{
        
        try {

            const search =  {
                [column]: data
            }

            const existingData = await User.findOne({ where: search });

            if(!existingData){
                return false;
            } 

            return true;
        }catch(error){

            console.error(error);
            return false;
        }
    }

    static async createUsersFake(){

        const users = [
            {
                nome: "João Silva",
                cpf: 12345678900,
                email: "joao.silva@example.com",
                senha: "senha123",
                celular: 11912345678,
                telefone: 1134567890,
                cargo: 'Gerente',
                ativo: 1
            },
            {
                nome: "Maria Oliveira",
                cpf: 98765432100,
                email: "maria.oliveira@example.com",
                senha: "senha456",
                celular: 21987654321,
                telefone: 2134567890,
                cargo: 'Desenvolvedor',
                ativo: 1
            },
            {
                nome: "Carlos Souza",
                cpf: 45678912300,
                email: "carlos.souza@example.com",
                senha: "senha789",
                celular: 31987654321,
                telefone: 3134567890,
                cargo: 'CEO',
                ativo: 1
            },
            {
                nome: "Ana Pereira",
                cpf: 65432198700,
                email: "ana.pereira@example.com",
                senha: "senha012",
                celular: 41987654321,
                telefone: 4134567890,
                cargo: 'Marketing',
                ativo: 1
            },
            {
                nome: "Lucas Lima",
                cpf: 78912345600,
                email: "lucas.lima@example.com",
                senha: "senha345",
                celular: 51987654321,
                telefone: 5134567890,
                cargo: 'Estagiário',
                ativo: 1
            }
        ];

        try {
 
            for (const data of users) {
                const { nome, cpf, email, senha, celular, telefone, cargo, ativo } = data;
        
                await User.create({
                    nome,
                    cpf,
                    email,
                    senha, 
                    celular,
                    telefone,
                    cargo,
                    ativo,
                    criado_em: new Date().toString(),
                    atualizado_em: new Date().toString()
                });
    
                console.log(`Usuário ${nome} criado`);

            }
            
        }catch(error){
            console.error('Ocorreu algum erro: ', error);
        }
    }
}


export default UserController;