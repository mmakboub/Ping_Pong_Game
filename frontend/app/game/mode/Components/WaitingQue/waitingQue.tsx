import React, { useEffect, useState } from "react";
import './waitingQue.css'
import { socket } from "../../play/contexts/WebSocketContext";

export default function waitingQue(props: any) {

    return (props.trigger) && (
        <main className="popup z-20">
            <div className="popup-inner">
                <div className=" mb-8">
                    {props.children}
                </div>
                <button className="close-btn bg-[#FF4646] hover:bg-[#ff4646cb] text-center block font-bold font-BeVietnamPro text-white text-base w-[140px] mx-auto m-2 rounded-[13px] p-2"
                onClick={() => {
                    props.setTrigger(false);
                    socket.emit("cancel", {
						roomID: props.roomId,
						playerNo: props.localPlayerNo,
                        playerUsername: props.Username
                    });
                }}>Cancel</button>
            </div>
        </main>
    );
}
