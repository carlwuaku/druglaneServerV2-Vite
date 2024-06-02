import { Table, Model, Column, DataType,  CreatedAt, ForeignKey, Index, PrimaryKey } from "sequelize-typescript";
import { Customers } from "./Customers";

@Table({
   tableName: 'customer_diagnostics',
  modelName: 'CustomerDiagnostics',
  paranoid: true,

})

export class CustomerDiagnostics extends Model{

  // @PrimaryKey
  // @Column({
  //   type: DataType.INTEGER,
  //   autoIncrement: true
  // })
  // id!: number;
  
  @ForeignKey(() => Customers)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  customer!: number;

  @Column({
    type: DataType.STRING
  })
  test!: string;

  @Column({
    type: DataType.STRING
  })
  data!: string;

  @Column({
    type: DataType.STRING
  })
  comments!: string;

  @Index
  @Column({
    type: DataType.STRING
  })
  date!: string;

  @Index
  @CreatedAt
  created_on!: string;


}
