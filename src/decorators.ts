import {GqlExecutionContext} from "@nestjs/graphql";
import {createParamDecorator, ExecutionContext} from "@nestjs/common";

export const GraphQLRequest = createParamDecorator(
    (data: never, ctx: ExecutionContext) => {
        const gqlContext = GqlExecutionContext.create(ctx);
        return gqlContext.getContext().req;
    },
);

export const User = createParamDecorator<JWTUser>(
    (data: never, ctx: ExecutionContext) => {
        const gqlContext = GqlExecutionContext.create(ctx);

        if(!gqlContext.getContext().req.user == null) {
            throw new Error('User is not present in context. Make sure you have an @UseGuards(AuthGuard) in place.')
        }

        return gqlContext.getContext().req.user as JWTUser;
    },
);
