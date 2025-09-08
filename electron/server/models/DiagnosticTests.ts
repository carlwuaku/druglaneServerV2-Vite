import { Table, Model, Column, CreatedAt, Index, DataType, PrimaryKey } from "sequelize-typescript";

@Table({
  tableName: 'diagnostic_tests',
  modelName: 'DiagnosticTests',
  paranoid: true,
})

export class DiagnosticTests extends Model {
  // @PrimaryKey
  // @Column({
  //   type: DataType.INTEGER,
  //   autoIncrement: true
  // })
  // id: number;

  @Index
  @Column({
    type: DataType.STRING
  })
  declare test_name: string;

  @Column({
    type: DataType.STRING
  })
  declare parameters: string;

  @Column({
    type: DataType.STRING
  })
  declare comments: string;

  @CreatedAt
  declare created_on: string;
}
