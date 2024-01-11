import {Autocomplete, Chip, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {NavigateFunction, useLoaderData, useNavigate, useSearchParams} from "react-router-dom";
import Tag from "../interfaces/Tag";
import fetchWithHeader from "../helper/fetchWithHeader";
import Post from "../interfaces/Post";
import textChipColour from "../helper/textChipColour";
import getTextFieldValue from "../helper/getTextFieldValue";
import TextEditor from "../components/TextEditor";


function TagSelection(props: {
    tags?: Tag[]
    setSelected: Function
}) {
    const tags = (useLoaderData() as any).data as Tag[]
    const updateModeTags = props.tags as Tag[]

    useEffect(() => {
        if (updateModeTags !== undefined) {
            props.setSelected(updateModeTags)
        }
    }, []);

    return (
        <Autocomplete
            multiple
            options={tags}
            onChange={(_, tags) => props.setSelected(tags)}
            defaultValue={updateModeTags}
            getOptionLabel={(option: Tag) => option.tag_text}
            renderInput={(params) => (
                <TextField {...params} label="Tags" />
            )}
            renderTags={(value, getTagProps) =>
                value.map((tag: Tag, index: number) =>
                    (<Chip
                        variant="filled"
                        label={tag.tag_text}
                        sx={{ bgcolor: tag.colour, color: textChipColour(tag.colour) }}
                        {...getTagProps({ index })}
                    />))
            }
        />
    );
}

function MainTextFields(props: {
    navigate: NavigateFunction,
    selectedTags: Tag[],
    setSelectedTags: Function
}) {
    return (
        <div className="main-textfields">
            <TextField id="create_post_title" label="Title" multiline />
            <TagSelection setSelected={props.setSelectedTags} />
            <TextField id="create_post_image" label="Image's URL" multiline />
            <TextEditor
                postURL="/posts"
                method="POST"
                buttonText="Post"
                fillJSON={(str: string) => {
                    const title = getTextFieldValue("create_post_title")
                    let image: string | null = getTextFieldValue("create_post_image")
                    if (image === "")
                        image = null
                    const selectedTagsId = props.selectedTags.map(tag => tag.id)
                    return {post: {title: title, body: str, tag_ids: selectedTagsId, image: image}}
                }}
                onSuccessFunc={(_: string, resData: any) => props.navigate(`/posts/${resData.id}`)}
                placeholder="Body"
            />
        </div>
    )
}

function MainTextFieldsUpdate(props: {
    post: Post,
    navigate: NavigateFunction,
    selectedTags: Tag[],
    setSelected: Function
}) {
    const post = props.post as Post

    return (
        <div className="main-textfields">
            <TextField id="create_post_title" label="Title" defaultValue={post.title} multiline />
            <TagSelection setSelected={props.setSelected} tags={post.tags} />
            <TextField id="create_post_image" label="Image's URL" defaultValue={post.image} multiline />
            <TextEditor
                postURL={`/posts/${post.id}`}
                method="PATCH"
                buttonText="Patch"
                fillJSON={(str: string) => {
                    const title = getTextFieldValue("create_post_title")
                    let image: string | null = getTextFieldValue("create_post_image")
                    if (image === "")
                        image = null
                    const selectedTagsId = props.selectedTags.map(tag => tag.id)
                    return {post: {title: title, body: str, tag_ids: selectedTagsId, image: image}}
                }}
                onSuccessFunc={() => props.navigate(`/posts/${post.id}`)}
                defaultValue={post.body}
            />
        </div>
    )
}

function Guidelines() {
    return (
        <div className="section-container">
            <p className="section-title-text">Rules & Guidelines</p>
            <p id="guideline-body">
                Nothing is True, Everything is Permitted
            </p>
        </div>
    );
}

export default function MakeUpdatePostRoute() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [selectedTags, setSelectedTags] = useState<Tag[]>([])
    const [post, setPost] = useState<Post>()

    let post_id = searchParams.get("post_id")
    if (post_id === null) {
        post_id = "-1"
    }

    useEffect(() => {
        if (post_id === "-1")
            return
        fetchWithHeader(`/posts/${post_id}`, "GET")
            .then(res => setPost(res.data as Post))
    }, []);

    return (
        <>
            <Guidelines/>

            <div className="section-container">
                {
                    post === undefined
                    ? <MainTextFields
                            navigate={navigate}
                            selectedTags={selectedTags}
                            setSelectedTags={setSelectedTags}
                        />
                    : <MainTextFieldsUpdate
                            post={post}
                            navigate={navigate}
                            selectedTags={selectedTags}
                            setSelected={setSelectedTags}
                        />
                }
            </div>
        </>
    );
}