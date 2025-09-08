import { Table, Model, Column, DataType, ForeignKey, Index, CreatedAt, BelongsTo, PrimaryKey } from "sequelize-typescript";
import { Products } from "./Products";
import { Purchases } from "./Purchases";
import { Users } from "./Users";

@Table({
  tableName: 'purchase_details',
  modelName: 'PurchaseDetails',
  paranoid: true,
})

export class PurchaseDetails extends Model {
  // @PrimaryKey
  // @Column({
  //   type: DataType.INTEGER,
  //   autoIncrement: true
  // })
  // id: number;


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
  declare selling_price: number;

  @Column({
    type: DataType.DATEONLY
  })
  declare expiry: string;
}
