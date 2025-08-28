import { Validators } from '../../../config'

export class CreateProductDto {
  private constructor(
    public readonly name: string,
    public readonly available: boolean,
    public readonly price: number,
    public readonly description: string,
    public readonly category: string,
    public readonly user: string
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateProductDto?] {
    const { name, available, price, description, category, user } = object;

    if (!name) return ["Name is required", undefined];
    if (!category) return ["Category is required", undefined];
    if (!Validators.isMongoId(category)) return ["Category is not a valid MongoDB ID", undefined];
    
    if (!user) return ["User is required", undefined];
    if (!Validators.isMongoId(user)) return ["User is not a valid MongoDB ID", undefined];

    return [
      undefined,
      new CreateProductDto(name, !!available, price, description, category, user),
    ];
  }
}
