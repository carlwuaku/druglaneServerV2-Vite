import { Table, Model, Column, CreatedAt, DataType, PrimaryKey } from "sequelize-typescript";

@Table({
  tableName: 'db_sync',
  modelName: 'DbSync',
  paranoid: true,
})

export class DbSync extends Model {
  // @PrimaryKey
  // @Column({
  //   type: DataType.INTEGER,
  //   autoIncrement: true
  // })
  // id: number;

  @Column({
    type: DataType.STRING
  })
  declare type: string;

  @Column({
    type: DataType.STRING
  })
  declare action: string;

  @Column({
    type: DataType.STRING
  })
  declare data: string;

  @CreatedAt
  declare created_on: string;
}

