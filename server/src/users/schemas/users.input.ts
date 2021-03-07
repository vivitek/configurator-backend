import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserCreationInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  username: string;
}

@InputType()
export class UserUpdateInput {
  @Field()
  _id: string;
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  password?: string;
}
