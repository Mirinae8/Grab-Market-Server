module.exports = function (sequelize, DataTypes) {
  // sequelize는 테이블이 없을때만 동작하므로 테이블 내용이 수정되면 DB에 따로 반영해줘야 한다
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
    soldout: {
      // sqllite는 불리언타입 지원하지 않아서 정수형으로 구현
      type: DataTypes.INTEGER(1),
      allowNull: false,
      // 값을 넣지 않았을때 기본 값
      defaultValue: 0,
    },
  });

  return product;
};
