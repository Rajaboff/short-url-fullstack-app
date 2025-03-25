import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  AllowNull,
} from "sequelize-typescript";

@Table({
  tableName: "links",
  timestamps: true,
})
class Link extends Model {
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  public shortUrl?: string;

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
  })
  public originalUrl?: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(20),
  })
  public alias?: string;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
  })
  public expiresAt?: Date | null;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
  })
  public clickCount?: number;

  @AllowNull(true)
  @Column({
    type: DataType.JSON,
  })
  public analytics?: object[];
}

export default Link;
