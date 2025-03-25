import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Default,
} from "sequelize-typescript";

@Table({
  tableName: "analytics",
  timestamps: true,
})
class Analytic extends Model {
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  public ip?: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  public shortUrl?: string;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
  })
  public clickCount?: number;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(20),
  })
  public alias?: string;
}

export default Analytic;
