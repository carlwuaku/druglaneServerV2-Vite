
import { sequelize } from "../config/sequelize-config";
import { Table, Model, Column, DataType, CreatedAt, HasMany, Index, ForeignKey, PrimaryKey } from "sequelize-typescript";
import { Users } from "./Users";

@Table({
  tableName: 'dailyRecords',
  modelName: 'DailyRecords',
  paranoid: true,
})

export class DailyRecords extends Model {


  // @PrimaryKey
  // @Column({
  //   type: DataType.INTEGER,
  //   autoIncrement: true
  // })
  // id: number;


  @Index
  @Column({
    type: DataType.DATEONLY
  })
  declare date: string;


  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0
  })
  declare amount: number;


  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0
  })
  declare pos: number;


  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0
  })
  declare cheque: number;


  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0
  })
  declare insurance: number;


  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0
  })
  declare momo: number;


  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0
  })
  declare cash: number;


  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0
  })
  declare other: number;


  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0
  })
  declare credit: number;


  @Column({
    type: DataType.STRING
  })
  declare shift: string;


  @ForeignKey(() => Users)
  @Column({
    type: DataType.INTEGER
  })
  declare created_by: number;


  @Index
  @CreatedAt
  declare created_on: number;

  computer_sales?: string;
  difference?: number;
  total_sales?: number;

}
