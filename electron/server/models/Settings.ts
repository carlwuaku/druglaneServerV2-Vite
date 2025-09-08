import { Table, Model, Column, Index, DataType } from "sequelize-typescript";

@Table({
  tableName: "settings",
  modelName: 'Settings',
  paranoid: true,
  createdAt: false,
})
export class Settings extends Model {
  @Index
  @Column({
    allowNull: false,
    unique: true,
    type: DataType.STRING
  })
  declare name: string;

  @Column({
    type: DataType.STRING
  })
  declare value: string;

  @Column({
    allowNull: false,
    type: DataType.STRING
  })
  declare module: string;


}


