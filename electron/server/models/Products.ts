import { Table, Model, Column, DataType, ForeignKey, Index, CreatedAt, PrimaryKey } from "sequelize-typescript";

@Table({
  tableName: 'products',
  modelName: 'Products',
  paranoid: true,
})

export class Products extends Model {
  // @PrimaryKey
  // @Column({
  //   type: DataType.INTEGER,
  //   autoIncrement: true
  // })
  // id: number;

  @Index
  @Column({
    allowNull: false,
    unique: true,
    type: DataType.STRING
  })
  declare name: string;

  @Index
  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isNumeric: true
    }
  })
  declare price: number;

  @Index
  @Column({
    type: DataType.STRING
  })
  declare category: string;

  @Column({
    type: DataType.STRING
  })
  declare notes: string;

  @Column({
    type: DataType.STRING
  })
  declare unit: string;

  @Column({
    type: DataType.STRING
  })
  declare picture: string;

  @Index
  @CreatedAt
  declare created_on: string;

  @Index
  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isNumeric: true
    }
  })
  declare max_stock: number;

  @Index
  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isNumeric: true
    }
  })
  declare min_stock: number;

  @Index
  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true
    }
  })
  declare expiry: string;

  @Column({
    type: DataType.STRING
  })
  declare barcode: string;

  @Index
  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isNumeric: true
    }
  })
  declare current_stock: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true
  })
  declare last_modified: string;

  @Index
  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isNumeric: true
    }
  })
  declare cost_price: number;

  @Column({
    type: DataType.STRING
  })
  declare size: string;

  @Index
  @Column({
    type: DataType.STRING
  })
  declare description: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1
  })
  declare status: number;

  @Column({
    type: DataType.STRING
  })
  declare shelf: string;

  @Column({
    type: DataType.STRING
  })
  declare preferred_vendor: number;

  @Column({
    type: DataType.STRING
  })
  declare is_drug: string;

  @Column({
    type: DataType.STRING
  })
  declare generic_name: string;

  @Column({
    type: DataType.STRING
  })
  declare contraindications: string;

  @Column({
    type: DataType.STRING
  })
  declare pregnancy: string;

  @Column({
    type: DataType.STRING
  })
  declare side_effects: string;

  @Column({
    type: DataType.STRING
  })
  declare caution: string;

  @Column({
    type: DataType.STRING
  })
  declare indications: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    defaultValue: 1.33,
    validate: {
      isNumeric: true,
      isFloat: true
    }
  })
  declare markup: number;

  @Column({
    type: DataType.STRING
  })
  declare active_ingredients: string;

  @Column({
    type: DataType.STRING
  })
  declare drug_info: string;

  @Column({
    type: DataType.STRING
  })
  declare last_stock_modification: string;

  @Column({
    type: DataType.VIRTUAL,
    get() {
      return Date.parse(this.getDataValue('expiry')) < Date.now();
    },
  })
  declare expired: boolean;

  @Column({
    type: DataType.VIRTUAL,
    get() {
      return this.getDataValue('current_stock') < 1;
    },
  })
  declare out_of_stock: boolean;

  @Column({
    type: DataType.VIRTUAL,
    get() {
      return this.getDataValue('current_stock') > 0 &&
        this.getDataValue('current_stock') <= this.getDataValue('min_stock');
    },
  })
  declare near_min: boolean;

  @Column({
    type: DataType.VIRTUAL,
    get() {
      return this.getDataValue('current_stock') > 0 &&
        this.getDataValue('current_stock') >= this.getDataValue('max_stock');
    },
  })
  declare near_max: boolean;



  stock_value?: number
  selling_value?: number;
  cost_value?: number


}



