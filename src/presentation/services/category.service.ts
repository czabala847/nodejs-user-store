import { CategoryModel } from "../../data"
import {
  CreateCategoryDto,
  CustomError,
  PaginationDto,
  UserEntity,
} from "../../domain"

export class CategoryService {
  constructor() {}

  async createCategory(createCategoryDto: CreateCategoryDto, user: UserEntity) {
    const categoryExists = await CategoryModel.findOne({
      name: createCategoryDto.name,
    });

    if (categoryExists) {
      throw CustomError.badRequest("Category already exists");
    }

    try {
      const newCategory = new CategoryModel({
        ...createCategoryDto,
        user: user.id,
      });

      await newCategory.save();

      return {
        id: newCategory._id.toString(),
        name: newCategory.name,
        available: newCategory.available,
      };
    } catch (error) {
      throw CustomError.internalServerError("Internal server error");
    }
  }

  async getCategories(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const total = await CategoryModel.countDocuments();
      const categories = await CategoryModel.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      const newCategories = categories.map((category: any) => ({
        id: category._id.toString(),
        name: category.name,
        available: category.available,
      }));

      return {
        categories: newCategories,
        page,
        limit,
        total,
        next: `api/categories?page=${page + 1}&limit=${limit}`,
        previous:
          page - 1 > 0
            ? `api/categories?page=${page - 1}&limit=${limit}`
            : null,
      };
    } catch (error) {
      throw CustomError.internalServerError("Internal server error");
    }
  }
}
