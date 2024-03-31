import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/public/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(createPostDto: CreatePostDto) {
    const { userId, title, content } = createPostDto;
    return this.prisma.post.create({
      data: {
        userId,
        title,
        content,
      },
    });
  }

  async getAllPosts() {
    return this.prisma.post.findMany();
  }

  async getPost(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
    });
  }

  async updatePost(updatePostDto: UpdatePostDto) {
    const { userId, postId, content } = updatePostDto;

    return this.prisma.$transaction(async (tx) => {
      const post = await tx.post.findUnique({
        where: { id: postId },
        select: { userId: true },
      });

      if (!post || post.userId !== userId)
        throw new ForbiddenException('접근 권한이 없습니다.');

      return tx.post.update({
        where: { id: postId },
        data: { content },
      });
    });
  }

  async deletePost(userId: number, postId: number) {
    return this.prisma.$transaction(async (tx) => {
      const post = await tx.post.findUnique({
        where: { id: postId },
        select: { userId: true },
      });

      if (!post || post.userId !== userId)
        throw new ForbiddenException('접근 권한이 없습니다.');

      return tx.post.delete({
        where: { id: postId },
      });
    });
  }
}
