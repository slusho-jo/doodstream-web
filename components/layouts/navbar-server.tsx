import doodstream from "@/lib/doodstream";
import { NavbarContent } from "./navbar";

export default async function NavbarServer() {
    const data = await doodstream.listFolders({ fld_id: "" });
    const folders = data.result.folders;
    return <NavbarContent folders={folders} />;
}
