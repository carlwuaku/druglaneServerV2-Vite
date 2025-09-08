
import { Table, Model, Column, DataType, CreatedAt, HasMany, ForeignKey, PrimaryKey } from "sequelize-typescript";
import { Users } from "./Users";

@Table({
  tableName: 'dbbackups',
  modelName: 'DbBackups',
  paranoid: true,
})

export class DbBackups extends Model {
  // @PrimaryKey
  // @Column({
  //   type: DataType.INTEGER,
  //   autoIncrement: true
  // })
  // id: number;


  @Column({
    type: DataType.STRING
  })
  declare file_name: string;

  @ForeignKey(() => Users)
  @Column({
    type: DataType.INTEGER
  })
  declare created_by: string;
  @Column({
    type: DataType.STRING
  })
  declare description: string;
  @Column({
    type: DataType.STRING
  })
  declare uploaded: string;
  @Column({
    type: DataType.STRING
  })
  declare db_version: string;
  @CreatedAt
  declare created_on: string;
}
