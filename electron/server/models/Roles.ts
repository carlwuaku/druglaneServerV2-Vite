import { Table, Model, Column, DataType, ModelClassGetter,
   CreatedAt, PrimaryKey, HasMany, BelongsToMany, AutoIncrement } from "sequelize-typescript";
import { Permissions } from "./Permissions";
import { RolePermissions } from "./RolePermissions";

@Table({
   tableName: 'roles',
  modelName: 'Roles',
  paranoid: true,
  
})
// @BelongsToMany(Permissions, RolePermissions)

export class Roles extends Model{
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true
  })
  role_id!: number;

  @Column({
    type: DataType.STRING
  })
  role_name!: string;
  @Column({
    type: DataType.STRING
  })
  description!: string;

  @CreatedAt
  created_on!: string;

  // updatedAt!: false;

 
}
