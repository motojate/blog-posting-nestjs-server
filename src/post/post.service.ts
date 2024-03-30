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
    const updatedPost = await this.prisma.post.update({
      where: {
        userId,
        id: postId,
      },
      data: {
        content,
      },
    });
    if (!updatedPost) throw new ForbiddenException('권한이 없습니다.');
    else return updatedPost;
  }

  async deletePost(userId: number, postId: number) {
    const deletedPost = await this.prisma.post.delete({
      where: {
        userId,
        id: postId,
      },
    });
    if (!deletedPost) throw new ForbiddenException('권한이 없습니다.');
    else return deletedPost;
  }
}
