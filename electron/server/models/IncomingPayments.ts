import { sequelize } from "../config/sequelize-config";
import { Table, Model, Column, DataType,  CreatedAt, Index, ForeignKey, PrimaryKey } from "sequelize-typescript";
import { Op } from "sequelize";
import { Users } from "./Users";

@Table({
   tableName: 'incoming_payments',
  modelName: 'IncomingPayments',
  paranoid: true,
})

export class IncomingPayments extends Model{
    
  // @PrimaryKey
  // @Column({
  //   type: DataType.INTEGER,
  //   autoIncrement: true
  // })
  // id!: number;
  
  @Index
  @Column({
    type: DataType.DATEONLY
  })
  date!: string;

  @Column({
    type: DataType.DOUBLE
  })
  amount!: number;

    @Index
    @Column({
      type: DataType.STRING
    })
  type!: string;

    @Index
    @Column({
      type: DataType.STRING
    })
  payer!: string;

    @Index
    @Column({
      type: DataType.STRING
    })
  payment_method!: string;

    @Index
    @Column({
      type: DataType.STRING
    })
  transaction_id!: string;
  @Column({
    type: DataType.STRING
  })
  item_code!: string;


  @Column({
    type: DataType.STRING
  })
  notes!: string;
    
    @ForeignKey(() => Users)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  created_by!: number;

  @Index
  @CreatedAt
  created_on!: string;

  total?: number;
}
