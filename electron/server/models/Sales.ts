import { Table, Model, Column, DataType, ForeignKey, Index, CreatedAt, PrimaryKey } from "sequelize-typescript";
import { Customers } from "./Customers";
import { Users } from "./Users";

@Table({
  tableName: "sales",
  modelName: 'Sales',
  paranoid: true,
  createdAt: false
})

export class Sales extends Model{
  // @PrimaryKey
  // @Column({
  //   type: DataType.INTEGER,
  //   autoIncrement: true
  // })
  // id!: number;
  
  @ForeignKey(() => Customers)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: null
  })
  customer!: number;

  @Index
  @Column({
    allowNull: false,
    unique: true,
    type: DataType.STRING
  })
  code!: string;

  @ForeignKey(() => Users)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  created_by!: number;

  @Column({
    type: DataType.DATE
  })
  created_on!: string;

  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0
  })
  amount_paid!: number;

  @Index
  @Column({
    type: DataType.STRING
  })
  payment_method!: string;

  @Index
  @Column({
    type: DataType.STRING
  })
  momo_reference!: string;

  @Index
  @Column({
    type: DataType.STRING
  })
  date!: string;

  @Index
  @Column({
    type: DataType.STRING
  })
  insurance_provider!: string;

  @Index
  @Column({
    type: DataType.STRING
  })
  insurance_member_name!: string;

  @Index
  @Column({
    type: DataType.STRING
  })
  insurance_member_id!: string;

  @Index
  @Column({
    type: DataType.STRING
  })
  creditor_name!: string;

  
  @Column({
    type: DataType.DOUBLE
  })
  credit_paid!: number;

  @Column({
    type: DataType.DOUBLE
  })
  discount!: number;
  
  @Column({
    type: DataType.DOUBLE
  })
  tax!: number;

  @Index
  @Column({
    type: DataType.STRING
  })
  shift!: string;

  total?: number;
  display_name?: string;
  num_of_items?: number;
  total_cost?: number;
}
