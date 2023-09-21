module.exports = function (sequelize, DataTypes) {
  const product = sequelize.define("Product", {
    // 각각 컬럼
    name: {
      // 데이터 타입
      type: DataTypes.STRING(20),
      // 널 허용 여부
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    seller: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
  });

  return product;
};
