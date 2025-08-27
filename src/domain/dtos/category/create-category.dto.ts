export class CreateCategoryDto {
  private constructor(
    public readonly name: string,
    public readonly available: boolean
  ) {}

  static create(props: { [key: string]: any }): [string?, CreateCategoryDto?] {
    const { name, available = false } = props;
    let availableBoolean = available;

    if (!name) return ["Name is required", undefined];

    if (typeof available !== "boolean") {
      availableBoolean = available === "true";
    }

    return [undefined, new CreateCategoryDto(name, availableBoolean)];
  }
}
