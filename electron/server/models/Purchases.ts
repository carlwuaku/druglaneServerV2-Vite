import { Table, Model, Column, DataType, Index, CreatedAt, PrimaryKey } from "sequelize-typescript";

@Table({
  tableName: 'purchases',
  modelName: 'Purchases',
  paranoid: true,
})

export class Purchases extends Model {

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
  declare vendor: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false
  })
  declare date: string;

  @Column({
    type: DataType.STRING
  })
  declare site: string;

  @Index
  @Column({
    type: DataType.STRING
  })
  declare code: string;

  @Column({
    type: DataType.STRING
  })
  declare status: string;

  @CreatedAt
  declare created_on: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare created_by: number;

  @Index
  @Column({
    type: DataType.STRING
  })
  declare invoice: string;

  @Index
  @Column({
    type: DataType.STRING
  })
  declare payment_method: string;

  @Column({
    type: DataType.DOUBLE
  })
  declare amount_paid: number;

  @Column({
    type: DataType.DATEONLY,
  })
  declare last_payment_date: string;


}



