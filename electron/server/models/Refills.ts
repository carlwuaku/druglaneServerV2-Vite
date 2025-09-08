
import { Table, Model, Column, DataType, ForeignKey, CreatedAt, Index, PrimaryKey } from "sequelize-typescript";
import { Customers } from "./Customers";
import { Products } from "./Products";
import { Users } from "./Users";


@Table({
  tableName: 'refills',
  modelName: 'Refills',
  paranoid: true,
})

export class Refills extends Model {
  // @PrimaryKey
  // @Column({
  //   type: DataType.INTEGER,
  //   autoIncrement: true
  // })
  // id: number;

  @Index
  @Column({
    type: DataType.STRING
  })
  declare product: string;

  @ForeignKey(() => Products)
  @Column({
    type: DataType.INTEGER,
    allowNull: true
  })
  declare product_id: number;

  @Column({
    type: DataType.DOUBLE,
    defaultValue: 1
  })
  declare quantity: number;

  @Index
  @Column({
    type: DataType.DATEONLY,
    allowNull: false
  })
  declare start_date: string;

  @Index
  @Column({
    type: DataType.DATEONLY,
  })
  declare end_date: string;

  @ForeignKey(() => Users)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare created_by: number;

  @Index
  @Column({
    type: DataType.STRING
  })
  declare status: string;

  @ForeignKey(() => Customers)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare customer_id: number;

  @Column({
    type: DataType.STRING
  })
  declare customer_name: string;

  @CreatedAt
  declare created_on: string;

}
