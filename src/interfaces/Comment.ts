import SimpleUser from "./SimpleUser";

export default interface Comment {
    id: number,
    body: string,
    comments_likes_count: number,
    comments_dislikes_count: number,
    userState: number,
    owner: boolean,
    created_at: number,
    updated_at: number,
    post_id: number,
    user: SimpleUser,
    comments: Comment[],
}