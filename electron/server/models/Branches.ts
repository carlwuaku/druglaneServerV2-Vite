import { Table, Model, Column, DataType, PrimaryKey, CreatedAt, Index } from "sequelize-typescript";

@Table({
  tableName: 'branches',
  modelName: 'Branches',
  paranoid: true,
})

export class Branches extends Model {
  // @PrimaryKey
  // @Column({
  //   type: DataType.INTEGER,
  //   autoIncrement: true
  // })
  // id: number;

  @Index
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare location: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare address: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare email: string;

  @CreatedAt
  declare created_on: string;

}