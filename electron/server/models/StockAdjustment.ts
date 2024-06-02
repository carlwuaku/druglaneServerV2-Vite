import { Column, CreatedAt, DataType, ForeignKey, Index, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Products } from "./Products";
import { Users } from "./Users";

@Table({
  tableName: "stock_adjustment",
  modelName: 'StockAdjustment',
  paranoid: true,
})

 export class StockAdjustment extends Model{
  // @PrimaryKey
  // @Column({
  //   type: DataType.INTEGER,
  //   autoIncrement: true
  // })
  // id!: number;
  
  @Index
  @Column({
    type: DataType.DATEONLY,
    validate: {
      isDate: true
    }
  })
  date!: string;

  
  @ForeignKey(() => Products)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  product!: number;

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
  quantity_counted!: number;

  @Index
  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isNumeric: true
    }
  })
  quantity_expected!: number;

  
  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isNumeric: true,
      notNull: true
    }
  })
  current_price!: number;

  @ForeignKey(() => Users)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  created_by!: number;

  @Column({
    allowNull: true,
    type: DataType.STRING
  })
  code!: string;

  @CreatedAt
  created_on!: string;


  @Column({
    type: DataType.STRING
  })
  category!: string;

  @Column({
    type: DataType.STRING
  })
  size!: string;

  @Column({
    type: DataType.DATEONLY,
    validate: {
      isDate: true,
    }
  })
  expiry!: string;

  @Column({
    type: DataType.STRING
  })
  comments!: string;

  @Index
  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0,
    validate: {
      isNumeric: true
    }
  })
  quantity_expired!: number;

  @Index
  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0,
    validate: {
      isNumeric: true
    }
  })
  quantity_damaged!: number;


  @Column({
    type: DataType.STRING
  })
  unit!: string;
  
 
}




