import React from "react";
import DiscutionField from "./discution-field";
import { Room } from "@/app/dtos/room.dto";

interface Props {
  rooms: Room[];
  check: boolean;
}
const Discutions = ({ rooms, check }: Props) => {
  return (
    <div className="overflow-y-auto">
      {rooms &&
        rooms.map((room, index) => (
          <DiscutionField key={index} check={check} RoomItem={room} />
        ))}
    </div>
  );
};

export default Discutions;
