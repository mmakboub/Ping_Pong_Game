"use client"

import React, { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react";

interface MapContextProps {
    Map: string;
    setMap: Dispatch<SetStateAction<string>>;
  }

export const MapContext = createContext<MapContextProps>({
    Map: "autoMap",
    setMap: () => {},
});

export const MapProvider = ({ children }: {children: ReactNode}) => {
    const [Map, setMap] = useState<string>("autoMap");

    return (
        <MapContext.Provider value={{ Map, setMap}}>
            {children}
        </MapContext.Provider>
    );
};

