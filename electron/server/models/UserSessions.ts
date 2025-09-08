import { Column, CreatedAt, DataType, ForeignKey, Index, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Users } from "./Users";

@Table({
  tableName: 'user_sessions',
  modelName: 'UserSessions',
  paranoid: true,
})

export class UserSessions extends Model {
  // @PrimaryKey
  // @Column({
  //   type: DataType.INTEGER,
  //   autoIncrement: true
  // })
  // id: number;

  @ForeignKey(() => Users)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare user_id: number;

  @Index
  @Column({
    type: DataType.STRING
  })
  declare token: string;

  @CreatedAt
  declare created_on: string;

  @Column({
    type: DataType.DATEONLY
  })
  declare expires: string;
}

