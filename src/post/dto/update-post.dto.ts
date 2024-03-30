export class UpdatePostDto {
  constructor(
    public readonly userId: number,
    public readonly postId: number,
    public readonly content: string,
  ) {}

  static create({
    userId,
    postId,
    content,
  }: {
    userId: number;
    postId: number;
    content?: string;
  }) {
    return new UpdatePostDto(userId, postId, content);
  }
}
