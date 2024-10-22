import { useContext } from "react";
import { MapContext } from "../contexts/MapContext";
import Image from 'next/image';


export default function LeftPanel() {

    const { Map, setMap } = useContext(MapContext);

    const LeftPanelSrc = '/images/background/gameBg/' + Map + '/leftPanel.svg';


    return (
        <main className="flex h-full w-full">
            <Image width={200} height={200} className="w-full object-cover h-full bg-[#3D3D3D]" src={LeftPanelSrc} draggable={false} alt="LeftPanel" />
        </main>
    )
}
