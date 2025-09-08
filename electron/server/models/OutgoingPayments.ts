import { Table, Model, Column, DataType, ForeignKey, CreatedAt, Index, PrimaryKey } from "sequelize-typescript";
import { Users } from "./Users";


@Table({
  tableName: 'outgoing_payments',
  modelName: 'OutgoingPayments',
  paranoid: true,
})

export class OutgoingPayments extends Model {
  // @PrimaryKey
  // @Column({
  //   type: DataType.INTEGER,
  //   autoIncrement: true
  // })
  // id: number;

  @Index
  @Column({
    type: DataType.DATEONLY,
    allowNull: false
  })
  declare date: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false
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
  declare recipient: string;

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
    type: DataType.INTEGER
  })
  declare created_by: number;

  @CreatedAt
  declare created_on: string;
}
