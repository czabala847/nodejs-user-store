import { Request, Response } from "express"
import { CreateProductDto, CustomError, PaginationDto } from "../../domain"
import { ProductService } from "../services"

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal server error" });
  };

  createProduct = (req: Request, res: Response) => {
    const [error, createProductDto] = CreateProductDto.create(req.body);

    if (error) return res.status(400).json({ error });

    res.json({
      message: "Product",
      createProductDto,
    });

    this.productService
      .createProduct(createProductDto!)
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };

  getProducts = (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;

    const [error, paginationDto] = PaginationDto.create(
      Number(page),
      Number(limit)
    );

    if (error) return res.status(400).json({ error });

    this.productService
      .getProducts(paginationDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };
}
