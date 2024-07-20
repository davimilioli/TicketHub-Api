import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database";
import Ticket from "./Ticket";

interface TicketLogAttributes {
    id?: number
    id_ticket: number
    usuario: string
    data: string
    tipo: string
    para?: string
}

interface TicketLogCreationAttributes extends Optional<TicketLogAttributes, 'id'> {}

class TicketLog extends Model<TicketLogAttributes, TicketLogCreationAttributes> implements TicketLogAttributes {
    public id!: number
    public id_ticket!: number
    public usuario!: string
    public data!: string
    public tipo!: string
    public para!: string
}

TicketLog.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        id_ticket: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Ticket,
                key: "id",
            }
        },
        usuario: {
            type: DataTypes.STRING,
            allowNull: false,
          },
        data: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        para: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "TicketLog",
        tableName: "ticketLog",
    }
);

Ticket.hasMany(TicketLog, {
    foreignKey: "id_ticket",
    as: "ticketLog",
});

TicketLog.belongsTo(Ticket, {
    foreignKey: "id_ticket",
    as: "ticket",
});

export default TicketLog;