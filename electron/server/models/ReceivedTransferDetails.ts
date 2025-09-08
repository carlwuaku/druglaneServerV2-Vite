
import { Table, Model, Column, DataType, ForeignKey, CreatedAt, Index, BelongsTo, PrimaryKey } from "sequelize-typescript";
import { Products } from "./Products";
import { ReceivedTransfers } from "./ReceivedTransfers";
import { Users } from "./Users";


@Table({
  tableName: 'received_transfer_details',
  modelName: 'ReceivedTransferDetails',
  paranoid: true,
})

export class ReceivedTransferDetails extends Model {
  // @PrimaryKey
  // @Column({
  //   type: DataType.INTEGER,
  //   autoIncrement: true
  // })
  // id: number;


  @ForeignKey(() => Products)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare product: number;

  @Index
  @Column({
    type: DataType.DOUBLE,
    allowNull: false
  })
  declare quantity: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false
  })
  declare price: number;

  @Column({
    type: DataType.STRING
  })
  declare unit: string;

  @CreatedAt
  declare created_on: string;

  @ForeignKey(() => Users)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare created_by: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false
  })
  declare markup: number;

  @Index
  @ForeignKey(() => ReceivedTransfers)
  @Column({
    type: DataType.STRING
  })
  declare code: string;

  @Index
  @Column({
    type: DataType.STRING
  })
  declare date: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false
  })
  declare selling_price: number;

  // @BelongsTo(() => ReceivedTransfers, 'code')
}
