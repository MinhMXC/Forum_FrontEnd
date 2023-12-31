import SimpleUser from "./SimpleUser";
import Tag from "./Tag";

export default interface Post {
    id: number,
    title: string,
    body: string,
    posts_likes_count: number,
    posts_dislikes_count: number,
    image: string | null,
    visited: boolean,
    comments_count: number,
    deleted: boolean,
    userState: number,
    owner: boolean,
    created_at: number,
    updated_at: number,
    user: SimpleUser,
    tags: Tag[]
}