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

/*     id?: number
    id_usuario: number
    solicitante: string
    titulo: string
    descricao: string
    prioridade: string
    prazo_de: string
    prazo_ate: string
    status: string
    criado_em: string
    atualizado_em: string */

}

export default TicketController