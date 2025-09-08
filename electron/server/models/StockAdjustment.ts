import { Column, CreatedAt, DataType, ForeignKey, Index, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Products } from "./Products";
import { Users } from "./Users";

@Table({
  tableName: "stock_adjustment",
  modelName: 'StockAdjustment',
  paranoid: true,
})

export class StockAdjustment extends Model {
  // @PrimaryKey
  // @Column({
  //   type: DataType.INTEGER,
  //   autoIncrement: true
  // })
  // id: number;

  @Index
  @Column({
    type: DataType.DATEONLY,
    validate: {
      isDate: true
    }
  })
  declare date: string;


  @ForeignKey(() => Products)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare product: number;

  @Index
  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isNumeric: true,
      notNull: true
    }
  })
  declare quantity_counted: number;

  @Index
  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isNumeric: true
    }
  })
  declare quantity_expected: number;


  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isNumeric: true,
      notNull: true
    }
  })
  declare current_price: number;

  @ForeignKey(() => Users)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  declare created_by: number;

  @Column({
    allowNull: true,
    type: DataType.STRING
  })
  declare code: string;

  @CreatedAt
  declare created_on: string;


  @Column({
    type: DataType.STRING
  })
  declare category: string;

  @Column({
    type: DataType.STRING
  })
  declare size: string;

  @Column({
    type: DataType.DATEONLY,
    validate: {
      isDate: true,
    }
  })
  declare expiry: string;

  @Column({
    type: DataType.STRING
  })
  declare comments: string;

  @Index
  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0,
    validate: {
      isNumeric: true
    }
  })
  declare quantity_expired: number;

  @Index
  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0,
    validate: {
      isNumeric: true
    }
  })
  declare quantity_damaged: number;


  @Column({
    type: DataType.STRING
  })
  declare unit: string;


}




