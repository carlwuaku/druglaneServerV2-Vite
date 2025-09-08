import { sequelize } from "../config/sequelize-config";
import { Table, Model, Column, DataType, CreatedAt, Index, ForeignKey, PrimaryKey } from "sequelize-typescript";
import { Op } from "sequelize";
import { Users } from "./Users";

@Table({
  tableName: 'incoming_payments',
  modelName: 'IncomingPayments',
  paranoid: true,
})

export class IncomingPayments extends Model {

  // @PrimaryKey
  // @Column({
  //   type: DataType.INTEGER,
  //   autoIncrement: true
  // })
  // id: number;

  @Index
  @Column({
    type: DataType.DATEONLY
  })
  declare date: string;

  @Column({
    type: DataType.DOUBLE
  })
  declare amount: number;

  @Index
  @Column({
    type: DataType.STRING
  })
  declare type: string;

  @Index
  @Column({
    type: DataType.STRING
  })
  declare payer: string;

  @Index
  @Column({
    type: DataType.STRING
  })
  declare payment_method: string;

  @Index
  @Column({
    type: DataType.STRING
  })
  declare transaction_id: string;
  @Column({
    type: DataType.STRING
  })
  declare item_code: string;


  @Column({
    type: DataType.STRING
  })
  declare notes: string;

  @ForeignKey(() => Users)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare created_by: number;

  @Index
  @CreatedAt
  declare created_on: string;

  total?: number;
}
