import { Table, Model, Column,   CreatedAt, DataType, UpdatedAt } from "sequelize-typescript";

@Table({
   tableName: 'drug_info',
  modelName: 'DrugInfo',
  paranoid: true,
})

export class DrugInfo extends Model{
  @Column({
    type: DataType.STRING
  })
  name!: string;

  @Column({
    type: DataType.STRING
  })
  pregnancy!: string;

  @Column({
    type: DataType.STRING
  })
  pharmacodynamics!: string;

  @Column({
    type: DataType.STRING
  })
  indications_and_usage!: string;
  @Column({
    type: DataType.STRING
  })
  contraindications!: string;
  @Column({
    type: DataType.STRING
  })
  drug_interactions_table!: string;
  @Column({
    type: DataType.STRING
  })
  warnings_and_cautions!: string;
  @Column({
    type: DataType.STRING
  })
  dosage_and_administration!: string;
  @Column({
    type: DataType.STRING
  })
  adverse_reactions!: string;
  @Column({
    type: DataType.STRING
  })
  information_for_patients!: string;
  @Column({
    type: DataType.STRING
  })
  clinical_pharmacology!: string;
  @Column({
    type: DataType.STRING
  })
  drug_abuse_and_dependence!: string;
  @Column({
    type: DataType.STRING
  })
  teratogenic_effects!: string;
  @Column({
    type: DataType.STRING
  })
  geriatric_use!: string;
  @Column({
    type: DataType.STRING
  })
  overdosage!: string;

  @CreatedAt
  created_on!: string;
  
}
