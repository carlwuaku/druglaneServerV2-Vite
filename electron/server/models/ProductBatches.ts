import { Table, Model, Column, DataType, ForeignKey, CreatedAt, Index, PrimaryKey } from "sequelize-typescript";
import { Products } from "./Products";
import { Users } from "./Users";


@Table({
  tableName: 'ProductBatches',
  modelName: 'ProductBatches',
  paranoid: true,
})
export class ProductBatches extends Model{
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true
  })
  id!: number;
  
  @Column({
    type: DataType.STRING
  })
  batch_number!: string;

  @Column({
    type: DataType.DATEONLY
  })
  expiry!: string;
  @Column({
    type: DataType.STRING
  })
  barcode!: string;

  @ForeignKey(() => Products)
  @Column({
    type: DataType.INTEGER
  })
  product!: number;

  @Column({
    type: DataType.STRING
  })
  purchase_code!: string;

}
