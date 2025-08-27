export class PaginationDto {
  private constructor(public page: number, public limit: number) {}

  static create(
    page: number = 1,
    limit: number = 10
  ): [string?, PaginationDto?] {
    if (isNaN(page) || isNaN(limit)) {
      return ["Page and limit must be numbers", undefined];
    }

    if (page <= 0) return ["Page must be greater than 0", undefined];
    if (limit <= 0) return ["Limit must be greater than 0", undefined];

    return [undefined, new PaginationDto(page, limit)];
  }
}
