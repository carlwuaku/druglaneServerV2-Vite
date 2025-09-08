import { Table, Model, Column, DataType, ForeignKey, CreatedAt, Index, PrimaryKey } from "sequelize-typescript";
import { Products } from "./Products";
import { Users } from "./Users";


@Table({
  tableName: 'ProductBatches',
  modelName: 'ProductBatches',
  paranoid: true,
})
export class ProductBatches extends Model {
  // @PrimaryKey
  // @Column({
  //   type: DataType.INTEGER,
  //   autoIncrement: true
  // })
  // id: number;

  @Column({
    type: DataType.STRING
  })
  declare batch_number: string;

  @Column({
    type: DataType.DATEONLY
  })
  declare expiry: string;
  @Column({
    type: DataType.STRING
  })
  declare barcode: string;

  @ForeignKey(() => Products)
  @Column({
    type: DataType.INTEGER
  })
  declare product: number;

  @Column({
    type: DataType.STRING
  })
  declare purchase_code: string;

}
