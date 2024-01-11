import Underline from '@tiptap/extension-underline'
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import StarterKit from '@tiptap/starter-kit'
import {Button} from "@mui/material";
import {useRef, useState} from "react";
import {
    LinkBubbleMenu,
    MenuButtonBlockquote,
    MenuButtonBold,
    MenuButtonBulletedList,
    MenuButtonEditLink,
    MenuButtonItalic,
    MenuButtonOrderedList,
    MenuButtonStrikethrough,
    MenuButtonSubscript,
    MenuButtonSuperscript,
    MenuButtonUnderline,
    MenuControlsContainer,
    MenuDivider,
    MenuSelectHeading,
    LinkBubbleMenuHandler,
    RichTextEditor,
    type RichTextEditorRef
} from "mui-tiptap";
import ErrorText from "./ErrorText";
import fetchWithHeader from "../helper/fetchWithHeader";
import parseError from "../helper/parseError";
import parseString from "../helper/parseString";

export default function TextEditor(props: {
    postURL: string,
    method: "PATCH" | "POST",
    buttonText: string,
    fillJSON: (editorValue: string) => any, //expose text editor value
    onSuccessFunc: (editorValue: string, resData: any) => void, //expose text editor value and res received
    placeholder?: string,
    defaultValue?: string
}) {
    const rteRef = useRef<RichTextEditorRef>(null)
    const [error, setError] = useState<string>("")
    const placeholder = props.placeholder

    async function onClick() {
        const html = parseString(rteRef.current?.editor?.getHTML())
        const res = await fetchWithHeader(props.postURL, props.method,
            (props.fillJSON(parseString(html)) as any))
        if (res.status === "success") {
            setError("Success")
            props.onSuccessFunc(html, res.data)
            return
        }

        setError(parseError(res.message))
    }

    return (
        <div style={{ marginBottom: "10px" }}>
            <RichTextEditor
                ref={rteRef}
                extensions={
                [   StarterKit,
                    Underline,
                    Placeholder.configure({ placeholder }),
                    Superscript.extend({ excludes: "subscript" }),
                    Subscript.extend({ excludes: "superscript" }),
                    Link
                        .extend({ inclusive: false })
                        .configure({autolink: false, linkOnPaste: false}),
                    LinkBubbleMenuHandler,
                ]
                }
                content={props.defaultValue}
                renderControls={() => (
                    <MenuControlsContainer>
                        <MenuSelectHeading />
                        <MenuDivider />
                        <MenuButtonBold />
                        <MenuButtonItalic />
                        <MenuButtonUnderline />
                        <MenuButtonStrikethrough />
                        <MenuButtonSuperscript />
                        <MenuButtonSubscript />
                        <MenuDivider />
                        <MenuButtonEditLink />
                        <MenuButtonBulletedList />
                        <MenuButtonOrderedList />
                        <MenuButtonBlockquote />
                    </MenuControlsContainer>
                )}
            >
                {() => (
                    <>
                        <LinkBubbleMenu />
                    </>
                )}
            </RichTextEditor>

            <ErrorText error={error} />

            <Button
                variant="contained"
                disableElevation
                onClick={onClick}
            >
                {props.buttonText}
            </Button>
        </div>
    )
}