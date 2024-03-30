export class CreatePostDto {
  constructor(
    public readonly title: string,
    public readonly userId: number,
    public readonly content?: string,
  ) {}

  static create({
    title,
    userId,
    content,
  }: {
    title: string;
    userId: number;
    content?: string;
  }) {
    return new CreatePostDto(title, userId, content);
  }
}
