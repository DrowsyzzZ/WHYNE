import { Link } from 'react-router-dom';
import wine1 from '../assets/wines/wine-1.png';
import wine2 from '../assets/wines/wine-2.png';
import wine3 from '../assets/wines/wine-3.png';
import wine4 from '../assets/wines/wine-4.png';
import { Header } from '../components/layout/Header';

export function LandingPage() {
  return (
    <>
      <Header />
      <main className="overflow-hidden bg-white text-black">
        <section className="relative min-h-108 overflow-hidden bg-amber-600 text-[#f2f4f8] tablet:min-h-170.75 desktop:min-h-182.5">
          <div className="relative z-10 container-whyne pt-25.5 pl-5.5 tablet:pt-35.5 tablet:pl-15 desktop:pt-45">
            <h1 className="text-2xl leading-9 font-bold tracking-[-0.03em] tablet:text-[32px] tablet:leading-11.5">
              한 곳에서 관리하는
              <br />
              나만의 와인창고
            </h1>
          </div>
          <img
            aria-hidden="true"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            src={wine1}
          />
        </section>

        <section className="mx-auto mt-4 w-full pb-18 tablet:mt-6.75 tablet:max-w-285 tablet:pb-22.5 desktop:mt-8.75 desktop:pb-37.75">
          <section className="grid justify-items-end gap-5 py-6 pl-4 tablet:gap-8 tablet:py-8.75 tablet:pl-8 desktop:grid-cols-[1fr_auto] desktop:items-center desktop:gap-35 desktop:py-10.75 desktop:pl-0">
            <div className="w-full px-4 tracking-[-0.02em] tablet:px-5.75">
              <h2 className="text-2xl leading-6 font-semibold text-[#2d3034] tablet:leading-8">
                매달 새롭게 만나는
                <br />
                와인 추천 콘텐츠
              </h2>
              <p className="mt-2 text-sm leading-5 text-[#a3a3a3] tablet:mt-4 tablet:text-base tablet:leading-6">
                매달 다양한 인기 와인을 만나보세요.
              </p>
            </div>
            <div className="max-h-117.5 overflow-hidden rounded-tl-[40px] rounded-bl-[40px] desktop:h-117.5">
              <img
                alt="이번 달 추천 와인 목록"
                className="h-full w-full object-contain"
                src={wine2}
              />
            </div>
          </section>

          <section className="grid justify-items-start gap-5 py-6 pr-4 tablet:gap-8 tablet:py-8.75 tablet:pr-8 desktop:grid-cols-[auto_1fr] desktop:items-center desktop:gap-35 desktop:py-10.75 desktop:pr-0">
            <div className="w-full px-4 tracking-[-0.02em] tablet:px-5.75 desktop:order-2">
              <h2 className="text-2xl leading-6 font-semibold text-[#2d3034] tablet:leading-8">
                다양한 필터로 찾는
                <br />내 맞춤 와인
              </h2>
              <p className="mt-2 text-sm leading-5 text-[#a3a3a3] tablet:mt-4 tablet:text-base tablet:leading-6">
                와인 타입, 가격, 평점으로
                <br />
                나에게 맞는 와인을 쉽게 검색해요.
              </p>
            </div>
            <div className="max-h-117.5 overflow-hidden rounded-tr-[40px] rounded-br-[40px] desktop:order-1 desktop:h-117.5">
              <img
                alt="와인 타입, 가격, 평점 필터 화면"
                className="h-full w-full object-contain"
                src={wine3}
              />
            </div>
          </section>

          <section className="grid justify-items-end gap-5 py-6 pl-4 tablet:gap-8 tablet:py-8.75 tablet:pl-8 desktop:grid-cols-[1fr_auto] desktop:items-center desktop:gap-35 desktop:py-10.75 desktop:pl-0">
            <div className="w-full px-4 tracking-[-0.02em] tablet:px-5.75">
              <h2 className="text-2xl leading-6 font-semibold text-[#2d3034] tablet:leading-8">
                직관적인
                <br />
                리뷰 시스템
              </h2>
              <p className="mt-2 text-sm leading-5 text-[#a3a3a3] tablet:mt-4 tablet:text-base tablet:leading-6">
                더 구체화된 리뷰 시스템으로
                <br />
                쉽고 빠르게 와인 리뷰를 살펴보세요.
              </p>
            </div>
            <div className="max-h-117.5 overflow-hidden rounded-tl-[40px] rounded-bl-[40px] desktop:h-117.5">
              <img
                alt="와인 상세 정보와 사용자 리뷰 화면"
                className="h-full w-full object-contain"
                src={wine4}
              />
            </div>
          </section>

          <Link
            className="mx-auto mt-11.25 flex min-h-10.5 max-w-68 items-center justify-center rounded bg-primary text-sm leading-4.5 font-medium text-gray-100 transition-colors hover:bg-primary-hover tablet:mt-[60px] tablet:min-h-12.5 tablet:max-w-70.75 tablet:text-[16px] tablet:leading-5 desktop:mt-18.5"
            to="/wines"
          >
            와인 보러가기
          </Link>
        </section>
      </main>
    </>
  );
}
