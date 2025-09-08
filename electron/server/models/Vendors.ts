import { Table, Model, Column, CreatedAt, Index, DataType, PrimaryKey } from "sequelize-typescript";

@Table({
  tableName: 'vendors',
  modelName: 'Vendors',
  paranoid: true,

})

export class Vendors extends Model {
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
  declare name: string;

  @Column({
    type: DataType.STRING
  })
  declare location: string;

  @Index
  @Column({
    type: DataType.STRING
  })
  declare phone: string;

  @Index
  @Column({
    type: DataType.STRING
  })
  declare code: string;

  @Index
  @Column({
    type: DataType.STRING
  })
  declare email: string;


  @Column({
    type: DataType.STRING
  })
  declare notes: string;

  @CreatedAt
  declare created_on: string;
  @Column({
    type: DataType.STRING
  })
  declare legacy_id: string;
}




