import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database";
import User from "./User";

interface TicketAttributes {
    id?: number
    id_usuario: number
    solicitante: string
    titulo: string
    descricao: string
    prioridade: 'Baixa' | 'Normal' | 'Alta' | 'Urgente'
    prazo_de: string
    prazo_ate: string
    status: 'Ativo' | 'Inativo'
    criado_em: string
    atualizado_em?: string
};

interface TicketCreationAttributes extends Optional<TicketAttributes, 'id'>{}

class Ticket extends Model<TicketAttributes, TicketCreationAttributes> implements TicketAttributes {
    public id!: number
    public id_usuario!: number
    public solicitante!: string
    public titulo!: string
    public descricao!: string
    public prioridade!: 'Baixa' | 'Normal' | 'Alta' | 'Urgente'
    public prazo_de!: string
    public prazo_ate!: string
    public status!: 'Ativo' | 'Inativo'
    public criado_em!: string
    public atualizado_em!: string
}

Ticket.init (
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
            model: User,
            key: "id",
            },
        },
        solicitante: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        titulo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        prioridade: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        prazo_de: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        prazo_ate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        criado_em: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        atualizado_em: {
            type: DataTypes.DATE,
            allowNull: true
        },
    },
    {
        sequelize,
        modelName: "Ticket",
        tableName: "tickets",
        timestamps: false,
    },
);

Ticket.belongsTo(User, {
    foreignKey: "id_usuario",
    as: "usuario",
});

export default Ticket;