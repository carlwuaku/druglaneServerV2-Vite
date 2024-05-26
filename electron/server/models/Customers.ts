import { Table, Model, Column, DataType,  CreatedAt, HasMany, Index, PrimaryKey } from "sequelize-typescript";
import { CustomerDiagnostics } from "./CustomerDiagnostics";

@Table({
   tableName: 'customers',
  modelName: 'Customers',
  paranoid: true,

})

export class Customers extends Model{

  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true
  })
  id!: number;

  
  @Index
  @Column({
    allowNull: false,
    type: DataType.STRING
  })
  name!: string;

  
  @Column({
    type: DataType.STRING
  })
  sex!: string;

  @Index
  @Column({
    type: DataType.STRING
  })
  phone!: string;

  @Index
  @Column({
    validate: {
      isEmail: true
    },
    type: DataType.STRING
  })
  email!: string;

  @Column({
    validate: {
      isDate: true
    },
    type: DataType.STRING
  })
  date_of_birth!: string;

  @CreatedAt
  created_on!: string;

  @Column({
    type: DataType.STRING
  })
  location!: string;

  @HasMany(() => CustomerDiagnostics)
  customerDiagnostics!: CustomerDiagnostics[];
}
