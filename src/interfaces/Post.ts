import SimpleUser from "./SimpleUser";

export default interface Post {
    id: number,
    title: string,
    body: string,
    like_count: number,
    dislike_count: number,
    image: string | null,
    visited: boolean,
    comments_count: number,
    created_at: number,
    updated_at: number,
    user: SimpleUser
}