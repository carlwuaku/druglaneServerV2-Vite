import { Table, Model, Column, DataType, CreatedAt, ForeignKey, Index, BelongsTo, PrimaryKey } from "sequelize-typescript";
import { Permissions } from "./Permissions";
import { Roles } from "./Roles";

@Table({
  tableName: 'users',
  modelName: 'Users',
  paranoid: true,
})


export class Users extends Model {
  // @PrimaryKey
  // @Column({
  //   type: DataType.INTEGER,
  //   autoIncrement: true
  // })
  // id!: number;

  @ForeignKey(() => Roles)
  @Column({
    type: DataType.INTEGER
  })
  declare role_id: number;

  @Index
  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  declare email: string;

  @Index
  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true
  })
  declare username: string;

  @Index
  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  declare password_hash?: string;

  @Column({
    allowNull: true,
    type: DataType.DATEONLY,
  })
  declare last_login: string;

  @Column({
    type: DataType.TEXT
  })
  declare last_ip: string;

  @CreatedAt
  declare created_on: string;

  @Column({
    type: DataType.STRING
  })
  declare display_name: string;

  @Index
  @Column({
    type: DataType.INTEGER,
    defaultValue: 1,
    allowNull: false
  })
  declare active: number;

  @Column({
    type: DataType.STRING
  })
  declare last_seen: string;

  @Index
  @Column({
    allowNull: false,
    type: DataType.TEXT,
    unique: true
  })
  declare phone: string;

  token!: string;
  role: any;
  type!: string;

  @BelongsTo(() => Roles)
  declare userRole: Roles;

  permissions?: Permissions[]
}
