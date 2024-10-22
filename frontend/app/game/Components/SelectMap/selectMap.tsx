import { useRef, useEffect, useState, useContext } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/bundle'
import { A11y, Autoplay, EffectCoverflow, EffectCube, Navigation, Pagination, Scrollbar } from 'swiper/modules';

import './selectMap.styles.css';
import Link from 'next/link';
import Image from 'next/image';
import { MapContext } from '../../mode/play/contexts/MapContext';

export default function SelectMap() {
	const { Map, setMap } = useContext(MapContext);

	const handleSlideChange = (swiper: any) => {
		if (swiper.activeIndex == 0)
			setMap("defaultMap");
		else if (swiper.activeIndex == 1)
			setMap("autoMap");
		else if (swiper.activeIndex == 2)
			setMap("classicMap");
		else if (swiper.activeIndex == 3)
			setMap("iceMap");
		else if (swiper.activeIndex == 4)
			setMap("bananaMap");
	};

	return (
		<main className='w-full h-full  overflow-auto '>
			<div className='w-full h-full rounded-3xl bg-[url("/images/background/chooseMapBg/backGround.svg")] bg-no-repeat bg-cover relative min-h-[680px]'>
				<div className="justify-stretch  flex flex-col  relative z-[1]  w-full h-full">
					<div className="mt-5  flex flex-1 justify-center items-center">
						<Image
							src="/images/background/chooseMapBg/topArrows.svg"
							alt="topArrows"
							width={900}
							height={120}
							draggable={false}
						/>
					</div>
					<div className=' flex-1 '>
						<Swiper
							className='swiperM'
							onSlideChange={(swiper) => {
								handleSlideChange(swiper)
							}}
							style={{
								backgroundImage: 'url("/images/background/chooseMapBg/band.svg")',
								backgroundSize: '1300px 500px',
								backgroundPosition: 'center'
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
							modules={[Navigation, EffectCoverflow, Autoplay]}
						>
							<SwiperSlide className='swiper-slideM'>
								<h1 className='bg-[black] text-center font-bold font-BeVietnamPro text-[white] w-[100px] mx-auto m-2 rounded-full p-1'>default</h1>
								<Image src="/images/maps/defaultMap.svg" alt="defaultMap" width={500} height={500} />
							</SwiperSlide>
							<SwiperSlide className='swiper-slideM'>
								<h1 className='bg-[#FF4646] text-center font-bold font-BeVietnamPro text-[#3D3D3D] w-[100px] mx-auto m-2 rounded-full p-1'>auto</h1>
								<Image src="/images/maps/autoMap.svg" alt="autoMap" width={500} height={500} />
							</SwiperSlide>
							<SwiperSlide className='swiper-slideM'>
								<h1 className='bg-[#DADADA] text-center font-bold font-BeVietnamPro text-[#3D3D3D] w-[100px] mx-auto m-2 rounded-full p-1'>classic</h1>
								<Image src="/images/maps/classicMap.svg" alt="classicMap" width={500} height={500} />
							</SwiperSlide >
							<SwiperSlide className='swiper-slideM'>
								<h1 className='bg-[#A2F9FF] text-center font-bold font-BeVietnamPro text-[#3D3D3D] w-[100px] mx-auto m-2 rounded-full p-1'>ice</h1>
								<Image src="/images/maps/iceMap.svg" alt="iceMap" width={500} height={500} />
							</SwiperSlide>
							<SwiperSlide className='swiper-slideM'>
								<h1 className='bg-[#F3C853] text-center font-bold font-BeVietnamPro text-[#008000] w-[100px] mx-auto m-2 rounded-full p-1'>banana</h1>
								<Image src="/images/maps/bananaMap.svg" alt="bananaMap" width={500} height={500} />
							</SwiperSlide>
						</Swiper>
						<div className=''>
							<Link href={'../game/mode'} className='bg-[#FF4646] hover:bg-[#ff4646cb] text-center block font-bold font-BeVietnamPro text-white text-base w-[100px] mx-auto rounded-lg p-3'>
								Select
							</Link>
						</div>
					</div>
					<div className=" flex-1 flex justify-center items-center">
						<Image
							src="/images/background/chooseMapBg/botArrows.svg"
							alt="botArrows"
							width={900}
							height={120}
							draggable={false}
						/>
					</div>
				</div>
			</div >
		</main>
	)
}
