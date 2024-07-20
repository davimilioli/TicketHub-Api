import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database";

interface UserAttributes {
    id?: number
    nome: string
    cpf: number
    email: string
    senha: string
    celular: number
    telefone?: number
    cargo?: string
    ativo?: number
    criado_em: string
    atualizado_em?: string
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number
    public nome!: string
    public cpf!: number
    public email!: string
    public senha!: string
    public celular!: number
    public telefone!: number
    public cargo!: string
    public ativo!: number
    public criado_em!: string
    public atualizado_em!: string
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cpf: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        senha: {
            type: DataTypes.STRING,
            allowNull: false
        },
        celular: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        telefone: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        cargo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ativo: {
            type: DataTypes.INTEGER,
            allowNull: true
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
        tableName: 'usuarios',
        modelName: 'Users',
        timestamps: false,
    }
);

export default User;