module.exports = (sequelize, DataTypes) => {
  const Url = sequelize.define('Url', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    url_original: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url_encurtada: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    cliques: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,  // Permite valores nulos, pois é uma exclusão suave
    },
  }, {
    tableName: 'urls',
    timestamps: true, // Ativa createdAt e updatedAt automáticos
    paranoid: true,   // Ativa a exclusão suave
  });

  return Url;
};
