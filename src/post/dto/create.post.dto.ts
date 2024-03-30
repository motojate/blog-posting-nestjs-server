export class CreatePostDto {
  constructor(
    public readonly title: string,
    public readonly userId: number,
    public readonly content?: string,
  ) {}
}
