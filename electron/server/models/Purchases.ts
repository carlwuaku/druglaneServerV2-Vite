import { Table, Model, Column, DataType, Index, CreatedAt, PrimaryKey } from "sequelize-typescript";

@Table({
   tableName: 'purchases',
  modelName: 'Purchases',
  paranoid: true,
})

export class Purchases extends Model{

  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true
  })
  id!: number;

  
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  vendor!: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false
  })
  date!: string;

  @Column({
    type: DataType.STRING
  })
  site!: string;

  @Index
  @Column({
    type: DataType.STRING
  })
  code!: string;

  @Column({
    type: DataType.STRING
  })
  status!: string;

  @CreatedAt
  created_on!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  created_by!: number;

  @Index
  @Column({
    type: DataType.STRING
  })
  invoice!: string;

  @Index
  @Column({
    type: DataType.STRING
  })
  payment_method!: string;

  @Column({
    type: DataType.DOUBLE
  })
  amount_paid!: number;

  @Column({
    type: DataType.DATEONLY,
  })
  last_payment_date!: string;

  
}



