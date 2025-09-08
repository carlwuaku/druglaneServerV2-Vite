import { Table, Model, Column, DataType, CreatedAt, ForeignKey, Index, PrimaryKey } from "sequelize-typescript";
import { Customers } from "./Customers";

@Table({
  tableName: 'customer_diagnostics',
  modelName: 'CustomerDiagnostics',
  paranoid: true,

})

export class CustomerDiagnostics extends Model {

  // @PrimaryKey
  // @Column({
  //   type: DataType.INTEGER,
  //   autoIncrement: true
  // })
  // id: number;

  @ForeignKey(() => Customers)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare customer: number;

  @Column({
    type: DataType.STRING
  })
  declare test: string;

  @Column({
    type: DataType.STRING
  })
  declare data: string;

  @Column({
    type: DataType.STRING
  })
  declare comments: string;

  @Index
  @Column({
    type: DataType.STRING
  })
  declare date: string;

  @Index
  @CreatedAt
  declare created_on: string;


}
