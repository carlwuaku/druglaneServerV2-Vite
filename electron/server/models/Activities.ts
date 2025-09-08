import { Table, Model, Column, DataType, PrimaryKey, CreatedAt, ForeignKey } from "sequelize-typescript";
import { Users } from "./Users";

@Table({
    tableName: 'activities',
    modelName: 'Activities',
    paranoid: true,
})

export class Activities extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare activity: string;

    @PrimaryKey
    @Column({
        type: DataType.BIGINT,
        autoIncrement: true
    })
    declare activity_id: string;

    @ForeignKey(() => Users)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare user_id: number;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare module: string;



    @CreatedAt
    declare created_on: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        defaultValue: 0
    })
    declare deleted: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        defaultValue: 0
    })
    declare object_id: string;

}