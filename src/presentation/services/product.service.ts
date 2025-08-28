import { ProductModel } from "../../data"
import { CreateProductDto, CustomError, PaginationDto } from "../../domain"

export class ProductService {
  constructor() {}

  async createProduct(createProductDto: CreateProductDto) {
    const productExists = await ProductModel.findOne({
      name: createProductDto.name,
    }).lean();

    if (productExists) {
      throw CustomError.badRequest("Product already exists");
    }

    try {
      const newProduct = new ProductModel(createProductDto);
      await newProduct.save();

      return newProduct;
    } catch (error) {
      throw CustomError.internalServerError("Internal server error");
    }
  }

  async getProducts(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const total = await ProductModel.countDocuments();
      const products = await ProductModel.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .populate("user", "name email")
        .populate("category", "name available");

      return {
        products,
        page,
        limit,
        total,
        next: `api/products?page=${page + 1}&limit=${limit}`,
        previous:
          page - 1 > 0 ? `api/products?page=${page - 1}&limit=${limit}` : null,
      };
    } catch (error) {
      throw CustomError.internalServerError("Internal server error");
    }
  }
}
