import SimpleUser from "./SimpleUser";

export default interface Comment {
    id: number,
    body: string,
    like_count: number,
    dislike_count: number,
    created_at: number,
    updated_at: number,
    user: SimpleUser,
    comments: Comment[]
}