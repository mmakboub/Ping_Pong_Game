
import { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/bundle'
import { EffectCoverflow, Navigation } from 'swiper/modules';

import './selectMode.styles.css';
import Link from 'next/link';
import Image from 'next/image';
import WaitingQue from '../WaitingQue/waitingQue';
import { socket } from '../../play/contexts/WebSocketContext';
import { useRouter } from 'next/navigation';
import { useGlobalUserContext } from '@/app/context/UserDataContext';


export default function SelectMode() {
	const { userData } = useGlobalUserContext();
	const router = useRouter();
	const slide = useRef("random");
	const handleSlideChange = (swiper: any) => {
		// if (swiper.activeIndex == 0)
		// 	slide.current = "ai";
		// else if (swiper.activeIndex == 1)
		// 	slide.current = "random";
		// else if (swiper.activeIndex == 2)
		// 	slide.current = "playWithFriend";
	};

	const roomId = useRef(0);
	const [Que, setQue] = useState(false);
	const [isAcceptButtonVisible, setAcceptButtonVisibility] = useState(false);
	const [isAcceptButtonDisabled, setAcceptButtonDisabled] = useState(false);
	const [isPlayGameButtonDisabled, setPlayGameButtonDisabled] = useState(false);
	const [localPlayerNo, setLocalPlayerNo ] = useState(0);
	const [p1username, setP1username] = useState("");
	const [p2username, setP2username] = useState("");
	const [p1picture, setP1picture] = useState("/images/background/selectModeBg/loadingInRed.svg");
	const [p2picture, setP2picture] = useState("/images/background/selectModeBg/loadingInRed.svg");

	let playerNo: number;
	const handleAcceptClick = () => {
		setAcceptButtonDisabled(true);
		socket.emit("accept", {
			roomID: roomId.current,
			playerNo: localPlayerNo
		});
	};
	useEffect(() => {
		socket.connect();
		socket.on("roomId", (room) => {
			roomId.current = room.id;
		});
		socket.on("playerInfo", (playerInfo: any) => {
			if (playerInfo.playerNo == 1) {
				setP1username(playerInfo.username);
				setP1picture(playerInfo.picture);
			}
			else if (playerInfo.playerNo == 2) {
				setP2username(playerInfo.username);
				setP2picture(playerInfo.picture);
			}
			setLocalPlayerNo(playerInfo.playerNo);
			setQue(true);
		}); 
		// Math.floor(.xp/250)
		
		socket.on("matchUp", (room) => {
			if (localPlayerNo == 1) {
				setP1username(room.players[0].username);
				setP1picture(room.players[0].picture);
				setP2username(room.players[1].username);
				setP2picture(room.players[1].picture);
			} else if (localPlayerNo == 0 || localPlayerNo == 2) {
				setP1username(room.players[0].username);
				setP1picture(room.players[0].picture);
				setP2username(room.players[1].username);
				setP2picture(room.players[1].picture);
			}
			setAcceptButtonVisibility(true);
		});

		socket.on("matchCancel", (NoOfplayerWhoCanceld: number, room: any) => {
			setAcceptButtonDisabled(false);
			setAcceptButtonVisibility(false);
			if (NoOfplayerWhoCanceld == 1) {
				if (localPlayerNo == 1) {
					setP1username("");
					setP1picture("/images/background/selectModeBg/loadingInRed.svg");
					setP2username("");
					setP2picture("/images/background/selectModeBg/loadingInRed.svg");
					setLocalPlayerNo(0);
				}
				if (localPlayerNo == 2) {
					setP2username("");
					setP2picture("/images/background/selectModeBg/loadingInRed.svg");
					setLocalPlayerNo(0);
					roomId.current = 0;
					if (room.players.length > 1) {
						setP1username(room.players[1].username);
						setP1picture(room.players[1].picture);
						setLocalPlayerNo(1);
					}

				}
			} else if (NoOfplayerWhoCanceld == 2) {
				setP2username("");
				setP2picture("/images/background/selectModeBg/loadingInRed.svg");
			};
		});

		socket.on("bothAccepted", (receivedRoomId) => {
			console.log(roomId.current);
			if (receivedRoomId == roomId.current) {
				roomId.current = 0;
				router.push('mode/play');
			}
		});

		return () => {
			socket.off('roomId');
			socket.off('matchUp');
			socket.off('matchCancel');
			socket.off('playerNo');
			socket.off("bothAccepted");
		};
	}, [localPlayerNo, router]);

	return (
		<div className='w-full h-full rounded-3xl relative'>
			<main className='w-full h-full rounded-3xl relative'>
				<div className=' flex flex-col relative w-full h-full justify-between  rounded-3xl bg-[url("/images/background/chooseModeBg.svg")] bg-no-repeat bg-cover  min-h-[680px] items-center overflow-auto '>
					<div className="flex w-full">
						<Image className='w-full'
							src="/images/background/selectModeBg/topElement.svg"
							alt="topElement"
							width={900}
							height={120}
							draggable={false}
						/>
					</div>
					<div className=" relative justify-center flex flex-col  w-full">
						<div className='p-3'>
							<Swiper
								onSlideChange={(swiper) => {
									handleSlideChange(swiper)
								}}
								effect={'coverflow'}
								initialSlide={1}
								grabCursor={false}
								centeredSlides={true}
								slidesPerView={'auto'}
								coverflowEffect={{
									rotate: 50,
									stretch: 0,
									depth: 100,
									modifier: 1,
									slideShadows: false,
								}}
								navigation={true}
								modules={[Navigation, EffectCoverflow]}
								className='swiperS'
							>
								{/* <SwiperSlide className='swiper-slideS'>
									<Image width={350} height={350} src="/images/modes/ai.svg" alt="ai" />
								</SwiperSlide> */}
								<SwiperSlide className='swiper-slideS'>
									<Image width={350} height={350} src="/images/modes/random.svg" alt="random" />
								</SwiperSlide>
								{/* <SwiperSlide className='swiper-slideS'>
									<Image width={350} height={350} src="/images/modes/playWithFriend.svg" alt="playWithFriend" />
								</SwiperSlide> */}
							</Swiper>
							<div>
								<div className=''>
									<button className='bg-[#FF4646] hover:bg-[#ff4646cb] text-center block font-bold font-BeVietnamPro text-white text-base w-[160px] mx-auto m-3 rounded-[13px] p-3 mt-4'
										disabled={isPlayGameButtonDisabled}
										onClick={() => {
												const userInfo = {
													username: userData.username,
													picture: userData.pictureUrl
												}
												socket.emit('join', userInfo);
										}} >
										play game
									</button>
								</div>
							</div>
							<Link href={'../game/'} className='bg-[#FF4646] hover:bg-[#ff4646cb] text-center block font-bold font-BeVietnamPro text-white text-base w-[140px] mx-auto m-2 rounded-[13px] p-2 mt-4'>
								go back
							</Link>
						</div>
					</div>
					<div className="flex w-full">
						<Image className='w-full'
							src="/images/background/selectModeBg/botElement.svg"
							alt="botArrows"
							width={900}
							height={120}
							draggable={false}
						/>
					</div>
				</div>
			</main>
			<div className='z-20'>
				<WaitingQue trigger={Que} setTrigger={setQue} roomId={roomId.current} localPlayerNo={localPlayerNo} Username={userData.username}>
					<div className='flex flex-col'>
						<div className='shadow-2xl relative'>
							<Image width={600} height={400} draggable={false} src={'/images/background/selectModeBg/queBg.svg'} alt={''} />
							<div className='absolute inset-y-0 left-0 w-full' >
								<div className='flex flex-row h-full '>
									<div className='basis-1/3'>
										<div className="relative mx-3 mt-1">
											<Image className='' width={155} height={26} draggable={false} src={'/images/background/selectModeBg/bgUsernamePlayer1.svg'} alt={''} />
											<div className='absolute inset-0 text-center font-bold font-BeVietnamPro text-white text-xs sm:text-base'>
												{p1username}
											</div>
										</div>
										<div className='relative  mx-3 my-6'>
											<Image className='rounded-xl w-36 h-auto' width={150} height={100} src={p1picture} alt="/images/background/selectModeBg/loadingInRed.svg" />
										</div>
									</div>
									<div className='basis-1/3'>

									</div>
									<div className='basis-1/3 flex my-3 flex-col justify-end'>
										<div className='relative ml-5 my-6 '>
											<Image className='my-auto rounded-xl w-36 h-auto' width={150} height={100} src={p2picture} alt="/images/background/selectModeBg/loadingInRed.svg" />
										</div>
										<div className="relative ml-5">
											<Image className='' width={155} height={26} draggable={false} src={'/images/background/selectModeBg/bgUsernamePlayer2.svg'} alt={''} />
											<div className='text-xs sm:text-base absolute inset-0 text-center font-bold font-BeVietnamPro text-white'>
												{p2username}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className='flex items-center justify-center'>
							{isAcceptButtonVisible && (
								  <button
									className={`bg-[#FF4646] hover:bg-[#ff4646cb] text-center font-bold font-BeVietnamPro text-white text-xl w-[160px] mx-auto rounded-[13px] p-3 mt-4 
									${isAcceptButtonDisabled ? 'bg-gray-500 cursor-not-allowed hover:bg-gray-500' : ''}`}
									onClick={handleAcceptClick}
									disabled={isAcceptButtonDisabled}
								  >
									Accept
								  </button>
							)}
						</div>
					</div>
				</WaitingQue>
			</div>
		</div>
	)
}
