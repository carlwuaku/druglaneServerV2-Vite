
import { Table, Model, Column, DataType, ForeignKey, CreatedAt, Index, PrimaryKey } from "sequelize-typescript";
import { Branches } from "./Branches";
import { Users } from "./Users";


@Table({
  tableName: 'received_transfers',
  modelName: 'ReceivedTransfers',
  paranoid: true,
})

export class ReceivedTransfers extends Model {
  // @PrimaryKey
  // @Column({
  //   type: DataType.INTEGER,
  //   autoIncrement: true
  // })
  // id: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false
  })
  declare date: string;

  @Index
  @Column({
    allowNull: false,
    type: DataType.STRING
  })
  declare code: string;

  @Index
  @Column({
    allowNull: false,
    type: DataType.STRING
  })
  declare invoice: string;

  @CreatedAt
  declare created_on: string;

  @ForeignKey(() => Users)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare created_by: number;

  @ForeignKey(() => Branches)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare sender: number;
}

