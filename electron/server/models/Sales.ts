import { Table, Model, Column, DataType, ForeignKey, Index, CreatedAt, PrimaryKey } from "sequelize-typescript";
import { Customers } from "./Customers";
import { Users } from "./Users";

@Table({
  tableName: "sales",
  modelName: 'Sales',
  paranoid: true,
  createdAt: false
})

export class Sales extends Model {
  // @PrimaryKey
  // @Column({
  //   type: DataType.INTEGER,
  //   autoIncrement: true
  // })
  // id: number;

  @ForeignKey(() => Customers)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: null
  })
  declare ustomer: number;

  @Index
  @Column({
    allowNull: false,
    unique: true,
    type: DataType.STRING
  })
  declare code: string;

  @ForeignKey(() => Users)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare created_by: number;

  @Column({
    type: DataType.DATE
  })
  declare created_on: string;

  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0
  })
  declare amount_paid: number;

  @Index
  @Column({
    type: DataType.STRING
  })
  declare payment_method: string;

  @Index
  @Column({
    type: DataType.STRING
  })
  declare momo_reference: string;

  @Index
  @Column({
    type: DataType.STRING
  })
  declare date: string;

  @Index
  @Column({
    type: DataType.STRING
  })
  declare insurance_provider: string;

  @Index
  @Column({
    type: DataType.STRING
  })
  declare insurance_member_name: string;

  @Index
  @Column({
    type: DataType.STRING
  })
  declare insurance_member_id: string;

  @Index
  @Column({
    type: DataType.STRING
  })
  declare creditor_name: string;


  @Column({
    type: DataType.DOUBLE
  })
  declare credit_paid: number;

  @Column({
    type: DataType.DOUBLE
  })
  declare discount: number;

  @Column({
    type: DataType.DOUBLE
  })
  declare tax: number;

  @Index
  @Column({
    type: DataType.STRING
  })
  declare shift: string;

  total?: number;
  display_name?: string;
  num_of_items?: number;
  total_cost?: number;
}
