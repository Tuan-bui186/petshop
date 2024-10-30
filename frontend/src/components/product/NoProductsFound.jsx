import NoProductsFoundImg from "../../assets/no-products-found.png";

const NoProductsFound = () => {
  return (
    <div className="text-center pb-4">
      <img src={NoProductsFoundImg} alt="Không tìm thấy sản phẩm" width={400} />
      <p className="mt-3">Không tìm thấy sản phẩm nào!</p>
    </div>
  );
};

export default NoProductsFound;
