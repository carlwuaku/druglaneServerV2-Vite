import { Column, CreatedAt, DataType, ForeignKey, Index, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Branches } from "./Branches";
import { Users } from "./Users";

@Table({
  tableName: "transfers",
  modelName: 'Transfers',
  paranoid: true,
})

export class Transfers extends Model {
  // @PrimaryKey
  // @Column({
  //   type: DataType.INTEGER,
  //   autoIncrement: true
  // })
  // id: number;

  @ForeignKey(() => Branches)
  @Column({
    type: DataType.INTEGER
  })
  declare receiver: number;

  @Index
  @Column({
    type: DataType.DATEONLY
  })
  declare date: string;

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

  @ForeignKey(() => Users)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare created_by: number;
}

