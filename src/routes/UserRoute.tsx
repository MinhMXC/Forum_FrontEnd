import {useLoaderData} from "react-router-dom";
import UserSection from "../components/UserSection";

export default function UserRoute(prop: any) {
    const user = (useLoaderData() as any).data

    return (
        <div style={{ width: prop.width }}>
            <UserSection {...user} />
        </div>
    );
}