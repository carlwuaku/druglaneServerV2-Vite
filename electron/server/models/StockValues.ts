import { Column, CreatedAt, DataType, Index, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
  tableName: "stock_values",
  modelName: 'StockValues',
  paranoid: true,
})

export class StockValues extends Model {
  // @PrimaryKey
  // @Column({
  //   type: DataType.INTEGER,
  //   autoIncrement: true
  // })
  // id: number;

  @Index
  @Column({
    type: DataType.DATEONLY,
    unique: true,
    validate: {
      isDate: true
    }
  })
  declare date: string;

  @Column({
    type: DataType.DATEONLY
  })
  declare last_modified: string;

  @Index
  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    defaultValue: 0
  })
  declare selling_value: number;

  @Index
  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    defaultValue: 0
  })
  declare cost_value: number;

  @CreatedAt
  declare created_on: string;

}
