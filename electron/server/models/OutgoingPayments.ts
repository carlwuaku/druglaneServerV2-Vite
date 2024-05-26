import { Table, Model, Column, DataType, ForeignKey, CreatedAt, Index, PrimaryKey } from "sequelize-typescript";
import { Users } from "./Users";


@Table({
  tableName: 'outgoing_payments',
  modelName: 'OutgoingPayments',
  paranoid: true,
})

export class OutgoingPayments extends Model{
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true
  })
  id!: number;
  
  @Index
  @Column({
    type: DataType.DATEONLY,
    allowNull: false
  })
  date!: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false
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
  recipient!: string;

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
    type: DataType.INTEGER
  })
  created_by!: number;

    @CreatedAt
  created_on!: string;
}
