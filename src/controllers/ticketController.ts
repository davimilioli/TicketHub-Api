import { Request, Response } from "express";
import Ticket from "../models/Ticket";
import TicketLog from "../models/TicketLog";
import User from "../models/User";

class TicketController {

    static async create(req: Request, res: Response) {
        const { id_usuario, solicitante, titulo, descricao, prioridade, prazo_de, prazo_ate, status } = req.body;
        const date = new Date().toString();

        try {

            if (!id_usuario || !solicitante || !titulo || !descricao || !prioridade || !prazo_ate || !status) {
                res.status(400).json({ message: "Todos os campos são obrigatórios" });
                return;
            }
            
            const newTicket = await Ticket.create({
                id_usuario,
                solicitante,
                titulo,
                descricao,
                prioridade,
                prazo_de: prazo_de ? prazo_de : date,
                prazo_ate,
                status,
                criado_em: date,
            });

            res.status(201).json({
                mensagem: 'Ticket criado com sucesso!',
                ticket: newTicket
            })

        } catch(error){
            res.status(500).json({
                mensagem: 'Ocorreu algum erro ao criar o ticket',
            });
        }
    }

    static async createLog(req: Request, res: Response): Promise<void> {
        const { id_ticket, usuario, descricao, tipo, para = '' } = req.body;
        const date = new Date().toString();
 
        try {

            const newLog = await TicketLog.create({
                id_ticket,
                usuario,
                descricao,
                tipo,
                para,
                criado_em: date
            });

            res.status(201).json({
                mensagem: 'Log criado com sucesso!',
                ticket: newLog
            });

        } catch(error){
            console.log(error);
            res.status(500).json({
                mensagem: 'Ocorreu algum erro ao criar o log',
            })
        } 
    }

    static async get(req: Request, res: Response): Promise<void> {
        const id:number = parseInt(req.params.id);

        try {

            const ticket = await Ticket.findByPk(id);

            if(!ticket){
                res.status(404).json({ mensagem: `Ticket ${id} não encontrado` });
                return;
            }

            const ticketLog = await TicketLog.findAll({  where: { id_ticket: id } });

            res.status(200).json({
                ...ticket.toJSON(),
                historico: ticketLog
            })

        } catch (error){
            res.status(500).json({
                mensagem: 'Ocorreu algum erro ao consultar o ticket',
            })
        }
        
    }

    static async getAll(req: Request, res: Response): Promise<void> {
        const page: number = parseInt(req.query.page as string) || 1;
        const pageSize: number = parseInt(req.query.pageSize as string) || 12;

        try {

            const offset = (page - 1) * pageSize;

            const { rows: tickets, count: total } = await Ticket.findAndCountAll({
                offset: offset,
                limit: pageSize,
                order: [['id', 'ASC']]
            });

            const ticketContainsLog = await Promise.all(tickets.map(async ticket => {
                const ticketLog = await TicketLog.findAll({ where: { id_ticket: ticket.id } });
                return {
                    ...ticket.toJSON(),
                    historico: ticketLog
                }
            }));

            res.status(200).json({
                total,
                page,
                pageSize,
                tickets: ticketContainsLog,
            });

        } catch (error){
            res.status(500).json({
                mensagem: 'Ocorreu algum erro ao consultar os tickets',
            })
        }
        
    }

    static async delete(req: Request, res: Response): Promise<void>{
        const id: number = parseInt(req.params.id);
        
        try {

            const ticket = await Ticket.destroy({ where: {id} });


            if(ticket === 0){
                res.status(404).json({ mensagem: `Ticket ${id} não encontrado` });
                return;
            }

            await TicketLog.destroy({ where: { id_ticket: id } });

            res.status(200).json({ mensagem: `Ticket ${id} excluido` });

        } catch(error){
            res.status(500).json({
                mensagem: 'Ocorreu algum erro ao deletar o ticket',
            });
        }
    }

    static async transferTicket(req: Request, res: Response) {
        const id_solicitado: number = parseInt(req.body.id_solicitado);
        const id_ticket: number = parseInt(req.body.id_ticket);
        const id_transfer: number = parseInt(req.body.id_transfer);
        const date = new Date().toISOString();

        try {
            const ticket = await Ticket.findByPk(id_ticket);

            if (!ticket) {
                res.status(404).json({
                    mensagem: 'Ticket não encontrado',
                });

                return;
            }

            if (ticket.id_usuario !== id_solicitado) {
                res.status(403).json({
                    mensagem: 'Usuário não tem permissão para transferir este ticket',
                });

                return;
            }

            const requestUser = await User.findByPk(ticket.id_usuario);
            const newUser = await User.findByPk(id_transfer);

            if (!requestUser || !newUser) {
                res.status(404).json({
                    mensagem: 'Usuário não encontrado',
                });
                return;
            }

            ticket.id_usuario = id_transfer;
            ticket.atualizado_em = date;
            await ticket.save();
            
            await TicketLog.create({
                id_ticket,
                usuario: requestUser.nome,
                descricao: `Ticket transferido para o usuário ${newUser.nome}`,
                tipo: 'Altera Responsabilidade',
                para: newUser.nome,
                criado_em: date
            });
            
            res.status(200).json({
                mensagem: 'Ticket transferido com sucesso',
            });

        } catch(error){
            console.log(error)
            res.status(500).json({
                mensagem: 'Ocorreu algum erro ao transferir o ticket',
            });
        }
    }

    static async update(req: Request, res: Response): Promise<void> {
        const id_ticket = parseInt(req.params.id_ticket);
        const id_usuario = parseInt(req.body.id_usuario);
        const { titulo, descricao, prioridade, status } = req.body;
        const date = new Date().toISOString();

        try {
            const ticket = await Ticket.findByPk(id_ticket);

            if (!ticket) {
                res.status(404).json({
                    mensagem: 'Ticket não encontrado',
                });

                return;
            }

            if (ticket.id_usuario !== id_usuario) {
                console.log('ID Ticket:', ticket.id_usuario, 'ID usuario:', id_usuario)
                res.status(403).json({
                    mensagem: 'Usuário não tem permissão para editar este ticket',
                });

                return;
            }

            const updateTicket: Partial<typeof ticket> = { atualizado_em: date };

            if (titulo !== undefined) updateTicket.titulo = titulo;
            if (descricao !== undefined) updateTicket.descricao = descricao;
            if (prioridade !== undefined) updateTicket.prioridade = prioridade;
            if (status !== undefined) updateTicket.status = status;

            const [result] = await Ticket.update(updateTicket, {
                where: { id: id_ticket },
            });

            if (result === 0) {
                res.status(404).json({
                    mensagem: 'Ticket não encontrado',
                });

                return;
            }

            res.status(200).json({
                mensagem: 'Ticket atualizado com sucesso',
                ticket: updateTicket,
            });

        } catch (error) {
            res.status(500).json({
                mensagem: 'Ocorreu algum erro ao atualizar o ticket',
            });
        }
    }

}

export default TicketController