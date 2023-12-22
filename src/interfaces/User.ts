import Post from "./Post";
import Comment from "./Comment";

export default interface User {
    id: number,
    username: string,
    image: string,
    bio: string,
    created_at: number,
    updated_at: number,
    posts: Post[],
    comments: Comment[],
}