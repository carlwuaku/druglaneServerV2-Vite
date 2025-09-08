import { Table, Model, Column, DataType, ForeignKey, Index, CreatedAt, BelongsTo, PrimaryKey } from "sequelize-typescript";
import { Products } from "./Products";
import { Transfers } from "./Transfers";
import { Users } from "./Users";

@Table({
  tableName: 'transfer_details',
  modelName: 'TransferDetails',
  paranoid: true,
})

export class TransferDetails extends Model {
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
  declare cost_price: number;

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
  @ForeignKey(() => Transfers)
  @Column({
    type: DataType.STRING
  })
  declare code: string;

  @Index
  @Column({
    type: DataType.DATEONLY
  })
  declare date: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false
  })
  declare price: number;

  @Column({
    type: DataType.DATEONLY
  })
  declare expiry: string;
}
