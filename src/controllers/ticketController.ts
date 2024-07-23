import { Request, Response } from "express";
import Ticket from "../models/Ticket";
import TicketLog from "../models/TicketLog";

class TicketController {

    static async create(req: Request, res: Response) {
        const { id_usuario, solicitante, titulo, descricao, prioridade, prazo_de, prazo_ate, status } = req.body;
        const date = new Date().toString();

        try {

            if (!id_usuario || !solicitante || !titulo || !descricao || !prioridade || !prazo_de || !prazo_ate || !status) {
                res.status(400).json({ message: "Todos os campos são obrigatórios" });
                return;
            }
            
            const newTicket = await Ticket.create({
                id_usuario,
                solicitante,
                titulo,
                descricao,
                prioridade,
                prazo_de,
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
                mensagem: 'Ocorreu algum erro ao atualizar usuário',
            });
        }
    }

    static async createLog(req: Request, res: Response): Promise<void> {
        const { id_ticket, usuario, descricao, tipo } = req.body;
        const para = req.body.para ? req.body.para : '';
        const date = new Date().toString();

        console.log(req.body)
 
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
}

export default TicketController