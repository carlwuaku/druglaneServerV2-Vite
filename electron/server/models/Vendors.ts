import { Table, Model, Column, CreatedAt, Index, DataType, PrimaryKey } from "sequelize-typescript";

@Table({
   tableName: 'vendors',
  modelName: 'Vendors',
  paranoid: true,
  
})

export class Vendors extends Model{
  // @PrimaryKey
  // @Column({
  //   type: DataType.INTEGER,
  //   autoIncrement: true
  // })
  // id!: number;
  
  @Index
  @Column({
    type: DataType.STRING
  })
  name!: string;

  @Column({
    type: DataType.STRING
  })
  location!: string;

  @Index
  @Column({
    type: DataType.STRING
  })
  phone!: string;

  @Index
  @Column({
    type: DataType.STRING
  })
  code!: string;

  @Index
  @Column({
    type: DataType.STRING
  })
  email!: string;

 
  @Column({
    type: DataType.STRING
  })
  notes!: string;

  @CreatedAt
  created_on!: string;
  @Column({
    type: DataType.STRING
  })
  legacy_id!: string;
}




